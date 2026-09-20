#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUNTIME="$HOME/ED-Core/Runtime"
LOOP="$HOME/ED-Core/AutonomousLoop"

ACTION="${1:-status}"
shift || true


case "$ACTION" in

run)

REQUEST="$*"

ID="loop-$(date +%Y%m%d-%H%M%S)"
DIR="$LOOP/$ID"

mkdir -p "$DIR"


echo "================================"
echo " ED AUTONOMOUS LOOP v1.0"
echo "================================"
echo

echo "Operation ID:"
echo "$ID"

echo "$REQUEST" > "$DIR/request.txt"


echo
echo "[1] Creating mission..."

"$RUNTIME/ed-mission-orchestrator.sh" \
create "$REQUEST" \
> "$DIR/mission.log" 2>&1 || true


echo
echo "[2] Routing intelligence..."

"$RUNTIME/ed-adaptive-router.sh" \
"$REQUEST" \
> "$DIR/router.log" 2>&1 || true


echo
echo "[3] Swarm analysis..."

"$RUNTIME/ed-swarm-intelligence.sh" \
create "$REQUEST" \
> "$DIR/swarm.log" 2>&1 || true


echo
echo "[4] Learning capture..."

if [ -x "$RUNTIME/ed-learning-pipeline.sh" ]; then

"$RUNTIME/ed-learning-pipeline.sh" extract \
"Autonomous loop completed: $REQUEST" \
> "$DIR/learning.log" 2>&1 || true

fi


echo
echo "[5] Experience record..."

cat > "$DIR/experience.txt" <<EOF2
REQUEST:
$REQUEST

COMPLETED:
$(date)

STATUS:
COMPLETE
EOF2


echo
echo "✓ Autonomous cycle complete"

echo
echo "Report:"
echo "$DIR"

;;


list)

find "$LOOP" -maxdepth 1 -type d -name "loop-*"

;;


status)

COUNT=$(find "$LOOP" -maxdepth 1 -type d -name "loop-*" 2>/dev/null | wc -l)

echo "================================"
echo " ED AUTONOMOUS LOOP v1.0"
echo "================================"
echo
echo "Cycles: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " run <request>"
echo " list"
echo " status"

;;

esac

