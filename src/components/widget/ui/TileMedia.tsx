import { useEffect, useId, useRef, useState } from "react";
import { isVideoMediaRef } from "@/lib/mediaUrl";
import {
  claimVideoSlot,
  releaseVideoSlot,
  updateVideoSlotPriority,
} from "@/lib/videoPlayPool";

/**
 * За сколько секунд до EOF перезапускать ролик.
 * Нативный `loop` даёт короткий blank на стыке — ранний seek этого избегает.
 */
const LOOP_LEAD_SEC = 1 / 24;

/**
 * Превью плитки: фото или видео.
 * Видео всегда остаётся видео; play только в viewport и не больше лимита пула
 * (чтобы сетка поз не валила вкладку).
 */
export function TileMedia({
  src,
  isVideo,
  poster,
  preferPlay = false,
  className = "w-full h-full object-cover",
}: {
  src: string;
  isVideo?: boolean;
  poster?: string;
  preferPlay?: boolean;
  className?: string;
}) {
  const video = isVideo ?? isVideoMediaRef(src);

  if (video) {
    return (
      <LazyLoopVideo
        src={src}
        poster={poster}
        preferPlay={preferPlay}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  );
}

function LazyLoopVideo({
  src,
  poster,
  preferPlay,
  className,
}: {
  src: string;
  poster?: string;
  preferPlay: boolean;
  className: string;
}) {
  const reactId = useId();
  const slotIdRef = useRef<symbol | null>(null);
  if (!slotIdRef.current) {
    slotIdRef.current = Symbol(`vf-video-${reactId}`);
  }
  const slotId = slotIdRef.current;

  const rootRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  /** Монтируем <video> после первого появления — до этого только poster. */
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      setInView(true);
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) setArmed(true);
      },
      { root: null, rootMargin: "100px", threshold: 0.1 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!armed || !el) return;

    let restarting = false;

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

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("ended", restart);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("ended", restart);
      el.pause();
    };
  }, [armed, src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!armed || !el) return;

    if (!inView && !preferPlay) {
      releaseVideoSlot(slotId);
      el.pause();
      return;
    }

    const priority = preferPlay ? 100 : 10;
    claimVideoSlot(slotId, priority, {
      play: () => {
        void el.play().catch(() => undefined);
      },
      pause: () => {
        el.pause();
      },
    });
    updateVideoSlotPriority(slotId, priority);

    return () => {
      releaseVideoSlot(slotId);
    };
  }, [armed, inView, preferPlay, slotId, src]);

  return (
    <span ref={rootRef} className="relative block w-full h-full overflow-hidden">
      {poster ? (
        <img
          src={poster}
          alt=""
          aria-hidden
          className={className}
          style={{ position: "absolute", inset: 0 }}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      {armed ? (
        <video
          key={src}
          ref={videoRef}
          src={src}
          poster={poster}
          className={className}
          style={{ position: "relative", backgroundColor: "transparent" }}
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          draggable={false}
        />
      ) : null}
    </span>
  );
}
