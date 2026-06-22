import { useEffect, type RefObject } from "react";

const DRAG_THRESHOLD_PX = 6;

function isInteractiveScrollTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'button, a, input, textarea, select, label, [role="radio"], [role="option"], [data-no-drag-scroll]',
    ),
  );
}

/**
 * Горизонтальная прокрутка: колесо мыши + drag (хватаешь и листаешь).
 * `active` — переподключить слушатели, когда контейнер появляется в DOM (модалки).
 *
 * Клики по кнопкам внутри ряда не перехватываются: capture и drag только с «пустого»
 * фона или после смещения указателя за порог (не считаем лёгкий jitter кликом-drag).
 */
export function useHorizontalScrollGestures(
  ref: RefObject<HTMLElement | null>,
  active = true,
) {
  useEffect(() => {
    if (!active) return;

    const el = ref.current;
    if (!el) return;

    const canScroll = () => el.scrollWidth > el.clientWidth + 1;

    let pointerId: number | null = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragging = false;

    const onWheel = (e: WheelEvent) => {
      if (!canScroll()) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (!canScroll()) return;
      if (isInteractiveScrollTarget(e.target)) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      dragging = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      if (!dragging) {
        dragging = true;
        try {
          el.setPointerCapture(pointerId);
        } catch {
          /* pointer already released */
        }
        el.classList.add("vf-h-scroll-dragging");
      }
      e.preventDefault();
      el.scrollLeft = startScrollLeft - dx;
    };

    const endDrag = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      if (pointerId !== null) {
        try {
          el.releasePointerCapture(pointerId);
        } catch {
          /* already released */
        }
      }
      if (dragging) {
        const suppressClick = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopImmediatePropagation();
        };
        el.addEventListener("click", suppressClick, { capture: true, once: true });
      }
      pointerId = null;
      dragging = false;
      el.classList.remove("vf-h-scroll-dragging");
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown, { capture: true });
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown, { capture: true });
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.classList.remove("vf-h-scroll-dragging");
    };
  }, [ref, active]);
}
