import { useEffect, useMemo, useState } from "react";
import type { TileItem } from "@/components/widget/screens/wardrobe/data";
import { isVideoMediaRef } from "@/lib/mediaUrl";
import { getMediaBlob, isMediaIdbRef, resolveMediaRef } from "./media-assets";
import type { ConfigTile } from "./types";

type ResolvedTileMedia = {
  url: string;
  isVideo: boolean;
};

/** Превью одной плитки в админке. */
export function useTileImagePreview(ref?: string): string {
  const preview = useTileMediaPreview(ref);
  return preview.src;
}

/** Превью плитки с определением типа медиа (фото / видео). */
export function useTileMediaPreview(ref?: string): { src: string; isVideo: boolean } {
  const [state, setState] = useState<{ src: string; isVideo: boolean }>(() => ({
    src: ref && isMediaIdbRef(ref) ? "" : (ref ?? ""),
    isVideo: ref ? isVideoMediaRef(ref) : false,
  }));

  useEffect(() => {
    let objectUrl: string | undefined;
    let cancelled = false;

    async function load() {
      if (!ref) {
        setState({ src: "", isVideo: false });
        return;
      }
      if (!isMediaIdbRef(ref)) {
        setState({ src: ref, isVideo: isVideoMediaRef(ref) });
        return;
      }
      const blob = await getMediaBlob(ref);
      if (cancelled) return;
      if (!blob) {
        setState({ src: "", isVideo: false });
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      setState({ src: objectUrl, isVideo: isVideoMediaRef(ref, blob) });
    }

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ref]);

  return state;
}

/** ConfigTile[] → TileItem[] с разрешёнными imageUrl (в т.ч. vf-idb://). */
export function useResolvedConfigTiles(tiles: ConfigTile[]): TileItem[] {
  const [resolvedImages, setResolvedImages] = useState<Record<string, ResolvedTileMedia>>({});

  const imageKeys = useMemo(
    () =>
      tiles
        .map((tile) => tile.image)
        .filter((image): image is string => Boolean(image))
        .join("\0"),
    [tiles],
  );

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    async function load() {
      const next: Record<string, ResolvedTileMedia> = {};
      await Promise.all(
        tiles.map(async (tile) => {
          if (!tile.image) return;
          if (isMediaIdbRef(tile.image)) {
            const blob = await getMediaBlob(tile.image);
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            next[tile.id] = { url, isVideo: isVideoMediaRef(tile.image, blob) };
            objectUrls.push(url);
            return;
          }
          const url = await resolveMediaRef(tile.image);
          if (!url) return;
          next[tile.id] = { url, isVideo: isVideoMediaRef(tile.image) };
        }),
      );
      if (!cancelled) setResolvedImages(next);
    }

    void load();

    return () => {
      cancelled = true;
      for (const url of objectUrls) URL.revokeObjectURL(url);
    };
  }, [imageKeys, tiles]);

  return useMemo(
    () =>
      tiles.map((tile) => ({
        id: tile.id,
        label: tile.label,
        tint: tile.tint,
        imageUrl: tile.image ? resolvedImages[tile.id]?.url : undefined,
        isVideo: tile.image ? resolvedImages[tile.id]?.isVideo : undefined,
      })),
    [tiles, resolvedImages],
  );
}
