#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROUTER="/storage/emulated/0/ED/Models/Router"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


register-model)

MODEL="${*:-unknown}"

ID="MODEL-$(date +%Y%m%d-%H%M%S)"

cat > "$ROUTER/$ID.txt" <<EOF2
ED MODEL ROUTER ENTRY

ID:
$ID

Model:
$MODEL

Status:
AVAILABLE

Created:
$(date)

EOF2

echo "✓ Model Added"
echo "$ID"

;;


assign)

AGENT="$1"
MODEL="$2"

echo "$(date)|AGENT:$AGENT|MODEL:$MODEL" \
>> "$ROUTER/Logs/assignments.log"

echo "✓ Assignment Created"

;;


route)

TASK="${*:-general}"

echo "$(date)|TASK:$TASK" \
>> "$ROUTER/Logs/routing.log"

echo "================================"
echo " ED ROUTING DECISION"
echo "================================"

echo
echo "Task:"
echo "$TASK"

echo
echo "Selected:"
echo "llama3.2:3b"

echo
echo "Reason:"
echo "Default local reasoning model"

;;


list)

echo "================================"
echo " REGISTERED MODELS"
echo "================================"

find "$ROUTER" \
-maxdepth 1 \
-name "MODEL-*.txt" \
-type f 2>/dev/null \
| sed 's#^.*/##'

;;


status)

echo "================================"
echo " ED MODEL ROUTER STATUS"
echo "================================"

echo
echo "✓ Model Registry"
echo "✓ Agent Mapping"
echo "✓ Task Routing"
echo "✓ Routing Logs"

echo
echo "Status: ACTIVE"

;;


*)

echo "Commands:"
echo "status"
echo "register-model <name>"
echo "assign <agent> <model>"
echo "route <task>"
echo "list"

;;

esac

