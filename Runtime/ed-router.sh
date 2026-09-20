#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUNTIME="$HOME/ED-Core/Runtime"

CMD="${1:-status}"
shift || true

run() {
    local file="$1"
    shift || true

    if [ -x "$file" ]; then
        exec "$file" "$@"
    else
        echo "Engine not found:"
        echo "$file"
        exit 1
    fi
}

case "$CMD" in
status)      run "$RUNTIME/ed-command-center.sh" ;;
memory)      run "$RUNTIME/ed-memory-intelligence.sh" "$@" ;;
plan)        run "$RUNTIME/ed-workflow-engine.sh" "$@" ;;
goal)        run "$RUNTIME/ed-goal-engine.sh" "$@" ;;
agent)       run "$RUNTIME/ed-agent-manager.sh" "$@" ;;
simulate)    run "$RUNTIME/ed-simulation-engine.sh" "$@" ;;
assistant)   run "$RUNTIME/ed-assistant-loop.sh" "$@" ;;
personal)    run "$RUNTIME/ed-personal-os.sh" "$@" ;;
voice)       run "$RUNTIME/ed-voice-engine.sh" "$@" ;;
security)    run "$RUNTIME/ed-security-manager.sh" "$@" ;;
connect)     run "$RUNTIME/ed-connector-manager.sh" "$@" ;;
node)        run "$RUNTIME/ed-node-network.sh" "$@" ;;
action)      run "$RUNTIME/ed-action-gateway.sh" "$@" ;;
*) echo "Unknown command: $CMD"; exit 1 ;;
esac
