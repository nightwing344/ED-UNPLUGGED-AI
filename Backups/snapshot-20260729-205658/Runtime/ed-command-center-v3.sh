#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUNTIME="$HOME/ED-Core/Runtime"
CENTER="$HOME/ED-Core/CommandCenter"

mkdir -p "$CENTER"

REQUEST="$*"

if [ -z "$REQUEST" ]; then
    echo "ED Command Center waiting."
    exit 0
fi


echo "================================"
echo " ED COMMAND CENTER v3.0"
echo "================================"
echo
echo "Request:"
echo "$REQUEST"
echo


LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')


if echo "$LOWER" | grep -Eq "build|create|project|mission"; then

    ENGINE="mission"

elif echo "$LOWER" | grep -Eq "audit|security|risk|permission"; then

    ENGINE="security"

elif echo "$LOWER" | grep -Eq "simulate|economy|token|model"; then

    ENGINE="simulation"

elif echo "$LOWER" | grep -Eq "remember|memory|learn"; then

    ENGINE="memory"

elif echo "$LOWER" | grep -Eq "automate|schedule"; then

    ENGINE="automation"

else

    ENGINE="router"

fi


echo "Selected System: $ENGINE"


LOG="$CENTER/history.log"

echo "$(date)|$ENGINE|$REQUEST" >> "$LOG"


case "$ENGINE" in

mission)

"$RUNTIME/ed-mission-orchestrator.sh" create "$REQUEST"
;;

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

router)

"$RUNTIME/ed-adaptive-router.sh" "$REQUEST"
;;

esac


echo
echo "================================"
echo " OPERATION COMPLETE"
echo "================================"

