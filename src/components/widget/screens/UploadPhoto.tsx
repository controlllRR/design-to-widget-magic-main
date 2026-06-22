import { Camera, ChevronRight, ImagePlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useWidgetConfig, type ProfilePhotoSlotId } from "@/widget/config";
import { defaultUploadExamples } from "@/widget/config/uploadExamples";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { PhotoSlot, PhotoUploadDialog } from "@/components/widget/ui";
import {
  primaryButtonStyle,
  profilePageTitleStyle,
  widgetScreenShellStyle,
} from "@/components/widget/ui/screenShell";

export interface UploadPhotoProps {
  onOpenMenu?: () => void;
  onClose?: () => void;
  onContinue?: () => void;
  onShowInfo?: () => void;
  /** Invalid state — Figma `1067:28005`. */
  variant?: "default" | "invalid";
}

function invalidPhotoPrefill(
  gender: "female" | "male",
  uploadExamples: typeof defaultUploadExamples,
): Partial<Record<ProfilePhotoSlotId, string>> {
  const ex = uploadExamples[gender];
  return {
    portrait: ex.portrait.bad[0],
    fullHeight: ex.fullHeight.bad[0],
  };
}

/** Upload photo ? Figma `674:3723`. */
export function UploadPhoto({
  onOpenMenu,
  onClose,
  onContinue,
  onShowInfo,
  variant = "default",
}: UploadPhotoProps) {
  const { config, t } = useWidgetConfig();
  const t_cp = t.createProfile;
  const cp = config.createProfile;
  const isInvalid = variant === "invalid";

  const photoSlots = useMemo(
    () => cp.photoSlots.filter((s) => s.enabled),
    [cp.photoSlots],
  );

  const [gender] = useState<"female" | "male">(cp.genders[0] ?? "female");
  const [photos, setPhotos] = useState<Partial<Record<ProfilePhotoSlotId, string>>>(() =>
    isInvalid ? invalidPhotoPrefill(gender, cp.uploadExamples) : {},
  );
  const [uploadSlot, setUploadSlot] = useState<ProfilePhotoSlotId | null>(null);
  const invalidSlotIds = useMemo(
    () =>
      isInvalid
        ? new Set<ProfilePhotoSlotId>(
            (["portrait", "fullHeight"] as ProfilePhotoSlotId[]).filter((id) =>
              photoSlots.some((s) => s.id === id),
            ),
          )
        : new Set<ProfilePhotoSlotId>(),
    [isInvalid, photoSlots],
  );

  const requiredPhotos = photoSlots.filter((s) => s.required).map((s) => s.id);
  const requiredDone = requiredPhotos.every((id) => Boolean(photos[id]));

  const openUpload = (id: ProfilePhotoSlotId) => setUploadSlot(id);

  return (
    <div className="flex flex-col flex-1 min-h-0" style={widgetScreenShellStyle}>
      <WidgetHeader
        onMenu={onOpenMenu}
        onProfile={onOpenMenu}
        onClose={onClose}
        profileLabel={t.start.profile}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div
          className="pt-4 pb-2"
          style={{ paddingInline: "var(--vf-sp-12)" }}
        >
          <h1 className="text-left" style={profilePageTitleStyle}>
            {t_cp.title}
          </h1>
          <p className="text-xs mt-2" style={{ color: "var(--vf-text-muted)" }}>
            {t_cp.photoHintOwn}{" "}
            <button
              type="button"
              onClick={onShowInfo}
              className="underline"
              style={{ color: "var(--vf-text)" }}
            >
              {t_cp.uploadDialog.showTips.toLowerCase()}
            </button>
          </p>
        </div>

        <div
          className="grid py-4"
          style={{
            paddingInline: "var(--vf-sp-12)",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "var(--vf-sp-12)",
          }}
        >
          {photoSlots.map((slot) => (
            <PhotoSlot
              key={slot.id}
              src={photos[slot.id]}
              label={t_cp.photoSlots[slot.id]}
              required={slot.required}
              fitMode={slot.fitMode}
              fillBg={slot.fillBg}
              invalid={invalidSlotIds.has(slot.id)}
              onUpload={() => openUpload(slot.id)}
              onRemove={() =>
                setPhotos((p) => {
                  const next = { ...p };
                  delete next[slot.id];
                  return next;
                })
              }
            />
          ))}
        </div>

        <div
          className="space-y-2.5 pb-4"
          style={{ paddingInline: "var(--vf-sp-12)" }}
        >
          <button
            type="button"
            onClick={() => openUpload("portrait")}
            className="flex items-center justify-between w-full px-4 rounded-lg border text-left text-xs lowercase"
            style={{
              height: "var(--vf-sz-46)",
              borderColor: "var(--vf-border)",
            }}
          >
            <span className="flex items-center gap-3">
              <Camera size={18} />
              {t_cp.uploadDialog.cameraBtn}
            </span>
            <ChevronRight size={16} style={{ color: "var(--vf-text-muted)" }} />
          </button>
          <button
            type="button"
            onClick={() => openUpload("portrait")}
            className="flex items-center justify-between w-full px-4 rounded-lg border text-left text-xs lowercase"
            style={{
              height: "var(--vf-sz-46)",
              borderColor: "var(--vf-border)",
            }}
          >
            <span className="flex items-center gap-3">
              <ImagePlus size={18} />
              {t_cp.uploadDialog.selectBtn}
            </span>
            <ChevronRight size={16} style={{ color: "var(--vf-text-muted)" }} />
          </button>
        </div>
      </div>

      <div className="pb-2 shrink-0" style={{ paddingInline: "var(--vf-sp-12)" }}>
        <button
          type="button"
          disabled={!requiredDone}
          onClick={onContinue}
          className="w-full text-xs font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
          style={primaryButtonStyle(requiredDone)}
        >
          {t_cp.cta}
        </button>
      </div>
      <Watermark />

      {uploadSlot && (
        <PhotoUploadDialog
          open
          slotId={uploadSlot}
          gender={gender}
          onClose={() => setUploadSlot(null)}
          onSelected={(url) => {
            setPhotos((p) => ({ ...p, [uploadSlot]: url }));
            setUploadSlot(null);
          }}
        />
      )}
    </div>
  );
}
