export type ShareUrlResult = "shared" | "copied" | "cancelled" | "unavailable";

/** Web Share API с fallback на копирование ссылки в буфер. */
export async function shareUrl(options: {
  title: string;
  text?: string;
  url?: string;
}): Promise<ShareUrlResult> {
  const url = options.url ?? window.location.href;

  if (typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url,
      });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      // fall through
    }
  }

  return "unavailable";
}
