#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

MEMORY="$HOME/ED-Core/Memory/Missions"

ACTION="${1:-status}"
shift || true

case "$ACTION" in

store)

MISSION="$1"
AGENT="$2"
RESULT="$3"

FILE="$MEMORY/mission-$(date +%Y%m%d-%H%M%S).log"

cat > "$FILE" <<EOF2
ED MISSION MEMORY RECORD

DATE:
$(date)

MISSION:
$MISSION

AGENT:
$AGENT

RESULT:
$RESULT

EOF2

echo "✓ Mission experience stored"
;;

search)

TERM="${1:-}"

grep -ril "$TERM" "$MEMORY" 2>/dev/null || echo "No results"

;;

status)

COUNT=$(ls "$MEMORY" 2>/dev/null | wc -l)

echo "================================"
echo " ED MISSION MEMORY v1.0"
echo "================================"
echo
echo "Records: $COUNT"
echo "Storage: ONLINE"

;;

*)

echo "Commands:"
echo "store <mission> <agent> <result>"
echo "search <term>"
echo "status"

;;

esac
