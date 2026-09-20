#!/data/data/com.termux/files/usr/bin/bash

BASE=/storage/emulated/0/ED/Automation

TASK="$1"

if [ -z "$TASK" ]; then
    echo "Usage:"
    echo "ed-task-runner.sh <task>"
    exit 1
fi

if [ -f "$BASE/Tasks/$TASK.sh" ]; then

    DATE=$(date +%Y-%m-%d-%H%M)

    echo "Running task: $TASK"

    bash "$BASE/Tasks/$TASK.sh" \
    >> "$BASE/Logs/$DATE-$TASK.log" 2>&1

    echo "Task complete"

else

    echo "Task not found:"
    echo "$BASE/Tasks/$TASK.sh"

fi
