#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
OS="$BASE/OS"
REG="$BASE/Registry"
MIG="$OS/Migration"

ACTION="${1:-status}"

case "$ACTION" in

migrate)

DATE=$(date +%Y%m%d-%H%M%S)
LOG="$MIG/logs/agent-migration-$DATE.txt"

{
echo "================================"
echo " ED AGENT MIGRATION EXECUTOR v1.0"
echo "================================"
echo

if [ ! -f "$REG/master-registry.txt" ]; then
echo "Registry missing"
exit 1
fi

echo "✓ Registry authority confirmed"

LOCK=$(ls -t "$MIG"/locks/*.txt 2>/dev/null | head -1 || true)

if [ -z "$LOCK" ]; then
echo "Migration lock missing"
exit 1
fi

echo "✓ Migration lock confirmed"

echo
echo "AGENT MODULE COPY"

MODULES=(
ed-agent-runtime.sh
ed-agent-manager.sh
ed-agent-bus.sh
ed-agent-worker.sh
ed-agent-swarm.sh
ed-agent-swarm-v2.sh
ed-agent-skill-manager.sh
ed-agent-skill-binding.sh
ed-agent-template-factory.sh
ed-specialist-consult.sh
ed-swarm-coordinator.sh
ed-swarm-intelligence.sh
ed-swarm-mission-execution.sh
)

for MODULE in "${MODULES[@]}"
do
    if [ -f "$RUNTIME/$MODULE" ]; then
        if [ ! -f "$OS/Agents/$MODULE" ]; then
            cp "$RUNTIME/$MODULE" "$OS/Agents/$MODULE"
            echo "✓ Migrated: $MODULE"
        else
            echo "SKIP EXISTS: $MODULE"
        fi
    else
        echo "MISSING: $MODULE"
    fi
done

echo
echo "RULE:"
echo "Runtime preserved."
echo "No deletion performed."

echo
echo "STATUS:"
echo "AGENT MIGRATION COMPLETE"

} | tee "$LOG"

echo
echo "LOG:"
echo "$LOG"

;;

status)

echo "ED Agent Migration Executor v1.0"

if [ -d "$OS/Agents" ]; then
echo "Agent destination ready"
else
echo "Agent destination missing"
fi

;;

*)

echo "Commands:"
echo " migrate"
echo " status"

;;

esac
