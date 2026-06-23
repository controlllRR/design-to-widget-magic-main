import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import profile0 from "@/assets/generation/profile-0.png";
import profile1 from "@/assets/generation/profile-1.png";
import { GENERATION_HERO } from "@/components/widget/screens/generation/data";

export interface SavedProfileSnapshot {
  portraitImage: string;
  photoMode: "own" | "model";
  modelId?: string | null;
}

export type ProfileAvatarItem = { src: string; kind: "photo" | "add" };

interface WidgetProfileContextValue {
  configuringProfileIndex: number;
  setConfiguringProfileIndex: (index: number) => void;
  saveProfile: (profile: SavedProfileSnapshot) => void;
  resetModelHero: () => void;
  heroImage: string;
  headerAvatar: string;
}

const WidgetProfileContext = createContext<WidgetProfileContextValue | null>(null);

const DEFAULT_HERO = GENERATION_HERO.generation;

export function WidgetProfileProvider({ children }: { children: ReactNode }) {
  const [modelHeroImage, setModelHeroImage] = useState<string | null>(null);
  const [configuringProfileIndex, setConfiguringProfileIndex] = useState(0);

  const resetModelHero = useCallback(() => {
    setModelHeroImage(null);
    setConfiguringProfileIndex(0);
  }, []);

  const saveProfile = useCallback((profile: SavedProfileSnapshot) => {
    if (profile.photoMode === "model") {
      setModelHeroImage(profile.portraitImage);
    } else {
      setModelHeroImage(null);
    }
    setConfiguringProfileIndex(0);
  }, []);

  const heroImage = modelHeroImage ?? DEFAULT_HERO;

  const headerAvatar =
    configuringProfileIndex === 1 ? profile1 : profile0;

  const value = useMemo(
    (): WidgetProfileContextValue => ({
      configuringProfileIndex,
      setConfiguringProfileIndex,
      saveProfile,
      resetModelHero,
      heroImage,
      headerAvatar,
    }),
    [
      configuringProfileIndex,
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
