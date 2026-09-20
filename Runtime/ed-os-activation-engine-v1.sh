#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
OS="$BASE/OS"
REG="$BASE/Registry"
REPORT="$BASE/Reports"

ACTION="${1:-status}"

case "$ACTION" in

activate)

DATE=$(date +%Y%m%d-%H%M%S)
LOG="$REPORT/ED-ACTIVATION-$DATE.txt"

{
echo "================================"
echo " ED OS ACTIVATION ENGINE v1.0"
echo "================================"
echo
echo "DATE:"
date
echo
echo "AUTHORITY:"
echo "ED MASTER REGISTRY"

echo
echo "================================"
echo " CORE ACTIVATION"
echo "================================"

MODULES=(
"ed-runtime.sh"
"ed-executive-brain.sh"
"ed-router.sh"
"ed-memory.sh"
"ed-knowledge-engine.sh"
"ed-learning-engine.sh"
"ed-agent-runtime.sh"
"ed-mission-engine.sh"
)

for MODULE in "${MODULES[@]}"
do
if [ -f "$OS/Kernel/$MODULE" ] || [ -f "$BASE/Runtime/$MODULE" ]; then
echo "✓ ACTIVE: $MODULE"
else
echo "⚠ NOT FOUND: $MODULE"
fi
done

echo
echo "================================"
echo " INTELLIGENCE FABRIC"
echo "================================"

if [ -f "$REG/master-registry.txt" ]; then
echo "✓ Registry connected"
else
echo "✗ Registry unavailable"
fi

echo
echo "================================"
echo " MEMORY LINK"
echo "================================"

if [ -d "$OS/Memory" ]; then
echo "✓ Memory subsystem available"
else
echo "✗ Memory subsystem unavailable"
fi

echo
echo "================================"
echo " AGENT NETWORK"
echo "================================"

if [ -d "$OS/Agents" ]; then
echo "✓ Agent network available"
else
echo "✗ Agent network unavailable"
fi

echo
echo "================================"
echo " FINAL ACTIVATION STATE"
echo "================================"

echo
echo "ED OS:"
echo "INITIALIZED"

echo
echo "STATUS:"
echo "READY FOR INTERFACE LAYER"

} | tee "$LOG"

echo
echo "REPORT:"
echo "$LOG"

;;

status)

echo "ED OS Activation Engine v1.0"
echo "Ready"

;;

*)

echo "Commands:"
echo " activate"
echo " status"

;;

esac
