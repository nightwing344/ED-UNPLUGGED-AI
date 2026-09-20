#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

QUERY="${*:-}"
[ -n "$QUERY" ] || read -r -p "Memory query: " QUERY

RUNTIME="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MEMORY="${ED_MEMORY_ROOT:-/storage/emulated/0/ED/Memory}"
ED_ROOT="${ED_ROOT:-/storage/emulated/0/ED}"

ENGINE="$RUNTIME/ed-memory-retrieve.py"
OUTPUT="$MEMORY/Context/Active/retrieved-memory.txt"
LOG="$ED_ROOT/Logs/Memory/retrieval.log"

mkdir -p "$(dirname "$OUTPUT")" "$(dirname "$LOG")"

echo "[$(date)] Retrieval: $QUERY" >> "$LOG"

JSON="$(
  ED_MEMORY_ROOT="$MEMORY" \
  python "$ENGINE" "$QUERY" --limit 5
)"

RETRIEVAL_JSON="$JSON" QUERY="$QUERY" python - "$OUTPUT" <<'PY'
import json, os, sys

out=sys.argv[1]
data=json.loads(os.environ["RETRIEVAL_JSON"])
query=os.environ["QUERY"]

with open(out,"w",encoding="utf-8") as f:
    f.write("# ED Retrieved Memory Context\n\n")
    f.write(f"Query:\n{query}\n\nMatches:\n\n")

    for r in data.get("results",[]):
        f.write("---\n")
        f.write(f"Source: {r['path']}\n")
        f.write(f"Score: {r['score']}\n")
        f.write(f"Line: {r['line']}\n")
        f.write(f"Preview: {r['preview']}\n\n")

    if not data.get("results"):
        f.write("No relevant memory match found.\n")
PY

echo "================================"
echo " ED MEMORY RETRIEVAL"
echo "================================"
echo
echo "Query: $QUERY"
echo
echo "Results:"
echo "$JSON" | python -c '
import json,sys
d=json.load(sys.stdin)
for r in d.get("results",[]):
    print("- {}  score={}".format(r["path"], r["score"]))
'
echo
echo "Retrieved context:"
echo "$OUTPUT"
echo
echo "✓ Canonical retrieval engine used"
