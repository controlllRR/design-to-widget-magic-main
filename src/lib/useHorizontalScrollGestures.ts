import { useEffect, type RefObject } from "react";

const DRAG_THRESHOLD_PX = 4;

/**
 * Горизонтальная прокрутка: колесо мыши + drag (хватаешь и листаешь).
 * Drag работает с любого места ряда, включая кнопки размеров;
 * короткий тап по кнопке — выбор, сдвиг > порога — прокрутка без клика.
 * `active` — переподключить слушатели, когда контейнер появляется в DOM (модалки).
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

    const endDrag = (e: PointerEvent) => {
      if (pointerId === null || pointerId !== e.pointerId) return;

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);

      if (dragging) {
        try {
          el.releasePointerCapture(pointerId);
        } catch {
          /* already released */
        }

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

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId === null || pointerId !== e.pointerId) return;

      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) < DRAG_THRESHOLD_PX) return;

      if (!dragging) {
        dragging = true;
        try {
          el.setPointerCapture(pointerId);
        } catch {
          /* already released */
        }
        el.classList.add("vf-h-scroll-dragging");
      }

      e.preventDefault();
      el.scrollLeft = startScrollLeft - dx;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (!canScroll()) return;

      pointerId = e.pointerId;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      dragging = false;

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown, { capture: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown, { capture: true });
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      el.classList.remove("vf-h-scroll-dragging");
    };
  }, [ref, active]);
}
