import { Menu, X } from "lucide-react";
import profileAvatar from "@/assets/generation/profile-0.png";
import { BrandLogo } from "./BrandLogo";
import {
  USER_MENU_ARIA_LABELS,
  UserMenuCloseIcon,
  UserMenuHeaderProfileIcon,
  UserMenuItemIcon,
} from "@/components/widget/ui/UserMenuIcons";
import { useUserMenuPins } from "@/widget/user-menu/useUserMenuPins";
import { useUserMenuNav } from "@/widget/user-menu/UserMenuNavContext";

interface WidgetHeaderProps {
  onMenu?: () => void;
  onProfile?: () => void;
  onClose?: () => void;
  profileLabel?: string;
  /** Логотип по центру — только там, где есть в Figma (не Start-page). */
  showLogo?: boolean;
  /** Иконка слева: меню или закрытие (User-menu). */
  menuIcon?: "menu" | "close";
  /** Тёмная шапка user-menu. */
  variant?: "light" | "dark";
  /** Показывать закреплённые ярлыки после профиля. */
  showPinnedShortcuts?: boolean;
  /** User-menu: без правого крестика — Figma `674:3381`. */
  hideTrailingClose?: boolean;
  /** User-menu v1 — user-circle; v2 — фото. */
  profileVisual?: "avatar" | "user-circle";
  /** Цвет нижней границы шапки (user-menu: `#f6f6f6`). */
  headerBorderColor?: string;
}

/** Head-new — шапка виджета по Figma / прототипу. */
export function WidgetHeader({
  onMenu,
  onProfile,
  onClose,
  profileLabel = "профиль",
  showLogo = false,
  menuIcon = "menu",
  variant = "light",
  showPinnedShortcuts = true,
  hideTrailingClose = false,
  profileVisual = "avatar",
  headerBorderColor,
}: WidgetHeaderProps) {
  const menuAria = menuIcon === "close" ? "Закрыть меню" : "Меню";
  const isDark = variant === "dark";
  const fg = isDark ? "#ffffff" : "var(--vf-text)";
  const border = headerBorderColor
    ? `1px solid ${headerBorderColor}`
    : isDark
      ? "1px solid color-mix(in oklab, var(--vf-on-primary) 18%, transparent)"
      : "1px solid var(--vf-border)";

  const { headerPinnedIds } = useUserMenuPins();
  const onMenuNav = useUserMenuNav();

  return (
    <header className="flex items-center w-full min-w-0 shrink-0" style={{ borderBottom: border }}>
      <button
        type="button"
        aria-label={menuAria}
        disabled={!onMenu}
        onClick={onMenu}
        className="flex items-center justify-center shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ width: "var(--vf-sz-52)", height: "var(--vf-sz-52)" }}
      >
        {menuIcon === "close" ? (
          <UserMenuCloseIcon size={22} />
        ) : (
          <Menu
            strokeWidth={1.5}
            style={{
              width: "var(--vf-sz-22)",
              height: "var(--vf-sz-22)",
              color: fg,
            }}
          />
        )}
      </button>

      <button
        type="button"
        onClick={onProfile ?? onMenu}
        className="flex items-center shrink-0 min-w-0"
        style={{
          gap: "var(--vf-sp-6)",
          paddingInline: "var(--vf-sp-12)",
          paddingBlock: "var(--vf-sp-14)",
        }}
      >
        {profileVisual === "user-circle" ? (
          <UserMenuHeaderProfileIcon size={24} />
        ) : (
          <span
            className="shrink-0 overflow-hidden rounded-full"
            style={{ width: 24, height: 24 }}
          >
            <img
              src={profileAvatar}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </span>
        )}
        <span
          className="leading-[1.2] whitespace-nowrap lowercase"
          style={{
            fontSize: "var(--vf-fs-12)",
            fontWeight: 200,
            color: fg,
          }}
        >
          {profileLabel}
        </span>
      </button>

      {showPinnedShortcuts &&
        headerPinnedIds.map((id) => (
          <button
            key={`pin-${id}`}
            type="button"
            aria-label={USER_MENU_ARIA_LABELS[id]}
            onClick={() => onMenuNav?.(id)}
            className="flex items-center justify-center shrink-0"
            style={{ width: "var(--vf-sz-52)", height: "var(--vf-sz-52)" }}
          >
            <UserMenuItemIcon
              id={id}
              size={22}
              tone={isDark ? "on-dark" : "on-light"}
            />
          </button>
        ))}

      <div className="flex-1 min-w-0" />

      {showLogo ? (
        <div className="flex items-center justify-center shrink-0 px-3">
          <BrandLogo />
        </div>
      ) : null}

      {!hideTrailingClose && (
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="flex items-center justify-center shrink-0"
          style={{ width: "var(--vf-sz-52)", height: "var(--vf-sz-52)" }}
        >
          {isDark ? (
            <UserMenuCloseIcon size={22} />
          ) : (
            <X
              strokeWidth={1.5}
              style={{
                width: "var(--vf-sz-22)",
                height: "var(--vf-sz-22)",
                color: fg,
              }}
            />
          )}
        </button>
      )}
    </header>
  );
}
