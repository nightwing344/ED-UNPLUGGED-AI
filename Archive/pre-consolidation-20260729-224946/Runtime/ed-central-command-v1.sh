#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
OS="$BASE/OS"
CMD="$OS/CommandCenter"

ACTION="${1:-status}"

LOG="$CMD/control-log.txt"

case "$ACTION" in

initialize)

echo "================================"
echo " ED CENTRAL COMMAND v1.0"
echo "================================"

cat > "$CMD/command-map.txt" <<EOF2
================================
 ED COMMAND MAP v1.0
================================

COMMANDS:

status
boot
layers
migration
kernel
plugins

CONTROL MODE:

SAFE OPERATION

EOF2


echo "$(date) Command Center initialized" >> "$LOG"

echo "✓ Command Center initialized"

;;


status)

echo "================================"
echo " ED SYSTEM DASHBOARD"
echo "================================"

echo

if [ -f "$OS/Boot/system-status.txt" ]; then
cat "$OS/Boot/system-status.txt"
else
echo "Boot status unavailable"
fi

echo

if [ -f "$OS/Migration/migrated.txt" ]; then
COUNT=$(wc -l < "$OS/Migration/migrated.txt")
echo "Migrated Modules: $COUNT"
else
echo "Migrated Modules: 0"
fi

echo

echo "Layers:"

for DIR in \
Kernel \
Agents \
Intelligence \
Memory \
Governance \
Plugins
do

if [ -d "$OS/$DIR" ]; then
echo "✓ $DIR"
else
echo "✗ $DIR"
fi

done

echo

echo "$(date) STATUS CHECK" >> "$LOG"

;;


layers)

echo "================================"
echo " ED LAYER INVENTORY"
echo "================================"

find "$OS" -maxdepth 1 -type d | sed "s#$OS/##"

;;


migration)

echo "================================"
echo " ED MIGRATION STATUS"
echo "================================"

if [ -f "$OS/Migration/migrated.txt" ]; then
cat "$OS/Migration/migrated.txt"
else
echo "No migration activity"
fi

;;


kernel)

echo "================================"
echo " ED KERNEL STATUS"
echo "================================"

ls "$OS/Kernel" 2>/dev/null || echo "Kernel empty"

;;


plugins)

echo "================================"
echo " ED PLUGIN STATUS"
echo "================================"

ls "$OS/Plugins" 2>/dev/null || echo "Plugins empty"

;;


*)

echo "Commands:"
echo " initialize"
echo " status"
echo " layers"
echo " migration"
echo " kernel"
echo " plugins"

;;

esac

