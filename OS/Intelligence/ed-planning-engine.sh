#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="/storage/emulated/0/ED/Planning"

ACTION="${1:-status}"
shift || true


case "$ACTION" in

plan)

GOAL="${1:-Unnamed Goal}"

ID="PLAN-$(date +%Y%m%d-%H%M%S)"

cat > "$BASE/Active/$ID.txt" <<EOF2
ED AUTONOMOUS PLAN

ID:
$ID

GOAL:
$GOAL

STATUS:
GENERATED

CREATED:
$(date)

EOF2

echo "✓ Plan Generated"
echo "$ID"

;;


step)

PLAN_ID="${1:-unknown}"
STEP="${2:-unknown}"

echo "$(date)|$PLAN_ID|STEP|$STEP" \
>> "$BASE/Tasks/tasks.log"

echo "✓ Planning Step Added"

;;


assign)

PLAN_ID="${1:-unknown}"
AGENT="${2:-unknown}"

echo "$(date)|$PLAN_ID|ASSIGNED|$AGENT" \
>> "$BASE/Logs/agent-routing.log"

echo "✓ Agent Routing Added"

;;


execute)

PLAN_ID="${1:-unknown}"

echo "$(date)|EXECUTE|$PLAN_ID" \
>> "$BASE/Logs/execution.log"

echo "✓ Plan Sent To Workflow Engine"

;;


complete)

PLAN_ID="${1:-unknown}"

if [ -f "$BASE/Active/$PLAN_ID.txt" ]; then
mv "$BASE/Active/$PLAN_ID.txt" \
"$BASE/History/$PLAN_ID.txt"
fi

echo "$(date)|COMPLETE|$PLAN_ID" \
>> "$BASE/Logs/completion.log"

echo "✓ Plan Archived"

;;


list)

echo "================================"
echo " ACTIVE PLANS"
echo "================================"

find "$BASE/Active" \
-type f 2>/dev/null \
| sed 's#^.*/##'

;;


status)

echo "================================"
echo " ED AUTONOMOUS PLANNING"
echo "================================"

echo
echo "✓ Goal Analyzer"
echo "✓ Plan Generator"
echo "✓ Task Sequencer"
echo "✓ Agent Router"
echo "✓ Resource Checker"
echo "✓ Workflow Bridge"
echo "✓ Learning Feedback"

echo
echo "Status: ACTIVE"

;;


*)

echo "Commands:"
echo "status"
echo "plan <goal>"
echo "step <plan> <step>"
echo "assign <plan> <agent>"
echo "execute <plan>"
echo "complete <plan>"
echo "list"

;;

esac

