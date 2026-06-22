import { useWidgetConfig } from "@/widget/config";
import type { MeasureGuideKey } from "@/widget/config/measure-guide-images";
import {
  resolveMeasureGuideCard,
  SIZE_CHART_LEG_LENGTH_CARD,
} from "@/widget/config/measure-guide-images";
import { AnimatedSheetShell } from "@/components/widget/ui/AnimatedSheetShell";
import { Watermark } from "../Watermark";

export type ProfileHelpSheetKind =
  | { type: "measure"; fieldId: MeasureGuideKey }
  | { type: "sizeChart" };

interface ProfileHelpSheetProps {
  kind: ProfileHelpSheetKind | null;
  gender: "female" | "male";
  onClose: () => void;
  onOpenMeasure?: (fieldId: MeasureGuideKey) => void;
}

/**
 * Bottom-sheet по Figma (Info*.png): pixel-perfect карточки + таблица длины ног.
 */
export function ProfileHelpSheet({
  kind,
  gender,
  onClose,
  onOpenMeasure,
}: ProfileHelpSheetProps) {
  const { t } = useWidgetConfig();
  const t_cp = t.createProfile;
  const open = kind !== null;

  const measureCard =
    kind?.type === "measure"
      ? resolveMeasureGuideCard(kind.fieldId, gender)
      : undefined;

  const ariaLabel =
    kind?.type === "sizeChart"
      ? t_cp.legLengthSizeChart.title
      : kind?.type === "measure"
        ? (t_cp.measureGuides[kind.fieldId as keyof typeof t_cp.measureGuides]?.title ??
          t_cp.howToMeasure)
        : t_cp.howToMeasure;

  return (
    <AnimatedSheetShell
      open={open}
      onClose={onClose}
      ariaLabel={ariaLabel}
      panelStyle={{
        backgroundColor: "var(--vf-surface)",
        borderTopLeftRadius: "var(--vf-radius-widget)",
        borderTopRightRadius: "var(--vf-radius-widget)",
        maxHeight: "88%",
        boxShadow: "0 -12px 32px -16px rgba(0,0,0,0.25)",
      }}
      panelClassName="overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto min-h-0">
        {kind?.type === "measure" && measureCard ? (
          <img
            src={measureCard}
            alt=""
            className="block w-full h-auto max-w-[411px] mx-auto"
            draggable={false}
            decoding="async"
          />
        ) : kind?.type === "measure" && kind ? (
          <MeasureGuideFallback fieldId={kind.fieldId} />
        ) : kind?.type === "sizeChart" ? (
          <LegLengthSizeChart onHowToMeasure={() => onOpenMeasure?.("legLength")} />
        ) : null}
      </div>

      <Watermark />
    </AnimatedSheetShell>
  );
}

/** Запасной режим (en / нет PNG) — структурированный текст. */
function MeasureGuideFallback({ fieldId }: { fieldId: MeasureGuideKey }) {
  const { t } = useWidgetConfig();
  const guide =
    fieldId === "legLength"
      ? undefined
      : t.createProfile.measureGuides[fieldId as keyof typeof t.createProfile.measureGuides];

  if (!guide) {
    return (
      <p
        className="px-5 py-4"
        style={{
          fontSize: "var(--vf-fs-13)",
          color: "color-mix(in oklab, var(--vf-text) 70%, transparent)",
        }}
      >
        {t.createProfile.howToMeasure}
      </p>
    );
  }

  return (
    <div style={{ padding: "var(--vf-sp-20)" }}>
      <h2
        className="text-center uppercase"
        style={{
          fontFamily: "var(--vf-font-heading)",
          fontWeight: 700,
          fontSize: "var(--vf-fs-14)",
          marginBottom: "var(--vf-sp-12)",
        }}
      >
        {guide.title}
      </h2>
      <div
        style={{
          height: 1,
          backgroundColor: "color-mix(in oklab, var(--vf-text) 12%, transparent)",
          marginBottom: "var(--vf-sp-16)",
        }}
      />
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--vf-sp-12)",
        }}
      >
        {guide.steps.map((step, i) => (
          <li
            key={i}
            style={{ fontSize: "var(--vf-fs-13)", lineHeight: 1.5 }}
          >
            {step.label ? (
              <>
                <span style={{ fontWeight: 700 }}>
                  {i + 1}. {step.label}
                </span>{" "}
                {step.text}
              </>
            ) : (
              <>
                {i + 1}. {step.text}
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Таблица длины ног — Figma Info-8 (или PNG fallback). */
function LegLengthSizeChart({
  onHowToMeasure,
}: {
  onHowToMeasure?: () => void;
}) {
  const { t } = useWidgetConfig();
  const chart = t.createProfile.legLengthSizeChart;
  const useFigmaCard = SIZE_CHART_LEG_LENGTH_CARD;

  if (useFigmaCard) {
    return (
      <div className="relative w-full max-w-[411px] mx-auto">
        <img
          src={useFigmaCard}
          alt=""
          className="block w-full h-auto"
          draggable={false}
        />
        <button
          type="button"
          onClick={onHowToMeasure}
          className="absolute cursor-pointer"
          style={{
            left: "5%",
            bottom: "2.5%",
            width: "36%",
            minHeight: 44,
            opacity: 0,
            zIndex: 2,
          }}
          aria-label={chart.howToMeasureLink}
        />
      </div>
    );
  }

  const cols = [chart.columns.eu, chart.columns.gost, chart.columns.length];

  return (
    <div style={{ padding: "var(--vf-sp-20) var(--vf-sp-16)" }}>
      <h2
        className="text-center uppercase"
        style={{
          fontFamily: "var(--vf-font-heading)",
          fontWeight: 700,
          fontSize: "var(--vf-fs-13)",
          lineHeight: 1.35,
          letterSpacing: "0.01em",
          marginBottom: "var(--vf-sp-16)",
          paddingInline: "var(--vf-sp-8)",
        }}
      >
        {chart.title}
      </h2>

      <div className="w-full min-w-0 overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ fontSize: "var(--vf-fs-11)" }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "color-mix(in oklab, var(--vf-text) 55%, transparent)",
              }}
            >
              {cols.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  style={{
                    padding: "var(--vf-sp-10) var(--vf-sp-6)",
                    fontWeight: 500,
                    color: "var(--vf-surface)",
                    textAlign: "center",
                    borderRight:
                      i < cols.length - 1
                        ? "1px solid color-mix(in oklab, var(--vf-surface) 25%, transparent)"
                        : undefined,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr key={row.eu}>
                {[row.eu, row.gost, row.length].map((cell, i) => (
                  <td
                    key={i}
                    style={{
                      padding: "var(--vf-sp-10) var(--vf-sp-6)",
                      textAlign: "center",
                      fontWeight: 400,
                      color: "var(--vf-text)",
                      borderBottom:
                        "1px solid color-mix(in oklab, var(--vf-text) 10%, transparent)",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={onHowToMeasure}
        className="mt-4 text-left lowercase"
        style={{
          fontSize: "var(--vf-fs-12)",
          fontWeight: 400,
          color: "color-mix(in oklab, var(--vf-text) 65%, transparent)",
          textDecoration: "underline",
          textDecorationStyle: "dotted",
          textUnderlineOffset: 3,
        }}
      >
        {chart.howToMeasureLink}
      </button>
    </div>
  );
}
