#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

QUEUE="$HOME/ED-Core/Tasks"

ACTION="${1:-status}"
shift || true

case "$ACTION" in

create)

TASK="$1"
AGENT="${2:-assistant}"

ID="TASK-$(date +%Y%m%d-%H%M%S)"

FILE="$QUEUE/$ID.task"

cat > "$FILE" <<EOF2
ID=$ID
TASK=$TASK
AGENT=$AGENT
STATUS=PENDING
CREATED=$(date)
EOF2

echo "Task Created"
echo "$ID"
;;

list)

echo "================================"
echo " ED TASK QUEUE"
echo "================================"

for f in "$QUEUE"/*.task; do
    [ -e "$f" ] || continue
    echo
    cat "$f"
done

;;

claim)

ID="$1"

FILE="$QUEUE/$ID.task"

if [ -f "$FILE" ]; then
    sed -i 's/STATUS=PENDING/STATUS=ACTIVE/' "$FILE"
    echo "Task claimed:"
    echo "$ID"
else
    echo "Task not found"
fi

;;

complete)

ID="$1"
RESULT="${2:-Completed}"

FILE="$QUEUE/$ID.task"

if [ -f "$FILE" ]; then
    sed -i 's/STATUS=.*/STATUS=COMPLETE/' "$FILE"
    echo "RESULT=$RESULT" >> "$FILE"
    echo "Task completed"
else
    echo "Task not found"
fi

;;

status)

COUNT=$(ls "$QUEUE"/*.task 2>/dev/null | wc -l)

echo "================================"
echo " ED TASK QUEUE v1.0"
echo "================================"
echo
echo "Tasks: $COUNT"
echo "Storage: ONLINE"

;;

*)

echo "Commands:"
echo " create <task> <agent>"
echo " list"
echo " claim <id>"
echo " complete <id> <result>"
echo " status"

;;

esac
