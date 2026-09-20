#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUNTIME="$HOME/ED-Core/Runtime"

REQUEST="$*"

if [ -z "$REQUEST" ]; then
    echo "ED Router waiting for task."
    exit 0
fi

echo "================================"
echo " ED AUTONOMOUS TASK ROUTER v1.2"
echo "================================"
echo
echo "Analyzing task..."
echo

LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')

AGENT=""

# Fast routing rules

if echo "$LOWER" | grep -Eq "security|audit|vulnerability|permission|trust|breach"; then
    AGENT="security"

elif echo "$LOWER" | grep -Eq "simulate|simulation|economy|token|reward|scenario|model"; then
    AGENT="simulation"

elif echo "$LOWER" | grep -Eq "remember|memory|store|recall"; then
    AGENT="memory"

elif echo "$LOWER" | grep -Eq "automate|automation|schedule"; then
    AGENT="automation"

fi


# AI fallback

if [ -z "$AGENT" ]; then

RESULT=$(ollama run llama3.2:3b "
You are ED Task Router.

Choose one agent only:

planning
simulation
security
automation
memory
knowledge
personal

Return JSON only:

{\"agent\":\"name\",\"reason\":\"why\"}

Task:
$REQUEST
" 2>/dev/null || true)

echo "$RESULT"

AGENT=$(echo "$RESULT" | sed -n 's/.*"agent"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

fi


echo
echo "Selected Agent: $AGENT"

case "$AGENT" in

simulation)
exec "$RUNTIME/ed-simulation-engine.sh" "$REQUEST"
;;

security)
exec "$RUNTIME/ed-security-manager.sh" "$REQUEST"
;;

planning)
exec "$RUNTIME/ed-workflow-engine.sh" "$REQUEST"
;;

memory)
exec "$RUNTIME/ed-memory-intelligence.sh" "$REQUEST"
;;

automation)
exec "$RUNTIME/ed-automation-engine.sh" "$REQUEST"
;;

personal)
exec "$RUNTIME/ed-personal-os.sh" "$REQUEST"
;;

*)
echo "No matching agent."
;;

esac

