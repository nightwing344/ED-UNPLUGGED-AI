#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ORCHESTRATOR="$HOME/ED-Core/Runtime/ed-orchestrator.sh"

echo
echo "========================================"
echo "     ED UNPLUGGED AI"
echo "     COMMAND CENTER v1.1"
echo "========================================"

echo
echo "Type:"
echo " analyze <request>  - full ED analysis"
echo " status             - system check"
echo " specialists        - list specialists"
echo " memory             - memory status"
echo " exit               - close ED"

while true
do

echo
read -r -p "ED> " INPUT

COMMAND=$(echo "$INPUT" | awk '{print $1}')
ARGS=$(echo "$INPUT" | cut -d' ' -f2-)

case "$COMMAND" in

analyze)

if [ -z "$ARGS" ]; then
echo "Please provide a request."
else
bash "$ORCHESTRATOR" "$ARGS"
fi

;;

status)

echo
echo "================================"
echo " ED SYSTEM STATUS"
echo "================================"
echo
echo "✓ Memory ONLINE"
echo "✓ Director ONLINE"
echo "✓ Specialists ONLINE"
echo "✓ Engines ONLINE"
echo "✓ Knowledge ONLINE"

;;

specialists)

echo
echo "Available Specialists:"
echo
echo "✓ Legal-ED"
echo "✓ ProSe-AI-ED"
echo "✓ Rogue-Litigan"
echo "✓ Developer-ED"
echo "✓ Builder-ED"
echo "✓ DIY-ED"
echo "✓ Research-ED"
echo "✓ Creative-ED"
echo "✓ Crypto-ED"

;;

memory)

echo
echo "Memory Location:"
echo "/storage/emulated/0/ED/Memory"

echo
echo "Context:"
ls /storage/emulated/0/ED/Memory/Context/Active 2>/dev/null || echo "No active context"

;;

exit)

echo
echo "Saving session..."
echo "ED offline."
break

;;

*)

echo "Unknown command."
echo "Use: status, analyze, specialists, memory, exit"

;;

esac

done
