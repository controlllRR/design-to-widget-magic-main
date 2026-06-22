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
 * Grid: карточки скроллятся, согласия + CTA — отдельная строка снизу (без наложения на iOS).
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
      className="vf-start-page flex flex-col flex-1 w-full min-w-0 min-h-0 overflow-hidden"
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

      <div
        className="grid flex-1 min-h-0 min-w-0 w-full"
        style={{ gridTemplateRows: "minmax(0, 1fr) auto" }}
      >
        <div
          className="vf-start-scroll vf-scroll flex flex-col w-full min-w-0 min-h-0 overflow-y-auto"
          style={{ gap: "var(--vf-start-section-gap)" }}
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

        {/* Pro */}
        <button
          type="button"
          onClick={() => setVariant("pro")}
          aria-pressed={variant === "pro"}
          className="flex flex-col w-full min-w-0 text-left shrink-0"
          style={{
            gap: "var(--vf-sp-12)",
            paddingInline: "var(--vf-sp-12)",
            paddingBottom: "var(--vf-sp-8)",
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
      </div>

      {/* Футер вне скролла — отдельная grid-строка, кнопка не наезжает на чекбоксы */}
      <div className="vf-start-footer-block shrink-0 min-w-0">
        <div className="vf-start-consents">
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
        <button
          type="button"
          disabled={!canStart}
          onClick={() => canStart && onStart?.(variant)}
          className="vf-start-cta flex items-center justify-center w-full transition-colors min-w-0 disabled:cursor-not-allowed"
          style={{
            backgroundColor: canStart
              ? "var(--vf-btn-bg)"
              : "var(--vf-btn-bg-disabled)",
            borderRadius: "var(--vf-radius-button)",
            color: canStart ? "var(--vf-btn-text)" : "rgba(255,255,255,0.5)",
          }}
        >
          <span
            className="uppercase whitespace-nowrap"
            style={{
              fontFamily: "var(--vf-font-body)",
              fontSize: "var(--vf-fs-12)",
              fontWeight: 800,
              letterSpacing: "1.08px",
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
