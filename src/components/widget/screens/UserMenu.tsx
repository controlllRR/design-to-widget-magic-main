import { useWidgetConfig } from "@/widget/config";
import type { UserMenuItemId } from "@/widget/config";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { UserMenuItemIcon, UserMenuPinIcon } from "@/components/widget/ui/UserMenuIcons";
import { useUserMenuPins } from "@/widget/user-menu/useUserMenuPins";
import type { CSSProperties, MouseEvent } from "react";

export interface UserMenuProps {
  onClose: () => void;
  onSelect?: (id: UserMenuItemId) => void;
  /** Подсветка текущего раздела — Figma `#4a4b4d`. */
  activeId?: UserMenuItemId;
  /** v1 — иконка профиля; v2 — фото аватара в шапке (`1169:16134`). */
  variant?: "v1" | "v2";
}

const MENU_BG = "#343537";
const ROW_ACTIVE_BG = "#4a4b4d";
const LEGAL_COLOR = "#ced0d3";
const HEADER_BORDER = "#f6f6f6";

/**
 * User-menu — Figma `674:3381` / `1169:16134`.
 * Спеки: figma-bridge get_node, без cloud API.
 */
export function UserMenu({
  onClose,
  onSelect,
  activeId = "profile",
  variant = "v1",
}: UserMenuProps) {
  const { config } = useWidgetConfig();
  const { userMenu, locale, i18n } = config;
  const copy = i18n[locale];
  const isV2 = variant === "v2";
  const { pinnedIds, togglePin } = useUserMenuPins();

  const items = userMenu.items.filter((i) => i.enabled);
  const label = (id: UserMenuItemId) => copy.userMenu.items[id];

  const handleItem = (id: UserMenuItemId) => {
    onSelect?.(id);
  };

  const togglePinClick = (e: MouseEvent, id: UserMenuItemId) => {
    e.stopPropagation();
    togglePin(id);
  };

  const shellStyle: CSSProperties = {
    backgroundColor: MENU_BG,
    color: "#ffffff",
    fontFamily: "var(--vf-font-body)",
    borderRadius: "var(--vf-radius-widget)",
  };

  return (
    <div
      className="flex flex-col w-full flex-1 min-w-0 min-h-0 overflow-hidden"
      style={shellStyle}
    >
      <WidgetHeader
        variant="dark"
        menuIcon="close"
        hideTrailingClose
        profileVisual={isV2 ? "avatar" : "user-circle"}
        headerBorderColor={HEADER_BORDER}
        onMenu={onClose}
        onProfile={() => handleItem("profile")}
        profileLabel={label("profile")}
      />

      <div className="flex flex-col flex-1 min-h-0">
        <nav
          className="flex flex-col w-full min-w-0 shrink-0"
          style={{ paddingTop: "var(--vf-sp-32)" }}
          aria-label="Меню пользователя"
        >
          {items.map((item) => {
            const isActive = item.id === activeId;
            const isPinned = pinnedIds.has(item.id);
            const showPin = item.id !== "profile";

            return (
              <div
                key={item.id}
                className="flex items-center w-full min-w-0"
                style={{
                  minHeight: 46,
                  padding: "var(--vf-sp-12)",
                  gap: "var(--vf-sp-12)",
                  backgroundColor: isActive ? ROW_ACTIVE_BG : "transparent",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleItem(item.id)}
                  className="flex flex-1 items-center min-w-0 text-left"
                  style={{ gap: "var(--vf-sp-12)" }}
                >
                  <UserMenuItemIcon id={item.id} size={22} />
                  <span
                    className="flex-1 min-w-0 lowercase truncate"
                    style={{
                      fontSize: "var(--vf-fs-16)",
                      fontWeight: 500,
                      lineHeight: 1.4,
                      color: "#ffffff",
                    }}
                  >
                    {label(item.id)}
                  </span>
                </button>
                {showPin && (
                  <button
                    type="button"
                    aria-label={isPinned ? "Открепить из шапки" : "Закрепить в шапке"}
                    aria-pressed={isPinned}
                    onClick={(e) => togglePinClick(e, item.id)}
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: 22, height: 22 }}
                  >
                    <UserMenuPinIcon active={isPinned} size={22} />
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex-1 min-h-0" />

        <div className="shrink-0 w-full min-w-0">
          <div style={{ padding: "22px var(--vf-sp-12)" }}>
            <div style={{ height: 1, backgroundColor: LEGAL_COLOR }} />
          </div>
          {userMenu.legal.privacy.enabled && (
            <LegalRow
              href={userMenu.legal.privacy.href}
              label={copy.userMenu.legal.privacy}
            />
          )}
          {userMenu.legal.terms.enabled && (
            <LegalRow href={userMenu.legal.terms.href} label={copy.userMenu.legal.terms} />
          )}
          {userMenu.legal.dataConsent.enabled && (
            <LegalRow
              href={userMenu.legal.dataConsent.href}
              label={copy.userMenu.legal.dataConsent}
            />
          )}
          <div
            style={{
              paddingTop: 22,
              paddingInline: "var(--vf-sp-12)",
            }}
          >
            <div style={{ height: 1, backgroundColor: LEGAL_COLOR }} />
          </div>
        </div>

        <div
          className="shrink-0 w-full min-w-0"
          style={{ ["--vf-text" as string]: "#ffffff" } as CSSProperties}
        >
          <Watermark />
        </div>
      </div>
    </div>
  );
}

function LegalRow({ href, label }: { href?: string; label: string }) {
  const style: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    minWidth: 0,
    padding: "var(--vf-sp-8) var(--vf-sp-12)",
    fontSize: "var(--vf-fs-12)",
    fontWeight: 500,
    lineHeight: 1.4,
    color: LEGAL_COLOR,
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="lowercase transition-opacity hover:opacity-90 truncate"
        style={style}
      >
        {label}
      </a>
    );
  }

  return (
    <p className="lowercase truncate" style={style}>
      {label}
    </p>
  );
}
