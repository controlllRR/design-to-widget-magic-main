import { useEffect, useRef, useState } from "react";
import { isVideoMediaRef } from "@/lib/mediaUrl";

/**
 * За сколько секунд до EOF перезапускать ролик.
 * Нативный `loop` в Chrome/Safari даёт короткий пустой (белый) кадр на стыке —
 * ранний seek этого избегает.
 */
const LOOP_LEAD_SEC = 1 / 24;

/** Превью плитки — статичное фото или бесшовно зацикленное беззвучное видео. */
export function TileMedia({
  src,
  isVideo,
  className = "w-full h-full object-cover",
}: {
  src: string;
  isVideo?: boolean;
  className?: string;
}) {
  const video = isVideo ?? isVideoMediaRef(src);

  if (video) {
    return <SeamlessLoopVideo src={src} className={className} />;
  }

  return <img src={src} alt="" className={className} draggable={false} />;
}

function SeamlessLoopVideo({ src, className }: { src: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  /** Первый кадр под видео — закрывает blank при seek (иначе виден светлый фон плитки). */
  const [underlay, setUnderlay] = useState<string | null>(null);

  useEffect(() => {
    setUnderlay(null);
    const el = ref.current;
    if (!el) return;

    let restarting = false;
    let cancelled = false;
    let captured = false;

    const captureUnderlay = () => {
      if (cancelled || captured) return;
      try {
        const w = el.videoWidth;
        const h = el.videoHeight;
        if (!w || !h) return;
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(w, 320);
        canvas.height = Math.round((canvas.width / w) * h);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
        captured = true;
        setUnderlay(canvas.toDataURL("image/jpeg", 0.7));
      } catch {
        // CORS / decode — подложка не критична
      }
    };

    const restart = () => {
      if (restarting) return;
      restarting = true;
      const onSeeked = () => {
        restarting = false;
        el.removeEventListener("seeked", onSeeked);
        if (el.paused) void el.play().catch(() => undefined);
      };
      el.addEventListener("seeked", onSeeked);
      try {
        // Чуть > 0 — в части браузеров seek ровно в 0 даёт краткий blank.
        el.currentTime = 0.001;
      } catch {
        restarting = false;
      }
    };

    const onTimeUpdate = () => {
      const duration = el.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      if (el.currentTime >= duration - LOOP_LEAD_SEC) restart();
    };

    const onEnded = () => restart();
    const onLoadedData = () => captureUnderlay();

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("ended", onEnded);
    el.addEventListener("loadeddata", onLoadedData);
    if (el.readyState >= 2) captureUnderlay();
    void el.play().catch(() => undefined);

    return () => {
      cancelled = true;
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("loadeddata", onLoadedData);
    };
    // underlay намеренно не в deps — иначе перезахват и цикл
    // eslint-disable-next-line react-hooks/exhaustive-deps -- capture once per src
  }, [src]);

  return (
    <span className="relative block w-full h-full overflow-hidden">
      {underlay ? (
        <img
          src={underlay}
          alt=""
          aria-hidden
          className={className}
          style={{ position: "absolute", inset: 0 }}
          draggable={false}
        />
      ) : null}
      <video
        ref={ref}
        src={src}
        className={className}
        style={{ position: "relative", backgroundColor: "transparent" }}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        draggable={false}
      />
    </span>
  );
}
