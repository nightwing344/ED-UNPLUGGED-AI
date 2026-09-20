#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

AGENT="${1:-assistant}"
QUEUE="$HOME/ED-Core/Tasks"

echo "================================"
echo " ED AGENT WORKER v1.0"
echo "================================"
echo
echo "Agent: $AGENT"
echo

for FILE in "$QUEUE"/*.task
do
    [ -e "$FILE" ] || continue

    TASK_AGENT=$(grep "^AGENT=" "$FILE" | cut -d= -f2)
    STATUS=$(grep "^STATUS=" "$FILE" | cut -d= -f2)
    ID=$(grep "^ID=" "$FILE" | cut -d= -f2)
    TASK=$(grep "^TASK=" "$FILE" | cut -d= -f2-)

    if [ "$TASK_AGENT" = "$AGENT" ] && [ "$STATUS" = "PENDING" ]; then

        echo "Claiming:"
        echo "$ID"
        echo "$TASK"
        echo

        "$HOME/ED-Core/Runtime/ed-task-queue.sh" claim "$ID"

        case "$AGENT" in

        simulation)
            RESULT=$("$HOME/ED-Core/Runtime/ed-simulation-engine.sh" "$TASK" 2>&1)
            ;;

        memory)
            RESULT=$("$HOME/ED-Core/Runtime/ed-memory-intelligence.sh" "$TASK" 2>&1)
            ;;

        security)
            RESULT=$("$HOME/ED-Core/Runtime/ed-security-manager.sh" "$TASK" 2>&1)
            ;;

        planning)
            RESULT=$("$HOME/ED-Core/Runtime/ed-workflow-engine.sh" "$TASK" 2>&1)
            ;;

        automation)
            RESULT=$("$HOME/ED-Core/Runtime/ed-automation-engine.sh" "$TASK" 2>&1)
            ;;

        *)
            RESULT="Agent completed planning step."
            ;;

        esac

        "$HOME/ED-Core/Runtime/ed-task-queue.sh" complete "$ID" "$RESULT"

        echo "Completed:"
        echo "$ID"
        echo

    fi

done

echo "Worker cycle complete."

