from __future__ import annotations

import hashlib
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[2]
d = root / "Try-on widget"
fig = Path(__file__).resolve().parents[1] / "src" / "assets" / "measure-guides" / "figma"

known = {p.name: hashlib.md5(p.read_bytes()).hexdigest() for p in fig.glob("*.png")}
inv: dict[str, list[str]] = {}
for name, digest in known.items():
    inv.setdefault(digest, []).append(name)

for f in sorted(d.glob("Info*.png")):
    if f.stat().st_size < 1000:
        continue
    digest = hashlib.md5(f.read_bytes()).hexdigest()
    match = inv.get(digest)
    size = Image.open(f).size
    print(f"{f.name:12} {size} -> {match or 'UNIQUE'}")
