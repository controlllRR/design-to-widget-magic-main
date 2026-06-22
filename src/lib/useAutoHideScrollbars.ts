import { useEffect } from "react";

const SCROLLABLE_SELECTOR =
  ".overflow-y-auto, .overflow-x-auto, .overflow-auto, .vf-scroll";
const SCROLL_END_MS = 700;

function isScrollableTarget(target: EventTarget | null): target is Element {
  if (!(target instanceof Element)) return false;
  if (target.closest(".vf-no-scrollbar")) return false;
  return target.matches(SCROLLABLE_SELECTOR);
}

/** Показывает ползунок только во время прокрутки (как overlay-scroll на mobile). */
export function useAutoHideScrollbars() {
  useEffect(() => {
    const timers = new WeakMap<EventTarget, ReturnType<typeof setTimeout>>();

    const onScroll = (event: Event) => {
      const target = event.target;
      if (!isScrollableTarget(target)) return;

      target.classList.add("vf-is-scrolling");
      const prev = timers.get(target);
      if (prev !== undefined) window.clearTimeout(prev);
      timers.set(
        target,
        window.setTimeout(() => {
          target.classList.remove("vf-is-scrolling");
          timers.delete(target);
        }, SCROLL_END_MS),
      );
    };

    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () =>
      document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);
}
