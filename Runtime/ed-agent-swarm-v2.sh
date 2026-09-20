#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

SWARM="$HOME/ED-Core/Swarm"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


register)

NAME="$1"
ROLE="${2:-general}"

FILE="$SWARM/$NAME.agent"

cat > "$FILE" <<EOF2
AGENT=$NAME
ROLE=$ROLE
STATUS=ACTIVE
CREATED=$(date)
SCORE=0
EOF2

echo "✓ Agent registered"

;;


create)

TASK="$*"

ID="swarm-$(date +%Y%m%d-%H%M%S)"
DIR="$SWARM/$ID"

mkdir -p "$DIR"

cat > "$DIR/task.txt" <<EOF2
TASK=$TASK
CREATED=$(date)
STATUS=RUNNING
EOF2

echo "================================"
echo " ED SWARM CREATED"
echo "================================"
echo
echo "ID: $ID"

;;


assign)

ID="$1"
AGENT="$2"
TASK="$*"

DIR="$SWARM/$ID"

mkdir -p "$DIR/tasks"

cat > "$DIR/tasks/$AGENT.task" <<EOF2
AGENT=$AGENT
TASK=$TASK
ASSIGNED=$(date)
STATUS=PENDING
EOF2

echo "✓ Task assigned"

;;


result)

ID="$1"
AGENT="$2"
shift 2

echo "$*" > "$SWARM/$ID/results-$AGENT.txt"

echo "✓ Result stored"

;;


list)

echo "================================"
echo " ED SWARM AGENTS"
echo "================================"

for FILE in "$SWARM"/*.agent
do
    [ -e "$FILE" ] || continue
    echo
    cat "$FILE"
done

;;


status)

AGENTS=$(find "$SWARM" -name "*.agent" 2>/dev/null | wc -l)
TASKS=$(find "$SWARM" -name "*.task" 2>/dev/null | wc -l)

echo "================================"
echo " ED AGENT SWARM v2.0"
echo "================================"
echo
echo "Agents: $AGENTS"
echo "Tasks: $TASKS"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " register <name> <role>"
echo " create <task>"
echo " assign <id> <agent> <task>"
echo " result <id> <agent> <result>"
echo " list"
echo " status"

;;

esac

