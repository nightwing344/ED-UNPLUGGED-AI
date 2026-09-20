#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
OS="$BASE/OS"
BOOT="$OS/Boot"

ACTION="${1:-status}"

case "$ACTION" in

boot)

echo "================================"
echo " ED BOOT SEQUENCE MANAGER v1.0"
echo "================================"

LOG="$BOOT/boot-log.txt"

echo "$(date) ED boot initiated" > "$LOG"


cat > "$BOOT/boot-config.txt" <<EOF2
================================
 ED BOOT CONFIGURATION v1.0
================================

BOOT ORDER:

1. Kernel
2. Runtime Bridge
3. Executive Brain
4. Router
5. Agents
6. Intelligence
7. Memory
8. Governance
9. Plugins

MODE:
SAFE MIGRATION MODE

EOF2


check_layer() {

NAME="$1"
PATH_CHECK="$2"

if [ -d "$PATH_CHECK" ]; then
echo "✓ $NAME online"
echo "$(date) $NAME ONLINE" >> "$LOG"
else
echo "✗ $NAME missing"
echo "$(date) $NAME FAILED" >> "$LOG"
fi

}


check_layer "Kernel" "$OS/Kernel"
check_layer "Agents" "$OS/Agents"
check_layer "Intelligence" "$OS/Intelligence"
check_layer "Memory" "$OS/Memory"
check_layer "Governance" "$OS/Governance"
check_layer "Plugins" "$OS/Plugins"


cat > "$BOOT/system-status.txt" <<EOF2
================================
 ED SYSTEM STATUS
================================

STATE:
ONLINE

MODE:
SAFE MIGRATION

KERNEL:
READY

RUNTIME:
CONNECTED

ARCHITECTURE:
ACTIVE

EOF2


echo
echo "✓ ED BOOT COMPLETE"
echo "System Status:"
cat "$BOOT/system-status.txt"

;;

status)

echo "================================"
echo " ED BOOT SEQUENCE MANAGER v1.0"
echo "================================"

if [ -f "$BOOT/system-status.txt" ]; then
cat "$BOOT/system-status.txt"
else
echo "System not booted"
fi

;;

*)

echo "Commands:"
echo " boot"
echo " status"

;;

esac

