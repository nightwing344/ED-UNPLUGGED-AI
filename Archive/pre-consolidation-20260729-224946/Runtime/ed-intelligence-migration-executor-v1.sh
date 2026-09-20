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
LOG="$MIG/logs/intelligence-migration-$DATE.txt"

{
echo "================================"
echo " ED INTELLIGENCE MIGRATION EXECUTOR v1.0"
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
echo "INTELLIGENCE MODULE COPY"

MODULES=(
ed-decision-engine.sh
ed-decision-engine-v2.sh
ed-decision-intelligence-v2.sh
ed-planning-engine.sh
ed-curiosity.sh
ed-curiosity-engine.sh
ed-knowledge-engine.sh
ed-knowledge-graph.sh
ed-knowledge-graph-v2.sh
ed-learning-engine.sh
ed-learning-loop.sh
ed-learning-pipeline.sh
ed-learning-feedback-loop.sh
ed-learning-knowledge-bridge.sh
ed-module-decision-engine-v1.sh
)

for MODULE in "${MODULES[@]}"
do
    if [ -f "$RUNTIME/$MODULE" ]; then
        if [ ! -f "$OS/Intelligence/$MODULE" ]; then
            cp "$RUNTIME/$MODULE" "$OS/Intelligence/$MODULE"
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
echo "INTELLIGENCE MIGRATION COMPLETE"

} | tee "$LOG"

echo
echo "LOG:"
echo "$LOG"

;;

status)

echo "ED Intelligence Migration Executor v1.0"

if [ -d "$OS/Intelligence" ]; then
echo "Intelligence destination ready"
else
echo "Intelligence destination missing"
fi

;;

*)

echo "Commands:"
echo " migrate"
echo " status"

;;

esac
