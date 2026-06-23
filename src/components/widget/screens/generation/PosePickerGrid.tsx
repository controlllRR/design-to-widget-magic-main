import {
  POSE_IMAGES,
  POSE_LABELS,
  POSE_ROW_1,
  POSE_ROW_2,
  PROFILE_AVATARS,
  type PoseId,
} from "./data";
import type { ProfileAvatarItem } from "@/widget/WidgetProfileContext";
import {
  selectionLineArtIconFilter,
  selectionTileStyle,
} from "@/components/widget/ui/selectionTile";
import { useWidgetConfig } from "@/widget/config";

function PoseThumb({
  id,
  selected,
  onToggle,
}: {
  id: PoseId;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={POSE_LABELS[id]}
      className="shrink-0 overflow-hidden flex items-center justify-center"
      style={{
        width: 67,
        height: 67,
        ...selectionTileStyle(selected, { radius: 8 }),
      }}
    >
      <img
        src={POSE_IMAGES[id]}
        alt=""
        className="w-[52px] h-[52px] object-contain"
        style={selectionLineArtIconFilter(selected)}
        draggable={false}
      />
    </button>
  );
}

export function PosePickerGrid({
  selected,
  onToggle,
}: {
  selected: ReadonlySet<PoseId>;
  onToggle: (id: PoseId) => void;
}) {
  const { t } = useWidgetConfig();
  const selectedLabels = [...POSE_ROW_1, ...POSE_ROW_2]
    .filter((id) => selected.has(id))
    .map((id) => POSE_LABELS[id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div className="flex overflow-x-auto vf-no-scrollbar" style={{ gap: 4 }}>
        {POSE_ROW_1.map((id) => (
          <PoseThumb
            key={id}
            id={id}
            selected={selected.has(id)}
            onToggle={() => onToggle(id)}
          />
        ))}
      </div>
      <div className="flex overflow-x-auto vf-no-scrollbar" style={{ gap: 4 }}>
        {POSE_ROW_2.map((id) => (
          <PoseThumb
            key={id}
            id={id}
            selected={selected.has(id)}
            onToggle={() => onToggle(id)}
          />
        ))}
      </div>
      <p
        className="text-xs lowercase pt-1"
        style={{ color: "var(--vf-text-muted)", fontSize: "var(--vf-fs-12)" }}
      >
        {t.createProfile.chosenPrefix}
        {selectedLabels.length > 0 ? selectedLabels.join(", ") : "—"}
      </p>
    </div>
  );
}

export function ProfileAvatarPicker({
  avatars = PROFILE_AVATARS,
  selected,
  onSelect,
}: {
  avatars?: readonly ProfileAvatarItem[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      {avatars.map((item, i) => {
        const isSelected = selected === i;
        const isPhoto = item.kind === "photo";

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={isSelected}
            aria-label={isPhoto ? `Профиль ${i + 1}` : "Добавить профиль"}
            className="shrink-0 relative flex items-center justify-center rounded-full"
            style={{
              width: 50,
              height: 50,
              overflow: "hidden",
              opacity: isPhoto && !isSelected && i !== 1 ? 0.55 : 1,
            }}
          >
            <img
              src={item.src}
              alt=""
              className="block w-full h-full rounded-full"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}

export function ConfiguringHeroPreview({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 block h-full w-full object-cover object-top"
      draggable={false}
    />
  );
}
