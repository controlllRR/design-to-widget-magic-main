import { AddItemSheet } from "@/components/widget/ui/AddItemSheet";

export interface AddCustomUploadSheetProps {
  open: boolean;
  title: string;
  uploadLabel?: string;
  tipsLabel?: string;
  onClose: () => void;
  onSelected: (dataUrl: string, name?: string) => void;
}

/** Bottom sheet «добавить свой» — Figma Add your background / Add your pose. */
export function AddCustomUploadSheet({
  open,
  title,
  uploadLabel,
  tipsLabel,
  onClose,
  onSelected,
}: AddCustomUploadSheetProps) {
  return (
    <AddItemSheet
      open={open}
      title={title}
      uploadLabel={uploadLabel}
      tipsLabel={tipsLabel}
      onClose={onClose}
      onSubmit={({ preview, name }) => onSelected(preview, name || undefined)}
    />
  );
}
