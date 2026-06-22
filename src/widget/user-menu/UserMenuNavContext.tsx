import { createContext, useContext, type ReactNode } from "react";
import type { UserMenuItemId } from "@/widget/config";

const UserMenuNavContext = createContext<((id: UserMenuItemId) => void) | null>(null);

export function UserMenuNavProvider({
  onSelect,
  children,
}: {
  onSelect: (id: UserMenuItemId) => void;
  children: ReactNode;
}) {
  return <UserMenuNavContext.Provider value={onSelect}>{children}</UserMenuNavContext.Provider>;
}

export function useUserMenuNav() {
  return useContext(UserMenuNavContext);
}
