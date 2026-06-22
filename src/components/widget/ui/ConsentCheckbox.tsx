import { Check } from "lucide-react";

/** Чекбокс согласия Start-page — 0.5px border, как в прототипе / Figma. */
export function ConsentCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start w-full min-w-0 text-left"
      style={{ gap: "var(--vf-sp-8)" }}
    >
      <span
        aria-hidden
        className="rounded-[2px] flex items-center justify-center shrink-0"
        style={{
          width: "clamp(14px, 4.4cqw, 16px)",
          height: "clamp(14px, 4.4cqw, 16px)",
          marginTop: 1,
          border: "0.5px solid var(--vf-text)",
          backgroundColor: checked ? "var(--vf-text)" : "transparent",
        }}
      >
        {checked && (
          <Check
            strokeWidth={3}
            style={{
              width: "clamp(10px, 3.3cqw, 12px)",
              height: "clamp(10px, 3.3cqw, 12px)",
              color: "var(--vf-surface)",
            }}
          />
        )}
      </span>
      <span
        className="flex-1 min-w-0 leading-[1.2]"
        style={{
          fontSize: "var(--vf-fs-12)",
          fontWeight: 300,
          color: "var(--vf-text)",
        }}
      >
        {label}
      </span>
    </button>
  );
}
