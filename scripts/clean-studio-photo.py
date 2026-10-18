"""Remove baked-in selection/trash UI from studio-photo.png (Figma selected-tile export)."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image

path = Path(__file__).resolve().parents[1] / "src" / "assets" / "backgrounds" / "studio-photo.png"
bak = path.with_name("studio-photo.baked-ui.bak.png")
src_path = bak if bak.exists() else path

im = Image.open(src_path).convert("RGBA")
w, h = im.size
src = im.copy().load()
dst = im.load()


def fill_disk(cx: float, cy: float, radius: float) -> None:
    samples: list[tuple[int, int, int, int]] = []
    for y in range(max(0, int(cy - radius - 18)), min(h, int(cy + radius + 19))):
        for x in range(max(0, int(cx - radius - 18)), min(w, int(cx + radius + 19))):
            d = math.hypot(x - cx, y - cy)
            if 4 <= d - radius <= 18:
                p = src[x, y]
                if sum(p[:3]) < 420:
                    samples.append(p)
    med = sorted(samples or [(32, 32, 32, 255)], key=lambda p: sum(p[:3]))[
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
                fill = sp if sum(sp[:3]) < 400 else med
            else:
                fill = med
            t = 1.0 if d < radius - 2.5 else max(0.0, (radius + 1.2 - d) / 3.5)
            cur = dst[x, y]
            dst[x, y] = tuple(int(fill[i] * t + cur[i] * (1 - t)) for i in range(4))


fill_disk(18, 18, 17)
fill_disk(173, 31, 33)


def loc_var(x: int, y: int, r: int = 2) -> tuple[float, float]:
    vals = [
        sum(dst[xx, yy][:3]) / 3
        for yy in range(max(0, y - r), min(h, y + r + 1))
        for xx in range(max(0, x - r), min(w, x + r + 1))
    ]
    m = sum(vals) / len(vals)
    var = sum((v - m) ** 2 for v in vals) / len(vals)
    return m, var


mask = [[False] * w for _ in range(h)]
for y in range(0, 55):
    for x in range(135, 210):
        m, var = loc_var(x, y)
        if m > 235 and var < 100 and math.hypot(x - 173, y - 31) < 36:
            mask[y][x] = True
    for x in range(0, 42):
        m, var = loc_var(x, y)
        if 70 < m < 170 and var < 90 and math.hypot(x - 18, y - 18) < 20:
            mask[y][x] = True

for _ in range(50):
    changed = 0
    for y in range(0, 55):
        for x in range(0, w):
            if not mask[y][x]:
                continue
            neigh = []
            for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1), (-1, 1), (1, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and not mask[ny][nx]:
                    neigh.append(dst[nx, ny])
            if neigh:
                dst[x, y] = tuple(sum(n[i] for n in neigh) // len(neigh) for i in range(4))
                mask[y][x] = False
                changed += 1
    if not changed:
        break

im.save(path, optimize=True)
print(f"cleaned {path} ({w}x{h})")
