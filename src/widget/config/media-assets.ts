/**
 * Локальное хранилище медиа виджета (IndexedDB).
 * Ссылки в overrides: `vf-idb://{kind}/{id}`.
 */
const DB_NAME = "vf-widget";
const DB_VERSION = 3;

const STORES = {
  splash: "splash-slides",
  background: "background-tiles",
  pose: "pose-tiles",
  uploadExample: "upload-examples",
} as const;

export type MediaStoreKind = keyof typeof STORES;

export const MEDIA_IDB_PREFIX = {
  splash: "vf-idb://splash/",
  background: "vf-idb://background/",
  pose: "vf-idb://pose/",
  uploadExample: "vf-idb://upload-example/",
} as const;

export type MediaIdbPrefix = (typeof MEDIA_IDB_PREFIX)[MediaStoreKind];

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const store of Object.values(STORES)) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store);
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"));
  });
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = fn(store);
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed"));
  });
}

export function mediaKindFromRef(ref: string): MediaStoreKind | null {
  for (const [kind, prefix] of Object.entries(MEDIA_IDB_PREFIX) as Array<
    [MediaStoreKind, MediaIdbPrefix]
  >) {
    if (ref.startsWith(prefix)) return kind;
  }
  return null;
}

export function isMediaIdbRef(ref: string): boolean {
  return mediaKindFromRef(ref) !== null;
}

export function mediaIdbId(ref: string): string {
  const kind = mediaKindFromRef(ref);
  if (!kind) return ref;
  return ref.slice(MEDIA_IDB_PREFIX[kind].length);
}

export function toMediaIdbRef(kind: MediaStoreKind, id: string): string {
  return `${MEDIA_IDB_PREFIX[kind]}${id}`;
}

export async function saveMediaFile(kind: MediaStoreKind, file: File): Promise<string> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  await withStore(STORES[kind], "readwrite", (store) => store.put(file, id));
  return toMediaIdbRef(kind, id);
}

export async function getMediaBlob(ref: string): Promise<Blob | null> {
  const kind = mediaKindFromRef(ref);
  if (!kind) return null;
  try {
    const blob = await withStore<Blob | undefined>(STORES[kind], "readonly", (store) =>
      store.get(mediaIdbId(ref)),
    );
    return blob ?? null;
  } catch {
    return null;
  }
}

export async function deleteMediaRef(ref: string): Promise<void> {
  const kind = mediaKindFromRef(ref);
  if (!kind) return;
  try {
    await withStore(STORES[kind], "readwrite", (store) => store.delete(mediaIdbId(ref)));
  } catch (err) {
    console.warn("[VirtuFit] failed to delete media ref", err);
  }
}

export async function resolveMediaRef(ref: string): Promise<string> {
  if (!isMediaIdbRef(ref)) return ref;
  const blob = await getMediaBlob(ref);
  if (!blob) return "";
  return URL.createObjectURL(blob);
}

export async function resolveMediaRefs(refs: string[]): Promise<string[]> {
  return Promise.all(refs.map(resolveMediaRef));
}

/** @deprecated Используйте MEDIA_IDB_PREFIX.splash */
export const SPLASH_IDB_PREFIX = MEDIA_IDB_PREFIX.splash;

export function isSplashIdbRef(ref: string): boolean {
  return ref.startsWith(SPLASH_IDB_PREFIX);
}

export function splashIdbId(ref: string): string {
  return ref.slice(SPLASH_IDB_PREFIX.length);
}

export function toSplashIdbRef(id: string): string {
  return toMediaIdbRef("splash", id);
}

export async function saveSplashSlide(file: File): Promise<string> {
  return saveMediaFile("splash", file);
}

export async function getSplashSlideBlob(ref: string): Promise<Blob | null> {
  return getMediaBlob(ref);
}

export async function deleteSplashSlide(ref: string): Promise<void> {
  return deleteMediaRef(ref);
}

export async function resolveSplashImage(ref: string): Promise<string> {
  return resolveMediaRef(ref);
}

export async function resolveSplashImages(refs: string[]): Promise<string[]> {
  return resolveMediaRefs(refs);
}

export async function saveBackgroundTile(file: File): Promise<string> {
  return saveMediaFile("background", file);
}

export async function savePoseTile(file: File): Promise<string> {
  return saveMediaFile("pose", file);
}

export async function saveUploadExample(file: File): Promise<string> {
  return saveMediaFile("uploadExample", file);
}
