import re
import sys

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

keywords = [
    "лемент",
    "ксессуар",
    "голова",
    "торс",
    "стопы",
    "лицо",
    "уши",
    "шея",
    "руки",
    "спина",
    "List-add",
    "add-outfit",
    "Add outfit",
    "Window",
    "добавить",
    "ДОБАВИТЬ",
    "List-Add",
    "List-outfit",
    "List-access",
]

for p in keywords:
    if p in text:
        print("found:", p)

print("--- List frames ---")
for m in re.finditer(r'"id":"(\d+:\d+)","name":"(List[^"]+)"', text):
    print(m.group(1), m.group(2))

print("--- Add sheet titles ---")
for m in re.finditer(r'"id":"(\d+:\d+)","name":"(добавить[^"]+)"', text):
    print(m.group(1), m.group(2))

print("--- 873 frames ---")
for m in re.finditer(r'"id":"(873:\d+)","name":"([^"]+)","type":"FRAME"', text):
    print(m.group(1), m.group(2))
