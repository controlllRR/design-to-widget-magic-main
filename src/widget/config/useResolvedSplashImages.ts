import { useEffect, useState } from "react";
import {
  getSplashSlideBlob,
  isSplashIdbRef,
} from "./splash-assets";

/**
 * Преобразует splash.images (в т.ч. vf-idb://…) в URL для <img> / background-image.
 */
export function useResolvedSplashImages(refs: string[]): string[] {
  const refsKey = refs.join("\0");
  const [resolved, setResolved] = useState<string[]>(() =>
    refs.filter((ref) => !isSplashIdbRef(ref)),
  );

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    async function load() {
      const urls = await Promise.all(
        refs.map(async (ref) => {
          if (!isSplashIdbRef(ref)) return ref;
          const blob = await getSplashSlideBlob(ref);
          if (!blob) return "";
          const url = URL.createObjectURL(blob);
          objectUrls.push(url);
          return url;
        }),
      );
      if (!cancelled) {
        setResolved(urls.filter((url) => url.length > 0));
      }
    }

    void load();

    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [refsKey, refs]);

  return resolved;
}

/** Миниатюра одного слайда в админке. */
export function useSplashSlidePreview(ref: string): string {
  const [src, setSrc] = useState(() => (isSplashIdbRef(ref) ? "" : ref));

  useEffect(() => {
    let objectUrl: string | undefined;
    let cancelled = false;

    async function load() {
      if (!isSplashIdbRef(ref)) {
        setSrc(ref);
        return;
      }
      const blob = await getSplashSlideBlob(ref);
      if (cancelled) return;
      if (!blob) {
        setSrc("");
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      setSrc(objectUrl);
    }

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ref]);

  return src;
}
