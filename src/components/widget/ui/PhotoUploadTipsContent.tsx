import { Check, X } from "lucide-react";
import type { ReactNode } from "react";

export function ExampleTile({
  src,
  good,
  onClick,
}: {
  src: string;
  good: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!good || !onClick}
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "3 / 4",
        borderRadius: "var(--vf-radius-tile)",
        backgroundColor: "var(--vf-surface-muted)",
        cursor: good && onClick ? "pointer" : "default",
      }}
      aria-label={good ? "Пример хорошего фото" : "Пример неподходящего фото"}
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center top" }}
        loading="lazy"
      />
      <span
        aria-hidden
        className="absolute flex items-center justify-center rounded-full"
        style={{
          top: 6,
          right: 6,
          width: 22,
          height: 22,
          backgroundColor: good ? "#22a06b" : "#e63946",
          color: "#fff",
        }}
      >
        {good ? (
          <Check strokeWidth={3} style={{ width: 12, height: 12 }} />
        ) : (
          <X strokeWidth={3} style={{ width: 12, height: 12 }} />
        )}
      </span>
    </button>
  );
}

/** Первое предложение жирным (до точки). */
export function renderTip(text: string): ReactNode {
  const dotIndex = text.indexOf(".");
  if (dotIndex === -1) return text;
  const head = text.slice(0, dotIndex + 1);
  const rest = text.slice(dotIndex + 1);
  return (
    <>
      <strong style={{ fontWeight: 700 }}>{head}</strong>
      {rest}
    </>
  );
}

export function UploadTipsExamplesGrid({
  good,
  bad,
  onSelectGood,
}: {
  good: string[];
  bad: string[];
  onSelectGood?: (url: string) => void;
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "var(--vf-sp-8)",
      }}
    >
      {good.map((url) => (
        <ExampleTile
          key={url}
          src={url}
          good
          onClick={onSelectGood ? () => onSelectGood(url) : undefined}
        />
      ))}
      {bad.map((url) => (
        <ExampleTile key={url} src={url} good={false} />
      ))}
    </div>
  );
}

export function UploadTipsList({ tips }: { tips: string[] }) {
  return (
    <ul className="flex flex-col" style={{ gap: "var(--vf-sp-12)" }}>
      {tips.map((tip, i) => (
        <li key={i} className="flex items-start" style={{ gap: "var(--vf-sp-10)" }}>
          <span
            aria-hidden
            className="flex items-center justify-center shrink-0 rounded-full"
            style={{
              width: 18,
              height: 18,
              marginTop: 2,
              backgroundColor: "var(--vf-text)",
            }}
          >
            <Check
              strokeWidth={2.5}
              style={{ width: 11, height: 11, color: "var(--vf-surface)" }}
            />
          </span>
          <span
            style={{
              fontSize: "var(--vf-fs-13)",
              lineHeight: 1.45,
              color: "var(--vf-text)",
            }}
          >
            {renderTip(tip)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Сбалансированный перенос заголовка на 2 строки. */
export function renderBalancedTitle(text: string): ReactNode {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return text;
  const total = text.length;
  let bestIdx = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(" ").length;
    const right = total - left - 1;
    const diff = Math.abs(left - right);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return (
    <>
      {words.slice(0, bestIdx).join(" ")}
      <br />
      {words.slice(bestIdx).join(" ")}
    </>
  );
}
