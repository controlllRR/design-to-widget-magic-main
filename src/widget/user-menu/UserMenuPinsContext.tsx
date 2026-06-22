import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useWidgetConfig } from "@/widget/config";
import type { UserMenuItemId } from "@/widget/config";

const STORAGE_KEY = "vf:user-menu-pins:v1";

type UserMenuPinsContextValue = {
  pinnedIds: Set<UserMenuItemId>;
  togglePin: (id: UserMenuItemId) => void;
  headerPinnedIds: UserMenuItemId[];
};

const UserMenuPinsContext = createContext<UserMenuPinsContextValue | null>(null);

function readStoredPinIds(): UserMenuItemId[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserMenuItemId[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function UserMenuPinsProvider({ children }: { children: ReactNode }) {
  const { config } = useWidgetConfig();

  const defaultPinnedIds = useMemo(
    () => config.userMenu.items.filter((item) => item.pinned).map((item) => item.id),
    [config.userMenu.items],
  );

  const [pinnedIds, setPinnedIds] = useState<Set<UserMenuItemId>>(
    () => new Set(defaultPinnedIds),
  );

  useEffect(() => {
    const stored = readStoredPinIds();
    setPinnedIds(new Set(stored ?? defaultPinnedIds));
  }, [defaultPinnedIds]);

  const togglePin = useCallback((id: UserMenuItemId) => {
    if (id === "profile") return;
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      }
      return next;
    });
  }, []);

  const headerPinnedIds = useMemo(
    () =>
      config.userMenu.items
        .filter((item) => item.enabled && item.id !== "profile")
        .filter((item) => pinnedIds.has(item.id))
        .map((item) => item.id),
    [config.userMenu.items, pinnedIds],
  );

  const value = useMemo(
    () => ({ pinnedIds, togglePin, headerPinnedIds }),
    [pinnedIds, togglePin, headerPinnedIds],
  );

  return <UserMenuPinsContext.Provider value={value}>{children}</UserMenuPinsContext.Provider>;
}

export function useUserMenuPins(): UserMenuPinsContextValue {
  const value = useContext(UserMenuPinsContext);
  if (!value) {
    throw new Error("useUserMenuPins must be used within UserMenuPinsProvider");
  }
  return value;
}
