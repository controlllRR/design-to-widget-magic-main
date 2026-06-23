import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import profileDefault from "@/assets/generation/profile-default.png";
import { GENERATION_HERO } from "@/components/widget/screens/generation/data";

export interface SavedProfileSnapshot {
  portraitImage: string;
  photoMode: "own" | "model";
  modelId?: string | null;
}

export interface WidgetProfile {
  id: string;
  avatarImage: string;
  heroImage: string;
  isDefault?: boolean;
  modelId?: string | null;
}

interface WidgetProfileContextValue {
  profiles: WidgetProfile[];
  activeProfileIndex: number;
  setActiveProfileIndex: (index: number) => void;
  deleteActiveProfile: () => void;
  updateProfile: (index: number, profile: SavedProfileSnapshot) => void;
  saveProfile: (profile: SavedProfileSnapshot) => void;
  resetModelHero: () => void;
  heroImage: string;
  headerAvatar: string;
  /** @deprecated use activeProfileIndex */
  configuringProfileIndex: number;
  /** @deprecated use setActiveProfileIndex */
  setConfiguringProfileIndex: (index: number) => void;
}

const WidgetProfileContext = createContext<WidgetProfileContextValue | null>(null);

const DEFAULT_PROFILE_ID = "default";
const DEFAULT_HERO = GENERATION_HERO.generation;

export function profileAvatarImageStyle(): {
  objectFit: "cover";
  objectPosition: string;
} {
  return {
    objectFit: "cover",
    objectPosition: "center",
  };
}

function createDefaultProfile(): WidgetProfile {
  return {
    id: DEFAULT_PROFILE_ID,
    avatarImage: profileDefault,
    heroImage: DEFAULT_HERO,
    isDefault: true,
  };
}

export function WidgetProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<WidgetProfile[]>([createDefaultProfile()]);
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);

  const resetModelHero = useCallback(() => {
    setProfiles([createDefaultProfile()]);
    setActiveProfileIndex(0);
  }, []);

  const addModelProfile = useCallback((profile: SavedProfileSnapshot) => {
    if (profile.photoMode !== "model" || !profile.portraitImage) return;

    const id = `model-${profile.modelId ?? "custom"}-${Date.now()}`;
    const newProfile: WidgetProfile = {
      id,
      avatarImage: profile.portraitImage,
      heroImage: profile.portraitImage,
      modelId: profile.modelId,
    };

    setProfiles((prev) => {
      const next = [...prev, newProfile];
      setActiveProfileIndex(next.length - 1);
      return next;
    });
  }, []);

  const saveProfile = useCallback(
    (profile: SavedProfileSnapshot) => {
      if (profile.photoMode === "model") {
        addModelProfile(profile);
      }
    },
    [addModelProfile],
  );

  const deleteActiveProfile = useCallback(() => {
    const active = profiles[activeProfileIndex];
    if (!active || active.isDefault || profiles.length <= 1) return;

    const next = profiles.filter((_, i) => i !== activeProfileIndex);
    setProfiles(next);
    setActiveProfileIndex(Math.min(activeProfileIndex, next.length - 1));
  }, [profiles, activeProfileIndex]);

  const updateProfile = useCallback(
    (index: number, profile: SavedProfileSnapshot) => {
      if (profile.photoMode !== "model" || !profile.portraitImage) {
        setActiveProfileIndex(index);
        return;
      }

      setProfiles((prev) =>
        prev.map((p, i) => {
          if (i !== index) return p;
          return {
            ...p,
            avatarImage: profile.portraitImage,
            heroImage: profile.portraitImage,
            modelId: profile.modelId,
          };
        }),
      );
      setActiveProfileIndex(index);
    },
    [],
  );

  const activeProfile = profiles[activeProfileIndex] ?? profiles[0];
  const heroImage = activeProfile?.heroImage ?? DEFAULT_HERO;
  const headerAvatar = activeProfile?.avatarImage ?? profileDefault;

  const value = useMemo(
    (): WidgetProfileContextValue => ({
      profiles,
      activeProfileIndex,
      setActiveProfileIndex,
      deleteActiveProfile,
      updateProfile,
      saveProfile,
      resetModelHero,
      heroImage,
      headerAvatar,
      configuringProfileIndex: activeProfileIndex,
      setConfiguringProfileIndex: setActiveProfileIndex,
    }),
    [
      profiles,
      activeProfileIndex,
      deleteActiveProfile,
      updateProfile,
      saveProfile,
      resetModelHero,
      heroImage,
      headerAvatar,
    ],
  );

  return (
    <WidgetProfileContext.Provider value={value}>{children}</WidgetProfileContext.Provider>
  );
}

export function useWidgetProfile(): WidgetProfileContextValue {
  const ctx = useContext(WidgetProfileContext);
  if (!ctx) {
    throw new Error("useWidgetProfile must be used within WidgetProfileProvider");
  }
  return ctx;
}

export function useWidgetProfileOptional(): WidgetProfileContextValue | null {
  return useContext(WidgetProfileContext);
}
