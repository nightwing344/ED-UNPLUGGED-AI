#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUNTIME="$HOME/ED-Core/Runtime"

TEXT="$*"
LOWER=$(printf "%s" "$TEXT" | tr '[:upper:]' '[:lower:]')

route() {
    exec "$1" "${@:2}"
}

if [[ -z "$TEXT" ]]; then
    exec "$RUNTIME/ed-command-center.sh"
fi

case "$LOWER" in

*backup*|*snapshot*)
    route "$RUNTIME/ed-backup-engine.sh" "$TEXT"
    ;;

*memory*|*remember*|*recall*)
    route "$RUNTIME/ed-memory-intelligence.sh" "$TEXT"
    ;;

*goal*)
    route "$RUNTIME/ed-goal-engine.sh" "$TEXT"
    ;;

*plan*|*workflow*)
    route "$RUNTIME/ed-workflow-engine.sh" "$TEXT"
    ;;

*project*|*mission*)
    route "$RUNTIME/ed-mission-engine.sh" "$TEXT"
    ;;

*simulate*|*test*|*scenario*)
    route "$RUNTIME/ed-simulation-engine.sh" "$TEXT"
    ;;

*security*|*permission*)
    route "$RUNTIME/ed-security-manager.sh" "$TEXT"
    ;;

*voice*|*listen*)
    route "$RUNTIME/ed-voice-engine.sh" "$TEXT"
    ;;

*agent*)
    route "$RUNTIME/ed-agent-manager.sh" "$TEXT"
    ;;

*)
    echo
    echo "================================"
    echo " ED INTENT ROUTER"
    echo "================================"
    echo
    echo "Request:"
    echo "$TEXT"
    echo
    echo "No specific engine matched."
    echo "Forwarding to Assistant..."
    echo
    exec "$RUNTIME/ed-assistant-loop.sh" review
    ;;
esac
