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
LOG="$MIG/logs/memory-migration-$DATE.txt"

{
echo "================================"
echo " ED MEMORY MIGRATION EXECUTOR v1.0"
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
echo "MEMORY MODULE COPY"

MODULES=(
ed-memory.sh
ed-experience-memory.sh
ed-memory-intelligence.sh
ed-memory-intelligence-v2.sh
ed-memory-intelligence-v3.sh
ed-memory-request.sh
ed-memory-retrieve.sh
ed-memory-retrieval-status.sh
ed-memory-status.sh
ed-memory-consolidation-engine-v1.sh
ed-memory-consolidation-engine.sh
ed-mission-memory.sh
ed-os-memory-fabric-v1.sh
)

for MODULE in "${MODULES[@]}"
do
    if [ -f "$RUNTIME/$MODULE" ]; then
        if [ ! -f "$OS/Memory/$MODULE" ]; then
            cp "$RUNTIME/$MODULE" "$OS/Memory/$MODULE"
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
echo "MEMORY MIGRATION COMPLETE"

} | tee "$LOG"

echo
echo "LOG:"
echo "$LOG"

;;

status)

echo "ED Memory Migration Executor v1.0"

if [ -d "$OS/Memory" ]; then
echo "Memory destination ready"
else
echo "Memory destination missing"
fi

;;

*)

echo "Commands:"
echo " migrate"
echo " status"

;;

esac
