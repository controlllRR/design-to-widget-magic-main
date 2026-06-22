import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import expressImg from "@/assets/express-mannequin.png";
import { useWidgetConfig } from "@/widget/config";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { ConsentCheckbox, RadioDot } from "@/components/widget/ui";

export interface StartPageProps {
  onOpenUserMenu?: () => void;
  onClose?: () => void;
  onStart?: (variant: "express" | "pro") => void;
  /** Начальный выбранный вариант — alt Figma `674:4033`. */
  defaultVariant?: "express" | "pro";
}

/**
 * Start-page — Figma `674:3338`.
 * Pixel-perfect по прототипу: uppercase заголовки, fluid-токены, без scroll.
 */
export function StartPage({
  onOpenUserMenu,
  onClose,
  onStart,
  defaultVariant = "pro",
}: StartPageProps) {
  const { t } = useWidgetConfig();
  const ts = t.start;
  const [variant, setVariant] = useState<"express" | "pro">(defaultVariant);
  const [agreeData, setAgreeData] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const canStart = agreeData && agreePolicy;

  return (
    <div
      className="flex flex-col w-full h-full min-w-0 overflow-hidden"
      style={{
        fontFamily: "var(--vf-font-body)",
        backgroundColor: "var(--vf-surface)",
        color: "var(--vf-text)",
      }}
    >
      <WidgetHeader
        onMenu={onOpenUserMenu}
        onProfile={onOpenUserMenu}
        onClose={onClose}
        profileLabel={ts.profile}
      />

      <div className="flex flex-col flex-1 w-full min-w-0 min-h-0">
        <div
          className="flex flex-col w-full min-w-0 flex-1 min-h-0 overflow-y-auto vf-scroll"
          style={{ gap: "var(--vf-sp-24)" }}
        >
          {/* Title */}
          <div
            className="flex flex-col w-full min-w-0 shrink-0"
            style={{
              paddingTop: "var(--vf-sp-16)",
              paddingInline: "var(--vf-sp-12)",
            }}
          >
            <h1
              className="uppercase leading-none text-left"
              style={{
                fontFamily: "var(--vf-font-heading)",
                fontWeight: 700,
                fontSize: "var(--vf-fs-22)",
                letterSpacing: "0.01em",
                color: "var(--vf-text)",
              }}
            >
              {ts.title}
            </h1>
          </div>

          {/* Express */}
          <button
            type="button"
            onClick={() => setVariant("express")}
            aria-pressed={variant === "express"}
            className="flex flex-col w-full min-w-0 text-left shrink-0"
            style={{
              gap: "var(--vf-sp-12)",
              paddingInline: "var(--vf-sp-12)",
            }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: "var(--vf-h-card)",
                borderRadius: "var(--vf-radius-card)",
                backgroundColor: "var(--vf-surface-muted)",
                backgroundImage: `url(${expressImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute inset-0 flex items-start"
                style={{
                  paddingTop: "var(--vf-sp-16)",
                  paddingInline: "var(--vf-sp-16)",
                }}
              >
                <RadioDot active={variant === "express"} />
              </div>
            </div>
            <div
              className="flex items-start w-full min-w-0"
              style={{ gap: "var(--vf-sp-12)" }}
            >
              <ArrowRight
                className="shrink-0 mt-[2px]"
                strokeWidth={2}
                style={{
                  width: "var(--vf-sz-24)",
                  height: "var(--vf-sz-24)",
                  color: "var(--vf-text)",
                }}
              />
              <div
                className="flex flex-col flex-1 min-w-0 text-left"
                style={{ gap: "var(--vf-sp-6)", color: "var(--vf-text)" }}
              >
                <p
                  className="uppercase leading-[1.4]"
                  style={{
                    fontFamily: "var(--vf-font-heading)",
                    fontWeight: 700,
                    fontSize: "var(--vf-fs-16)",
                  }}
                >
                  {ts.expressTitle}
                </p>
                <p
                  className="leading-[1.2]"
                  style={{ fontWeight: 200, fontSize: "var(--vf-fs-12)" }}
                >
                  {ts.expressDesc}
                </p>
              </div>
            </div>
          </button>

          {/* Pro — светлая карточка с пунктирным кругом (Figma 674:3338) */}
          <button
            type="button"
            onClick={() => setVariant("pro")}
            aria-pressed={variant === "pro"}
            className="flex flex-col w-full min-w-0 text-left shrink-0"
            style={{
              gap: "var(--vf-sp-12)",
              paddingInline: "var(--vf-sp-12)",
            }}
          >
            <div
              className="relative w-full flex items-center justify-center overflow-hidden"
              style={{
                height: "var(--vf-h-card)",
                borderRadius: "var(--vf-radius-card)",
                backgroundColor: "var(--vf-surface-muted)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 flex items-start"
                style={{
                  paddingTop: "var(--vf-sp-16)",
                  paddingInline: "var(--vf-sp-16)",
                }}
              >
                <RadioDot active={variant === "pro"} />
              </div>
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: "clamp(86px, 27.5cqw, 103px)",
                  height: "clamp(86px, 27.5cqw, 103px)",
                  border: "1px dashed var(--vf-text)",
                }}
              >
                <Plus
                  strokeWidth={1.2}
                  style={{
                    width: "clamp(32px, 10.4cqw, 39px)",
                    height: "clamp(32px, 10.4cqw, 39px)",
                    color: "var(--vf-text)",
                  }}
                />
              </div>
            </div>
            <div
              className="flex items-start w-full min-w-0"
              style={{ gap: "var(--vf-sp-12)" }}
            >
              <ArrowRight
                className="shrink-0 mt-[2px]"
                strokeWidth={2}
                style={{
                  width: "var(--vf-sz-24)",
                  height: "var(--vf-sz-24)",
                  color: "var(--vf-text)",
                }}
              />
              <div
                className="flex flex-col flex-1 min-w-0 text-left"
                style={{ gap: "var(--vf-sp-6)", color: "var(--vf-text)" }}
              >
                <p
                  className="uppercase leading-[1.4]"
                  style={{
                    fontFamily: "var(--vf-font-heading)",
                    fontWeight: 700,
                    fontSize: "var(--vf-fs-16)",
                  }}
                >
                  {ts.proTitle}
                </p>
                <p
                  className="leading-[1.2]"
                  style={{ fontWeight: 200, fontSize: "var(--vf-fs-12)" }}
                >
                  {ts.proDesc}
                </p>
              </div>
            </div>
          </button>

          {/* Divider + checkboxes */}
          <div
            className="flex flex-col w-full min-w-0 shrink-0"
            style={{ gap: "var(--vf-sp-16)" }}
          >
            <div
              className="h-px w-full"
              style={{ backgroundColor: "var(--vf-border)" }}
              aria-hidden
            />
            <div
              className="flex flex-col w-full min-w-0"
              style={{
                gap: "var(--vf-sp-12)",
                paddingBottom: "clamp(18px, 5.85cqw, 22px)",
                paddingInline: "var(--vf-sp-12)",
              }}
            >
              <ConsentCheckbox
                checked={agreeData}
                onChange={setAgreeData}
                label={ts.agreeData}
              />
              <ConsentCheckbox
                checked={agreePolicy}
                onChange={setAgreePolicy}
                label={ts.agreePolicy}
              />
            </div>
          </div>
        </div>

        <div
          className="flex flex-col w-full min-w-0 shrink-0 vf-pb-safe"
          style={{
            paddingTop: "var(--vf-sp-12)",
            paddingInline: "var(--vf-sp-12)",
          }}
        >
          <button
            type="button"
            disabled={!canStart}
            onClick={() => canStart && onStart?.(variant)}
            className="flex items-center justify-center w-full transition-colors min-w-0 disabled:cursor-not-allowed"
            style={{
              gap: "var(--vf-sp-10)",
              height: "var(--vf-sz-46)",
              paddingInline: "var(--vf-sp-28)",
              paddingBlock: "var(--vf-sp-12)",
              backgroundColor: canStart
                ? "var(--vf-btn-bg)"
                : "var(--vf-btn-bg-disabled)",
              borderRadius: "var(--vf-radius-button)",
            }}
          >
            <span
              className="uppercase whitespace-nowrap"
              style={{
                fontFamily: "var(--vf-font-body)",
                fontSize: "var(--vf-fs-12)",
                fontWeight: 800,
                letterSpacing: "1.08px",
                color: canStart ? "var(--vf-btn-text)" : "rgba(255,255,255,0.5)",
              }}
            >
              {ts.cta.trim() || "продолжить"}
            </span>
          </button>
          <Watermark compact />
        </div>
      </div>
    </div>
  );
}
