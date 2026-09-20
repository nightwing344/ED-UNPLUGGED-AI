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
LOG="$MIG/logs/kernel-migration-$DATE.txt"

{
echo "================================"
echo " ED KERNEL MIGRATION EXECUTOR v1.0"
echo "================================"
echo

if [ ! -f "$REG/master-registry.txt" ]; then
    echo "Registry authority missing"
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
echo "KERNEL MODULE COPY"

MODULES=(
ed-runtime.sh
ed-executive-brain.sh
ed-router.sh
ed-agent-runtime.sh
ed-memory.sh
ed-knowledge-engine.sh
ed-knowledge-graph.sh
ed-learning-engine.sh
ed-security-manager.sh
ed-security-vault.sh
ed-mission-engine.sh
ed-mission-manager.sh
ed-mission-orchestrator.sh
)

for MODULE in "${MODULES[@]}"
do
    if [ -f "$RUNTIME/$MODULE" ]; then
        if [ ! -f "$OS/Kernel/$MODULE" ]; then
            cp "$RUNTIME/$MODULE" "$OS/Kernel/$MODULE"
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
echo "KERNEL MIGRATION COMPLETE"

} | tee "$LOG"

echo
echo "LOG:"
echo "$LOG"

;;

status)

echo "ED Kernel Migration Executor v1.0"

if [ -d "$OS/Kernel" ]; then
echo "Kernel destination ready"
else
echo "Kernel destination missing"
fi

;;

*)

echo "Commands:"
echo " migrate"
echo " status"

;;

esac
