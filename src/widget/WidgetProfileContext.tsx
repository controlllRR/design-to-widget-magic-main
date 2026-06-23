import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import profile0 from "@/assets/generation/profile-0.png";
import profile1 from "@/assets/generation/profile-1.png";

export interface SavedProfileSnapshot {
  portraitImage: string;
  photoMode: "own" | "model";
  modelId?: string | null;
}

export type ProfileAvatarItem = { src: string; kind: "photo" | "add" };

interface WidgetProfileContextValue {
  /** Полноразмерное фото модели для hero (конфигурация + генерация). */
  portraitImage: string;
  configuringProfileIndex: number;
  setConfiguringProfileIndex: (index: number) => void;
  saveProfile: (profile: SavedProfileSnapshot) => void;
  heroImage: string;
  /** Маленький аватар только для шапки «профиль». */
  headerAvatar: string;
}

const WidgetProfileContext = createContext<WidgetProfileContextValue | null>(null);

export function WidgetProfileProvider({ children }: { children: ReactNode }) {
  const [portraitImage, setPortraitImage] = useState(profile0);
  const [configuringProfileIndex, setConfiguringProfileIndex] = useState(0);

  const saveProfile = (profile: SavedProfileSnapshot) => {
    setPortraitImage(profile.portraitImage);
    setConfiguringProfileIndex(0);
  };

  const heroImage = portraitImage;

  const headerAvatar =
    configuringProfileIndex === 1 ? profile1 : profile0;

  const value = useMemo(
    (): WidgetProfileContextValue => ({
      portraitImage,
      configuringProfileIndex,
      setConfiguringProfileIndex,
      saveProfile,
      heroImage,
      headerAvatar,
    }),
    [portraitImage, configuringProfileIndex, heroImage, headerAvatar],
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
