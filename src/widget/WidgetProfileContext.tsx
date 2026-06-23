import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import profile0 from "@/assets/generation/profile-0.png";
import profile1 from "@/assets/generation/profile-1.png";
import profileAdd from "@/assets/generation/profile-add.png";
import { GENERATION_HERO } from "@/components/widget/screens/generation/data";

export interface SavedProfileSnapshot {
  portraitImage: string;
  photoMode: "own" | "model";
  modelId?: string | null;
}

export type ProfileAvatarItem = { src: string; kind: "photo" | "add" };

interface WidgetProfileContextValue {
  portraitImage: string;
  configuringProfileIndex: number;
  setConfiguringProfileIndex: (index: number) => void;
  saveProfile: (profile: SavedProfileSnapshot) => void;
  heroImage: string;
  headerAvatar: string;
  profileAvatars: readonly ProfileAvatarItem[];
}

const WidgetProfileContext = createContext<WidgetProfileContextValue | null>(null);

export function WidgetProfileProvider({ children }: { children: ReactNode }) {
  const [portraitImage, setPortraitImage] = useState(profile0);
  const [configuringProfileIndex, setConfiguringProfileIndex] = useState(0);

  const saveProfile = (profile: SavedProfileSnapshot) => {
    setPortraitImage(profile.portraitImage);
    setConfiguringProfileIndex(0);
  };

  const heroImage = useMemo(() => {
    if (configuringProfileIndex === 0) return portraitImage;
    if (configuringProfileIndex === 1) return profile1;
    return GENERATION_HERO.generation;
  }, [portraitImage, configuringProfileIndex]);

  const profileAvatars = useMemo(
    (): readonly ProfileAvatarItem[] => [
      { src: portraitImage, kind: "photo" },
      { src: profile1, kind: "photo" },
      { src: profileAdd, kind: "add" },
    ],
    [portraitImage],
  );

  const value = useMemo(
    (): WidgetProfileContextValue => ({
      portraitImage,
      configuringProfileIndex,
      setConfiguringProfileIndex,
      saveProfile,
      heroImage,
      headerAvatar: portraitImage,
      profileAvatars,
    }),
    [portraitImage, configuringProfileIndex, heroImage, profileAvatars],
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
