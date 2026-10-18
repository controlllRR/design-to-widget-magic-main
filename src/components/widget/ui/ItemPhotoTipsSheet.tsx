import { useWidgetConfig } from "@/widget/config";
import { BottomSheet } from "@/components/widget/ui/BottomSheet";
import { UploadTipsList } from "@/components/widget/ui/PhotoUploadTipsContent";

export interface ItemPhotoTipsSheetProps {
  open: boolean;
  onClose: () => void;
}

/** Подсказка «как выбрать фото?» для вещей / наборов — тексты из i18n (админка). */
export function ItemPhotoTipsSheet({ open, onClose }: ItemPhotoTipsSheetProps) {
  const { t } = useWidgetConfig();
  const sheet = t.screens.addSheet;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      ariaLabel={sheet.photoTipsTitle}
      title={sheet.photoTipsTitle}
      size="tall"
      scrollBody
      zIndex={60}
    >
      <UploadTipsList tips={sheet.photoTipsItems} />
    </BottomSheet>
  );
}
