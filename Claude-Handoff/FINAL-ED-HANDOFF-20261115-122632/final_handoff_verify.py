import hashlib
import json
import os
import re
import sys
import zipfile
from pathlib import Path

initial = Path(sys.argv[1])
delta = Path(sys.argv[2])
repo = Path(sys.argv[3])
final = Path(sys.argv[4])

errors = []
results = []

def check(label, condition, detail=""):
    results.append((label, bool(condition), detail))
    if not condition:
        errors.append(label)

def verify_sum_file(path, root):
    if not path.is_file():
        check(f"SUMFILE:{path.name}", False, "Missing")
        return 0

    count = 0
    for line in path.read_text(errors="replace").splitlines():
        match = re.match(r"^([0-9a-fA-F]{64})\s+[* ]?(.*)$", line)
        if not match:
            continue
        expected, name = match.groups()
        target = Path(name)
        if not target.is_absolute():
            target = root / target
        if not target.is_file():
            check(f"PART:{name}", False, "Missing")
            continue
        actual = hashlib.sha256(target.read_bytes()).hexdigest()
        check(f"PART:{name}", actual.lower() == expected.lower(),
              "SHA256 verified" if actual.lower() == expected.lower()
              else "SHA256 mismatch")
        count += 1
    check(f"SUMCOUNT:{path.name}", count > 0, f"Verified entries: {count}")
    return count

# Original handoff parts
initial_parts = verify_sum_file(initial / "PART-SHA256SUMS.txt", initial)

# Delta part hashes
delta_parts = verify_sum_file(delta / "PART-SHA256SUMS.txt", delta)

# Original ZIP hashes, if their manifest paths are resolvable
original_count = verify_sum_file(
    initial / "ORIGINAL-SHA256SUMS.txt", Path("/storage/emulated/0/ED/Exports")
)

# Delta ZIP integrity and known hash
delta_zip = delta / "ED-LOCAL-CHANGES.zip"
check("DELTA_ZIP_EXISTS", delta_zip.is_file())
if delta_zip.is_file():
    h = hashlib.sha256(delta_zip.read_bytes()).hexdigest()
    check("DELTA_ZIP_SHA256",
          h == "f6917d20cdec3190ac662eb80c6f9c5ac747da9a619238b930db217c1bda8cb1",
          h)
    try:
        with zipfile.ZipFile(delta_zip) as z:
            bad = z.testzip()
            check("DELTA_ZIP_CRC", bad is None, str(bad or "CRC passed"))
    except Exception as e:
        check("DELTA_ZIP_OPEN", False, str(e))

# Confirm original three templates remain identical.
env_paths = [
    repo / "Checkpoints/ED-COMPANION-DOCK-20261026-001349/build-check/Interface/Web/.env.example",
    repo / "Checkpoints/ED-COMPANION-NAV-20261026-002451/build/.env.example",
    repo / "Checkpoints/ED-COMPANION-NAV-V3-20261026-003252/build/.env.example",
]
env_hashes = []
for p in env_paths:
    check(f"ENV_PRESENT:{p.name}", p.is_file(), str(p))
    if p.is_file():
        env_hashes.append(hashlib.sha256(p.read_bytes()).hexdigest())

check("ENV_TEMPLATES_IDENTICAL",
      len(env_hashes) == 3 and len(set(env_hashes)) == 1,
      ",".join(env_hashes))

# Verify the local delta manifest is readable.
try:
    json.loads((delta / "DELTA-MANIFEST.json").read_text())
    check("DELTA_MANIFEST_JSON", True)
except Exception as e:
    check("DELTA_MANIFEST_JSON", False, str(e))

# Ensure all original split files are within the upload size limit.
part_files = []
for root in (initial, delta):
    for p in root.rglob("*"):
        if p.is_file() and (
            ".part-" in p.name or
            p.name.startswith("ED-CORE-") or
            p.name.startswith("ED-ARCHIVE-")
        ):
            part_files.append(p)
            check(f"SIZE:{p.name}", p.stat().st_size <= 25_000_000,
                  str(p.stat().st_size))

check("PART_FILES_DISCOVERED", len(part_files) >= 90,
      f"Found {len(part_files)} possible split parts")

# Produce verification report.
with (final / "VERIFICATION-RESULTS.txt").open("w") as f:
    for label, passed, detail in results:
        f.write(f"{'PASS' if passed else 'FAIL'} | {label} | {detail}\n")
    f.write(f"\nPASS_COUNT: {sum(x[1] for x in results)}\n")
    f.write(f"FAIL_COUNT: {sum(not x[1] for x in results)}\n")
    f.write(f"INITIAL_HASH_ENTRIES: {initial_parts}\n")
    f.write(f"DELTA_HASH_ENTRIES: {delta_parts}\n")
    f.write(f"ORIGINAL_HASH_ENTRIES: {original_count}\n")
    f.write(f"DISCOVERED_PART_FILES: {len(part_files)}\n")

sys.exit(1 if errors else 0)
