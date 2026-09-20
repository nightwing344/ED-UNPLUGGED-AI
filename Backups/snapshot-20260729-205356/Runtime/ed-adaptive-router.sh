#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUNTIME="$HOME/ED-Core/Runtime"
PERF="$HOME/ED-Core/AgentPerformance"
LOG="$HOME/ED-Core/Reports"

mkdir -p "$LOG"

REQUEST="$*"

if [ -z "$REQUEST" ]; then
    echo "ED Adaptive Router waiting for task."
    exit 0
fi

echo "================================"
echo " ED ADAPTIVE ROUTER v2.0"
echo "================================"
echo
echo "Analyzing:"
echo "$REQUEST"
echo


LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')

AGENT=""

if echo "$LOWER" | grep -Eq "security|audit|risk|permission|trust"; then
    AGENT="security"

elif echo "$LOWER" | grep -Eq "simulate|simulation|token|economy|model|scenario"; then
    AGENT="simulation"

elif echo "$LOWER" | grep -Eq "memory|remember|store|recall"; then
    AGENT="memory"

elif echo "$LOWER" | grep -Eq "automate|automation|schedule"; then
    AGENT="automation"

fi


if [ -z "$AGENT" ]; then

echo "Using AI decision layer..."

RESULT=$(ollama run llama3.2:3b "
Choose best ED agent.

Agents:
planning
simulation
security
automation
memory
knowledge
personal

Return only:
agent=name

Task:
$REQUEST
" 2>/dev/null || true)


AGENT=$(echo "$RESULT" | sed -n 's/.*agent=\([^ ]*\).*/\1/p')

fi


if [ -z "$AGENT" ]; then
    AGENT="planning"
fi


echo
echo "Selected Agent: $AGENT"


echo "$(date)|$REQUEST|$AGENT" >> "$LOG/router-history.log"


case "$AGENT" in

security)
"$RUNTIME/ed-security-manager.sh" "$REQUEST"
;;

simulation)
"$RUNTIME/ed-simulation-engine.sh" "$REQUEST"
;;

memory)
"$RUNTIME/ed-memory-intelligence.sh" "$REQUEST"
;;

automation)
"$RUNTIME/ed-automation-engine.sh" "$REQUEST"
;;

planning)
"$RUNTIME/ed-workflow-engine.sh" "$REQUEST"
;;

*)
echo "No execution module found for $AGENT"
;;

esac

