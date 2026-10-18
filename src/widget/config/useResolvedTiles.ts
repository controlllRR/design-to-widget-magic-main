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

function catalogKey(tiles: ConfigTile[]): string {
  return tiles
    .map(
      (tile) =>
        `${tile.id}\0${tile.image ?? ""}\0${tile.poster ?? ""}\0${tile.label}\0${tile.tint ?? ""}`,
    )
    .join("\n");
}

/** ConfigTile[] → TileItem[] с разрешёнными imageUrl (в т.ч. vf-idb://). */
export function useResolvedConfigTiles(tiles: ConfigTile[]): TileItem[] {
  const [resolvedImages, setResolvedImages] = useState<Record<string, ResolvedTileMedia>>({});
  const key = catalogKey(tiles);

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];
    // Снимок на момент смены key — не зависит от новой ссылки на массив каждый рендер.
    const snapshot = tiles;

    async function load() {
      const next: Record<string, ResolvedTileMedia> = {};
      await Promise.all(
        snapshot.map(async (tile) => {
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
    // tiles читаем только при смене key (содержимое каталога).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key сериализует tiles
  }, [key]);

  return useMemo(
    () =>
      tiles.map((tile) => ({
        id: tile.id,
        label: tile.label,
        tint: tile.tint,
        imageUrl: tile.image ? resolvedImages[tile.id]?.url ?? tile.image : undefined,
        posterUrl: tile.poster,
        isVideo: tile.image
          ? (resolvedImages[tile.id]?.isVideo ?? isVideoMediaRef(tile.image))
          : undefined,
      })),
    [tiles, resolvedImages, key],
  );
}
