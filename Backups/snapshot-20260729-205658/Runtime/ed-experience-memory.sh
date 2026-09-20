#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="/storage/emulated/0/ED/Memory/Experience"

ACTION="${1:-status}"
shift || true

case "$ACTION" in

log)

REQUEST="$1"
ENGINE="$2"
RESULT="${3:-unknown}"

FILE="$BASE/experience-$(date +%Y%m%d-%H%M%S).log"

cat > "$FILE" <<EOF2
ED EXPERIENCE RECORD

TIME:
$(date)

REQUEST:
$REQUEST

ENGINE:
$ENGINE

RESULT:
$RESULT

EOF2

echo "✓ Experience Stored"
;;

search)

TERM="${1:-}"

grep -ril "$TERM" "$BASE" 2>/dev/null || echo "No matches"

;;

status)

echo "================================"
echo " ED EXPERIENCE MEMORY v1.0"
echo "================================"

COUNT=$(ls "$BASE" 2>/dev/null | wc -l)

echo
echo "Experience Records: $COUNT"
echo "Storage: ONLINE"

;;

*)

echo "Commands:"
echo "status"
echo "log <request> <engine> <result>"
echo "search <term>"

;;

esac
