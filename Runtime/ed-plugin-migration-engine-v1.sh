#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
PLUGINS="$BASE/Plugins"

ACTION="${1:-status}"

case "$ACTION" in

analyze)

REG="$PLUGINS/Registry/plugin-registry.txt"
QUEUE="$PLUGINS/Migration/migration-queue.txt"
DONE="$PLUGINS/Migration/migrated-modules.txt"

>"$REG"
>"$QUEUE"
touch "$DONE"


echo "================================" >> "$REG"
echo " ED PLUGIN REGISTRY v1.0" >> "$REG"
echo "================================" >> "$REG"
echo >> "$REG"


echo "================================" >> "$QUEUE"
echo " ED MIGRATION QUEUE v1.0" >> "$QUEUE"
echo "================================" >> "$QUEUE"
echo >> "$QUEUE"


for FILE in "$RUNTIME"/*.sh
do

[ -e "$FILE" ] || continue

NAME=$(basename "$FILE")


case "$NAME" in

ed-runtime*|ed-executive-brain*|ed-router*|ed-agent-runtime*|ed-memory*|ed-knowledge*|ed-learning*|ed-security*|ed-mission*)
echo "$NAME | KERNEL PROTECTED" >> "$REG"
;;

ed-economic*|ed-digital-twin*|ed-simulation*|ed-research*|ed-interface*|ed-connector*)
echo "$NAME | PLUGIN" >> "$REG"
echo "$NAME" >> "$QUEUE"
;;

*)
echo "$NAME | REVIEW" >> "$REG"
;;

esac

done


echo
echo "✓ Plugin analysis complete"
echo
echo "Registry:"
echo "$REG"
echo
echo "Migration queue:"
echo "$QUEUE"

;;


migrate)

MODULE="$2"

if [ -z "$MODULE" ]; then
echo "Usage: migrate <module>"
exit 1
fi

echo "$(date) MIGRATED: $MODULE" >> "$PLUGINS/Migration/migrated-modules.txt"

echo "✓ Migration recorded"

;;


status)

echo "================================"
echo " ED PLUGIN MIGRATION ENGINE"
echo "================================"

if [ -f "$PLUGINS/Registry/plugin-registry.txt" ]; then
echo "Registry: READY"
else
echo "Registry: NOT CREATED"
fi

;;


*)

echo "Commands:"
echo " analyze"
echo " migrate <module>"
echo " status"

;;

esac

