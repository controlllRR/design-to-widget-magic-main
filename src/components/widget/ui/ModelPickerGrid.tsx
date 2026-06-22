import { RadioDot } from "@/components/widget/ui/RadioDot";
import type { ProfileModelOption } from "@/widget/config/profile-models";

/** Сетка моделей — Figma `674:4802` / карточки `169.5×244`. */
export function ModelPickerGrid({
  models,
  selectedId,
  onSelect,
}: {
  models: ProfileModelOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="grid w-full min-w-0"
      style={{
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "var(--vf-sp-12)",
      }}
    >
      {models.map((model) => {
        const selected = selectedId === model.id;
        return (
          <button
            key={model.id}
            type="button"
            onClick={() => onSelect(model.id)}
            className="relative w-full min-w-0 overflow-hidden text-left"
            style={{
              aspectRatio: "169.5 / 244",
              borderRadius: "var(--vf-radius-tile)",
              backgroundColor: "var(--vf-surface-muted)",
            }}
          >
            <img
              src={model.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-top"
              draggable={false}
            />
            <span
              className="absolute top-0 left-0 flex items-center"
              style={{
                paddingTop: 16,
                paddingLeft: 16,
                paddingRight: 16,
                paddingBottom: 8,
              }}
            >
              <RadioDot active={selected} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
