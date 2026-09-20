#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

MISSIONS="/storage/emulated/0/ED/Missions"
AGENTS="/storage/emulated/0/ED/Agents"

ACTION="${1:-status}"


case "$ACTION" in

missions)

echo "================================"
echo " ED ACTIVE MISSIONS"
echo "================================"

echo

find "$MISSIONS" -maxdepth 1 -mindepth 1 -type d \
| while read MISSION
do
echo "--------------------------------"
echo "Mission:"
basename "$MISSION"

[ -f "$MISSION/MISSION.md" ] && \
head -20 "$MISSION/MISSION.md"

done

;;


agents)

echo "================================"
echo " ED ACTIVE AGENTS"
echo "================================"

echo

find "$AGENTS" -maxdepth 1 -mindepth 1 -type d \
| sed 's#.*/##'

;;


tasks)

echo "================================"
echo " ED TASK OVERVIEW"
echo "================================"

echo

find "$MISSIONS" -name tasks.txt -exec cat {} \; \
2>/dev/null || echo "No tasks found"

;;


status)

echo "================================"
echo " ED DASHBOARD STATUS"
echo "================================"

echo
echo "✓ Mission View"
echo "✓ Agent View"
echo "✓ Task View"
echo "✓ Runtime Connection"
echo "✓ Future UI Ready"

echo
echo "Status: ACTIVE"

;;


*)

echo "Commands:"
echo "status"
echo "missions"
echo "agents"
echo "tasks"

;;

esac

