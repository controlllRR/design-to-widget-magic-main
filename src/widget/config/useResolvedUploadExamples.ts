import { useEffect, useState } from "react";
import { isMediaIdbRef, resolveMediaRef } from "./media-assets";
import type { UploadExamplesForSlot } from "./uploadExamples";

/** Разрешает vf-idb:// ссылки в примерах загрузки фото. */
export function useResolvedUploadExamples(examples: UploadExamplesForSlot): UploadExamplesForSlot {
  const [resolved, setResolved] = useState<UploadExamplesForSlot>(examples);

  const goodKey = examples.good.join("\0");
  const badKey = examples.bad.join("\0");

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    async function resolveList(refs: string[]) {
      const out: string[] = [];
      for (const ref of refs) {
        const url = await resolveMediaRef(ref);
        if (!url) continue;
        out.push(url);
        if (isMediaIdbRef(ref)) objectUrls.push(url);
      }
      return out;
    }

    async function load() {
      const [good, bad] = await Promise.all([
        resolveList(examples.good),
        resolveList(examples.bad),
      ]);
      if (!cancelled) setResolved({ good, bad });
    }

    void load();

    return () => {
      cancelled = true;
      for (const url of objectUrls) URL.revokeObjectURL(url);
    };
  }, [goodKey, badKey, examples.bad, examples.good]);

  return resolved;
}
