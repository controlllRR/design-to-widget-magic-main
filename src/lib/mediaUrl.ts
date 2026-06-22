/** Расширения и MIME для видео-превью в плитках. */
const VIDEO_EXT = /\.(mp4|webm|mov)(\?|#|$)/i;

export function isVideoMediaRef(ref: string, blob?: Blob | null): boolean {
  if (blob?.type?.startsWith("video/")) return true;
  return VIDEO_EXT.test(ref);
}
