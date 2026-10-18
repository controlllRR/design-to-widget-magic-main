/**
 * Глобальный лимит одновременных <video> play в виджете.
 * Иначе сетка «Оживить образ» (12 роликов) валит вкладку.
 */
const MAX_PLAYING = 2;

type Slot = {
  id: symbol;
  priority: number;
  play: () => void;
  pause: () => void;
};

const slots = new Map<symbol, Slot>();
let playing = new Set<symbol>();

function rebalance() {
  const ranked = [...slots.values()].sort((a, b) => b.priority - a.priority);
  const keep = new Set(ranked.slice(0, MAX_PLAYING).map((s) => s.id));

  for (const slot of ranked) {
    if (keep.has(slot.id)) {
      if (!playing.has(slot.id)) {
        playing.add(slot.id);
        slot.play();
      }
    } else if (playing.has(slot.id)) {
      playing.delete(slot.id);
      slot.pause();
    }
  }
}

/** Зарегистрировать кандидата на воспроизведение. priority выше = важнее (выбранная плитка). */
export function claimVideoSlot(
  id: symbol,
  priority: number,
  handlers: { play: () => void; pause: () => void },
): void {
  slots.set(id, { id, priority, ...handlers });
  rebalance();
}

export function updateVideoSlotPriority(id: symbol, priority: number): void {
  const slot = slots.get(id);
  if (!slot) return;
  slot.priority = priority;
  rebalance();
}

export function releaseVideoSlot(id: symbol): void {
  const slot = slots.get(id);
  if (!slot) return;
  slots.delete(id);
  if (playing.has(id)) {
    playing.delete(id);
    slot.pause();
  }
  rebalance();
}
