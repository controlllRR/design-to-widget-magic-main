import {
  POSE_IMAGES,
  POSE_LABELS,
  POSE_ROW_1,
  POSE_ROW_2,
  profileAdd,
  type PoseId,
} from "./data";
import profileEditPen from "@/assets/generation/profile-edit-pen.svg";
import {
  profileAvatarImageStyle,
  type WidgetProfile,
} from "@/widget/WidgetProfileContext";
import {
  selectionLineArtIconFilter,
  selectionTileStyle,
} from "@/components/widget/ui/selectionTile";
import { useWidgetConfig } from "@/widget/config";

/** Figma `723:3184` — бейдж pen-01 на User-photo 50×50. */
const EDIT_BADGE = {
  size: 24,
  icon: 16,
  top: -2,
  left: 30,
} as const;

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
  profiles,
  selected,
  onSelect,
  onAdd,
  onEdit,
  editLabel,
  addLabel,
}: {
  profiles: readonly WidgetProfile[];
  selected: number;
  onSelect: (index: number) => void;
  onAdd?: () => void;
  onEdit?: (index: number) => void;
  editLabel?: string;
  addLabel?: string;
}) {
  return (
    <div className="flex items-center flex-wrap" style={{ gap: 12 }}>
      {profiles.map((profile, i) => {
        const isSelected = selected === i;
        const avatarStyle = profileAvatarImageStyle();

        return (
          <div
            key={profile.id}
            className="relative shrink-0"
            style={{ width: 50, height: 50 }}
          >
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={isSelected}
              aria-label={`Профиль ${i + 1}`}
              className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
              style={{
                opacity: !isSelected ? 0.55 : 1,
              }}
            >
              <img
                src={profile.avatarImage}
                alt=""
                className="block w-full h-full rounded-full"
                style={avatarStyle}
                draggable={false}
              />
            </button>
            {onEdit ? (
              <button
                type="button"
                aria-label={editLabel ?? "Редактировать профиль"}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(i);
                }}
                className="absolute z-[1] flex items-center justify-center"
                style={{
                  top: EDIT_BADGE.top,
                  left: EDIT_BADGE.left,
                  width: EDIT_BADGE.size,
                  height: EDIT_BADGE.size,
                  borderRadius: 20,
                  backgroundColor: "#ffffff",
                  padding: 4,
                }}
              >
                <img
                  src={profileEditPen}
                  alt=""
                  width={EDIT_BADGE.icon}
                  height={EDIT_BADGE.icon}
                  draggable={false}
                />
              </button>
            ) : null}
          </div>
        );
      })}
      {onAdd ? (
        <button
          type="button"
          aria-label={addLabel ?? "Добавить профиль"}
          onClick={onAdd}
          className="shrink-0 flex items-center justify-center rounded-full"
          style={{ width: 50, height: 50 }}
        >
          <img
            src={profileAdd}
            alt=""
            className="block w-full h-full rounded-full"
            draggable={false}
          />
        </button>
      ) : null}
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
