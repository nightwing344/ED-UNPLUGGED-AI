#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUNTIME="$HOME/ED-Core/Runtime"
QUEUE="$HOME/ED-Core/Tasks"

echo "================================"
echo " ED SWARM COORDINATOR v1.0"
echo "================================"
echo

echo "Scanning task queue..."
echo

AGENTS=$(grep -h "^AGENT=" "$QUEUE"/*.task 2>/dev/null | cut -d= -f2 | sort -u || true)

if [ -z "$AGENTS" ]; then
    echo "No pending agents."
    exit 0
fi

for AGENT in $AGENTS
do

PENDING=$(grep -l "AGENT=$AGENT" "$QUEUE"/*.task 2>/dev/null | wc -l)

if [ "$PENDING" -gt 0 ]; then

echo "Activating agent:"
echo "$AGENT"
echo

"$RUNTIME/ed-agent-worker.sh" "$AGENT" || true

fi

done

echo
echo "================================"
echo " SWARM STATUS"
echo "================================"

"$RUNTIME/ed-task-queue.sh" list

echo
echo "Swarm cycle complete."

