#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

NOTE="${*:-}"

if [ -z "$NOTE" ]; then
  read -r -p "Memory candidate: " NOTE
fi

RUNTIME="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
MEMORY="${ED_MEMORY_ROOT:-/storage/emulated/0/ED/Memory}"

PROPOSER="$RUNTIME/ed-memory-propose.py"
REVIEWER="$RUNTIME/ed-memory-review.py"

echo "================================"
echo " ED MEMORY APPROVAL"
echo "================================"
echo
echo "Candidate:"
echo "$NOTE"
echo
echo "Save this information?"
echo
echo "Type:"
echo "yes - save"
echo "no  - discard"

read -r ANSWER

if [ "$ANSWER" = "yes" ]; then
  TITLE="$(
    printf '%s' "$NOTE" |
    tr '\n' ' ' |
    cut -c1-80
  )"

  RESULT="$(
    ED_MEMORY_ROOT="$MEMORY" \
    python "$PROPOSER" \
      --title "${TITLE:-Memory proposal}" \
      --content "$NOTE" \
      --category "context" \
      --tags "legacy-request,user-approved"
  )"

  ID="$(
    printf '%s' "$RESULT" |
    python -c 'import json,sys; print(json.load(sys.stdin)["id"])'
  )"

  echo
  ED_MEMORY_ROOT="$MEMORY" \
  python "$REVIEWER" approve "$ID"

  echo
  echo "✓ Memory approved through canonical approval engine"
else
  echo
  echo "Memory discarded."
fi
