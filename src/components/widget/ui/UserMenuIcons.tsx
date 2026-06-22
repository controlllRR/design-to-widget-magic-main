import type { UserMenuItemId } from "@/widget/config";
import iconClose from "@/assets/user-menu/icon-close.svg";
import iconHanger from "@/assets/user-menu/icon-hanger.svg";
import iconPinActive from "@/assets/user-menu/icon-pin-active.svg";
import iconPinInactive from "@/assets/user-menu/icon-pin-inactive.svg";
import iconProfile from "@/assets/user-menu/icon-profile.svg";
import iconProfileHeader from "@/assets/user-menu/icon-profile-header.svg";
import iconScissors from "@/assets/user-menu/icon-scissors.svg";
import iconWardrobe from "@/assets/user-menu/icon-wardrobe.svg";

const MENU_ICONS: Record<UserMenuItemId, string> = {
  profile: iconProfile,
  tryons: iconHanger,
  wardrobe: iconWardrobe,
  stylist: iconScissors,
};

/** Иконки user-menu — экспорт из Figma bridge (`674:3381`). */
export function UserMenuItemIcon({
  id,
  size = 22,
  tone = "on-dark",
  className,
}: {
  id: UserMenuItemId;
  size?: number;
  className?: string;
  /** on-dark — белые иконки в тёмной шапке; on-light — тёмные на светлом фоне. */
  tone?: "on-dark" | "on-light";
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={MENU_ICONS[id]}
      alt=""
      width={size}
      height={size}
      className={className}
      draggable={false}
      aria-hidden
      style={tone === "on-light" ? { filter: "brightness(0)" } : undefined}
    />
  );
}

export function UserMenuHeaderProfileIcon({ size = 24 }: { size?: number }) {
  return (
    <img
      src={iconProfileHeader}
      alt=""
      width={size}
      height={size}
      draggable={false}
      aria-hidden
    />
  );
}

export function UserMenuCloseIcon({ size = 22 }: { size?: number }) {
  return (
    <img src={iconClose} alt="" width={size} height={size} draggable={false} aria-hidden />
  );
}

export const USER_MENU_ARIA_LABELS: Record<UserMenuItemId, string> = {
  profile: "Открыть профиль",
  tryons: "Открыть мои примерки",
  wardrobe: "Открыть гардероб",
  stylist: "Открыть стилиста",
};

/** Булавка закрепления — Figma `674:3393` / `674:3397`. */
export function UserMenuPinIcon({
  active,
  size = 22,
}: {
  active: boolean;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={active ? iconPinActive : iconPinInactive}
      alt=""
      width={size}
      height={size}
      draggable={false}
      aria-hidden
    />
  );
}
