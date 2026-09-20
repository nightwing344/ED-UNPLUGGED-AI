#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

MISSIONS="/storage/emulated/0/ED/Missions"

ACTION="${1:-status}"
shift || true


case "$ACTION" in

create)

NAME="${*:-Unnamed Mission}"

ID="ED-MSN-$(date +%Y%m%d-%H%M%S)"
DIR="$MISSIONS/$ID"

mkdir -p "$DIR/Tasks"
mkdir -p "$DIR/Agents"
mkdir -p "$DIR/Logs"


cat > "$DIR/MISSION.md" <<EOF2
# ED Mission

Mission ID:
$ID

Name:
$NAME

Created:
$(date)

Status:
ACTIVE

Authority:
User Controlled

EOF2


echo "$ID" > "$DIR/id.txt"

echo
echo "✓ Mission Created"
echo "$ID"

;;


assign)

MISSION="$1"
AGENT="$2"

mkdir -p "$MISSIONS/$MISSION/Agents"

echo "$AGENT" >> "$MISSIONS/$MISSION/Agents/assigned.txt"

echo "✓ Agent Assigned"
echo "$AGENT"

;;


task)

MISSION="$1"
TASK="${*:2}"

FILE="$MISSIONS/$MISSION/Tasks/tasks.txt"

echo "[ ] $TASK" >> "$FILE"

echo "✓ Task Added"

;;


status)

echo "================================"
echo " ED MISSION MANAGER STATUS"
echo "================================"

echo
echo "✓ Mission Registry"
echo "✓ Task Tracking"
echo "✓ Agent Assignment"
echo "✓ Progress Logging"
echo "✓ Decision History"

echo
echo "Status: ACTIVE"

;;


list)

echo "================================"
echo " ED MISSIONS"
echo "================================"

find "$MISSIONS" -maxdepth 1 -mindepth 1 -type d \
| sed 's#.*/##'

;;


*)

echo "Commands:"
echo "create <name>"
echo "assign <mission> <agent>"
echo "task <mission> <task>"
echo "list"
echo "status"

;;

esac

