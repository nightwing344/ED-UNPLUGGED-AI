#!/usr/bin/env python3
import argparse
import json
import os
import re
from datetime import datetime, timezone

ap = argparse.ArgumentParser()
ap.add_argument("action", choices=["approve", "reject"])
ap.add_argument("id")
args = ap.parse_args()

if not re.fullmatch(r"MEM-[A-Za-z0-9-]+", args.id):
    raise SystemExit("Invalid memory proposal ID")

root = os.environ.get(
    "ED_MEMORY_ROOT",
    "/storage/emulated/0/ED/Memory"
)

pending = os.path.join(
    root, "Inbox", "Pending", args.id + ".json"
)

if not os.path.isfile(pending):
    raise SystemExit("Pending proposal not found")

with open(pending, encoding="utf-8") as f:
    data = json.load(f)

if data.get("id") != args.id:
    raise SystemExit("Proposal ID mismatch")

now = datetime.now(timezone.utc).isoformat()

if args.action == "approve":
    dest_dir = os.path.join(root, "Approved")
    data["status"] = "approved"
    data["approvedAt"] = now
    data["approvedByUser"] = True
else:
    dest_dir = os.path.join(root, "Inbox", "Rejected")
    data["status"] = "rejected"
    data["rejectedAt"] = now
    data["approvedByUser"] = False

os.makedirs(dest_dir, exist_ok=True)

dest = os.path.join(dest_dir, args.id + ".json")
temp = dest + ".tmp"

if os.path.exists(dest):
    raise SystemExit("Destination already exists")

with open(temp, "x", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

os.replace(temp, dest)
os.remove(pending)

print(json.dumps({
    "ok": True,
    "id": args.id,
    "status": data["status"],
    "path": os.path.relpath(dest, root)
}, indent=2))
