"""Remove baked-in Figma selection/trash/edit overlays from tile PNGs."""
from __future__ import annotations

import math
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "src" / "assets"


def fill_disk(
    src,
    dst,
    w: int,
    h: int,
    cx: float,
    cy: float,
    radius: float,
    *,
    prefer_light: bool = False,
) -> None:
    samples: list[tuple[int, int, int, int]] = []
    for y in range(max(0, int(cy - radius - 18)), min(h, int(cy + radius + 19))):
        for x in range(max(0, int(cx - radius - 18)), min(w, int(cx + radius + 19))):
            d = math.hypot(x - cx, y - cy)
            if 4 <= d - radius <= 18:
                p = src[x, y]
                lum = sum(p[:3])
                if prefer_light:
                    if lum > 320:
                        samples.append(p)
                elif lum < 420:
                    samples.append(p)
    fallback = (220, 220, 225, 255) if prefer_light else (32, 32, 32, 255)
    med = sorted(samples or [fallback], key=lambda p: sum(p[:3]))[
        len(samples or [1]) // 2
    ]
    for y in range(max(0, int(cy - radius - 1)), min(h, int(cy + radius + 2))):
        for x in range(max(0, int(cx - radius - 1)), min(w, int(cx + radius + 2))):
            d = math.hypot(x - cx, y - cy)
            if d > radius + 1.2:
                continue
            if d > 0.5:
                ux, uy = (x - cx) / d, (y - cy) / d
                sx = max(0, min(w - 1, int(round(cx + ux * (radius + 12)))))
                sy = max(0, min(h - 1, int(round(cy + uy * (radius + 12)))))
                sp = src[sx, sy]
                if prefer_light:
                    fill = sp if sum(sp[:3]) > 280 else med
                else:
                    fill = sp if sum(sp[:3]) < 400 else med
            else:
                fill = med
            t = 1.0 if d < radius - 2.5 else max(0.0, (radius + 1.2 - d) / 3.5)
            cur = dst[x, y]
            dst[x, y] = tuple(int(fill[i] * t + cur[i] * (1 - t)) for i in range(4))


def loc_var(dst, w: int, h: int, x: int, y: int, r: int = 2) -> tuple[float, float]:
    vals = [
        sum(dst[xx, yy][:3]) / 3
        for yy in range(max(0, y - r), min(h, y + r + 1))
        for xx in range(max(0, x - r), min(w, x + r + 1))
    ]
    m = sum(vals) / len(vals)
    var = sum((v - m) ** 2 for v in vals) / len(vals)
    return m, var


def relax_mask(dst, w: int, h: int, mask: list[list[bool]], y_max: int) -> None:
    for _ in range(50):
        changed = 0
        for y in range(0, y_max):
            for x in range(0, w):
                if not mask[y][x]:
                    continue
                neigh = []
                for dy, dx in (
                    (-1, 0),
                    (1, 0),
                    (0, -1),
                    (0, 1),
                    (-1, -1),
                    (1, 1),
                    (-1, 1),
                    (1, -1),
                ):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not mask[ny][nx]:
                        neigh.append(dst[nx, ny])
                if neigh:
                    dst[x, y] = tuple(
                        sum(n[i] for n in neigh) // len(neigh) for i in range(4)
                    )
                    mask[y][x] = False
                    changed += 1
        if not changed:
            break


def detect_tl_radio(im: Image.Image) -> bool:
    """Selected radio: dark ring + dark center in top-left."""
    tl = im.crop((4, 4, 32, 32)).convert("RGB")
    dark = sum(1 for p in tl.getdata() if p[0] < 100 and p[1] < 100 and p[2] < 100)
    return dark >= 30


def detect_tr_white_btn(im: Image.Image) -> bool:
    w, _ = im.size
    tr = im.crop((w - 40, 4, w - 4, 40)).convert("RGB")
    white = sum(1 for p in tr.getdata() if p[0] > 200 and p[1] > 200 and p[2] > 200)
    return white >= 80


def clean_tile(path: Path) -> str | None:
    bak = path.with_suffix(path.suffix + ".baked-ui.bak")
    if not bak.exists():
        shutil.copy2(path, bak)
    src_path = bak

    im = Image.open(src_path).convert("RGBA")
    w, h = im.size
    has_radio = detect_tl_radio(im)
    has_btn = detect_tr_white_btn(im)
    if not has_radio and not has_btn:
        return None

    src = im.copy().load()
    dst = im.load()
    actions: list[str] = []

    if has_radio:
        # Figma selected radio ~18px at (18,18) on 218-wide tiles
        cx = 18 * (w / 218)
        cy = 18 * (h / 323)
        r = 17 * (w / 218)
        fill_disk(src, dst, w, h, cx, cy, r, prefer_light=True)
        actions.append("radio")

    if has_btn:
        cx = w - 28 * (w / 218)
        cy = 28 * (h / 323)
        r = 20 * (w / 218)
        fill_disk(src, dst, w, h, cx, cy, r, prefer_light=True)
        actions.append("btn")

    mask = [[False] * w for _ in range(h)]
    y_max = max(55, int(h * 0.18))
    for y in range(0, y_max):
        if has_radio:
            for x in range(0, max(42, int(w * 0.2))):
                m, var = loc_var(dst, w, h, x, y)
                if 60 < m < 200 and var < 120 and math.hypot(x - 18 * w / 218, y - 18 * h / 323) < 22 * w / 218:
                    mask[y][x] = True
        if has_btn:
            for x in range(int(w * 0.7), w):
                m, var = loc_var(dst, w, h, x, y)
                if m > 220 and var < 120 and math.hypot(x - (w - 28 * w / 218), y - 28 * h / 323) < 28 * w / 218:
                    mask[y][x] = True

    relax_mask(dst, w, h, mask, y_max)
    im.save(path, optimize=True)
    return "+".join(actions)


def main() -> None:
    targets = [
        *sorted((ROOT / "animate").glob("tile-*.png")),
        *sorted((ROOT / "wardrobe").glob("tile-*.png")),
        *sorted((ROOT / "store").glob("tile-*.png")),
    ]
    # skip bak files matched by glob? tile-*.png shouldn't match .bak
    cleaned = 0
    for path in targets:
        if ".bak" in path.name:
            continue
        result = clean_tile(path)
        if result:
            print(f"cleaned {path.relative_to(ROOT)} ({result})")
            cleaned += 1
        else:
            print(f"skip    {path.relative_to(ROOT)}")
    print(f"done: {cleaned} files cleaned")


if __name__ == "__main__":
    main()
