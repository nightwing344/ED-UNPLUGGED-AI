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
LOG="$MIG/logs/plugin-migration-$DATE.txt"

{
echo "================================"
echo " ED PLUGIN MIGRATION EXECUTOR v1.0"
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
echo "PLUGIN MODULE COPY"

MODULES=(
ed-economic-engine.sh
ed-economic-intelligence-v1.sh
ed-digital-twin.sh
ed-digital-twin-v2.sh
ed-simulation-engine.sh
ed-research-engine-v1.sh
ed-interface-gateway.sh
ed-interface-gateway-v1.sh
ed-interface-manager.sh
ed-connector-manager.sh
ed-tool-connectors.sh
ed-model-router.sh
ed-model-router-v2.sh
ed-model-connector.sh
ed-automation-engine.sh
ed-workflow-engine.sh
ed-workflow-orchestrator.sh
ed-application-factory.sh
ed-marketplace-engine-v1.sh
ed-product-intelligence.sh
)

for MODULE in "${MODULES[@]}"
do
    if [ -f "$RUNTIME/$MODULE" ]; then
        if [ ! -f "$OS/Plugins/$MODULE" ]; then
            cp "$RUNTIME/$MODULE" "$OS/Plugins/$MODULE"
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
echo "PLUGIN MIGRATION COMPLETE"

} | tee "$LOG"

echo
echo "LOG:"
echo "$LOG"

;;

status)

echo "ED Plugin Migration Executor v1.0"

if [ -d "$OS/Plugins" ]; then
echo "Plugin destination ready"
else
echo "Plugin destination missing"
fi

;;

*)

echo "Commands:"
echo " migrate"
echo " status"

;;

esac
