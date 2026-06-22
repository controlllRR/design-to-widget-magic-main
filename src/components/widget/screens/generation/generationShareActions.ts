import { shareUrl } from "@/lib/shareUrl";

export async function downloadLookImage(url: string, filename = "virtufit-look.jpg") {
  const response = await fetch(url);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

export async function copyLookLink(url: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return true;
  }
  const result = await shareUrl({ title: "VirtuFit", url });
  return result === "copied";
}

export async function shareLookVia(title: string, url: string) {
  const result = await shareUrl({ title, url });
  return result === "shared" || result === "copied";
}

export function openLookFullscreen(root: HTMLElement | null) {
  const target = root ?? document.documentElement;
  if (target.requestFullscreen) {
    void target.requestFullscreen();
  }
}
