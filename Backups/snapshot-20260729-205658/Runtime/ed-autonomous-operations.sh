#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUNTIME="$HOME/ED-Core/Runtime"
OPS="$HOME/ED-Core/Operations"

ACTION="${1:-status}"
shift || true


case "$ACTION" in

execute)

REQUEST="$*"

ID="operation-$(date +%Y%m%d-%H%M%S)"

DIR="$OPS/$ID"

mkdir -p "$DIR"


echo "================================"
echo " ED AUTONOMOUS OPERATION"
echo "================================"
echo

echo "Request:"
echo "$REQUEST"

echo
echo "Creating mission..."


MISSION=$("$RUNTIME/ed-mission-orchestrator.sh" create "$REQUEST")

echo "$MISSION" > "$DIR/mission.txt"


echo
echo "Routing task..."

"$RUNTIME/ed-adaptive-router.sh" "$REQUEST" \
> "$DIR/router.result" 2>&1 || true


echo
echo "Running learning feedback..."

"$RUNTIME/ed-learning-feedback-loop.sh" learn \
"Operation completed: $REQUEST" \
> "$DIR/learning.result" 2>&1 || true


cat > "$DIR/report.txt" <<EOF2
ED AUTONOMOUS OPERATION REPORT

REQUEST:
$REQUEST

CREATED:
$(date)

STATUS:
COMPLETE

FILES:
router.result
learning.result

EOF2


echo
echo "✓ Operation complete"
echo "Report:"
echo "$DIR/report.txt"

;;


list)

echo "================================"
echo " ED OPERATIONS"
echo "================================"

find "$OPS" -maxdepth 1 -type d -name "operation-*"

;;


status)

COUNT=$(find "$OPS" -maxdepth 1 -type d -name "operation-*" 2>/dev/null | wc -l)

echo "================================"
echo " ED AUTONOMOUS OPERATIONS v1.0"
echo "================================"
echo
echo "Operations: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " execute <request>"
echo " list"
echo " status"

;;

esac

