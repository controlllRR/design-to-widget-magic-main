import { HangerIcon } from "@/components/widget/screens/generation/HangerIcon";

/** Figma `1183:16696` blur + `1183:16702` hanger + `1183:16698` label + slider dots. */
export function GenerationPreloaderOverlay({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 z-20"
      style={{ pointerEvents: "auto" }}
      aria-busy="true"
      aria-label={label}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingBottom: 28 }}
      >
        <HangerIcon size={68} />
        <span
          className="uppercase"
          style={{
            marginTop: 6,
            color: "var(--vf-text)",
            fontFamily: "var(--vf-font-body, Manrope, sans-serif)",
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "0.09em",
          }}
        >
          {label}
        </span>
      </div>

      <div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{ bottom: 22, gap: 22 }}
        aria-hidden
      >
        <span
          className="rounded-full"
          style={{ width: 6, height: 6, backgroundColor: "var(--vf-text)" }}
        />
        <span
          className="rounded-full"
          style={{ width: 4, height: 4, backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        />
        <span
          className="rounded-full"
          style={{ width: 4, height: 4, backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        />
      </div>
    </div>
  );
}
