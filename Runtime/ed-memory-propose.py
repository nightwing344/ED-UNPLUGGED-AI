#!/usr/bin/env python3
import argparse
import json
import os
import secrets
from datetime import datetime, timezone

ap = argparse.ArgumentParser()
ap.add_argument("--title", required=True)
ap.add_argument("--content", required=True)
ap.add_argument("--category", default="context")
ap.add_argument("--tags", default="")
args = ap.parse_args()

root = os.environ.get(
    "ED_MEMORY_ROOT",
    "/storage/emulated/0/ED/Memory"
)

pending = os.path.join(root, "Inbox", "Pending")
os.makedirs(pending, exist_ok=True)

now = datetime.now(timezone.utc)
pid = (
    "MEM-"
    + now.strftime("%Y%m%d-%H%M%S")
    + "-"
    + secrets.token_hex(3)
)

data = {
    "id": pid,
    "status": "pending",
    "createdAt": now.isoformat(),
    "title": args.title.strip(),
    "category": args.category.strip(),
    "content": args.content.strip(),
    "tags": [
        x.strip()
        for x in args.tags.split(",")
        if x.strip()
    ],
    "requiresUserApproval": True
}

path = os.path.join(pending, pid + ".json")

with open(path, "x", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print(json.dumps({
    "ok": True,
    "id": pid,
    "status": "pending",
    "path": os.path.relpath(path, root)
}, indent=2))
