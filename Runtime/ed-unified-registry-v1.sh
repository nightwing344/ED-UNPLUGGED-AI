#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
REG="$BASE/Registry"
ARCH="$BASE/Architecture"

ACTION="${1:-status}"

case "$ACTION" in

build)

DATE=$(date)

cat > "$REG/master-registry.txt" <<EOF2
================================
 ED MASTER SYSTEM REGISTRY v1.0
================================

Generated:
$DATE

SOURCE:
Canonical System Map

AUTHORITY:
ED Kernel Authority Engine

STATUS:
ACTIVE


LAYERS:

KERNEL
------
See kernel-registry.txt


AGENTS
------
See agent-registry.txt


INTELLIGENCE
------------
See intelligence-registry.txt


MEMORY
------
See memory-registry.txt


PLUGINS
-------
See plugin-registry.txt


ARCHIVE
-------
See archive-registry.txt


RULE:
No deletion without archive approval.

EOF2


grep -A15 "KERNEL:" "$ARCH/canonical-system-map-"*.txt > "$REG/kernel-registry.txt" || true

grep -A20 "AGENT AUTHORITY" "$ARCH/canonical-system-map-"*.txt > "$REG/agent-registry.txt" || true

grep -A20 "INTELLIGENCE AUTHORITY" "$ARCH/canonical-system-map-"*.txt > "$REG/intelligence-registry.txt" || true

grep -A20 "MEMORY AUTHORITY" "$ARCH/canonical-system-map-"*.txt > "$REG/memory-registry.txt" || true

grep -A200 "PLUGIN AUTHORITY" "$ARCH/canonical-system-map-"*.txt > "$REG/plugin-registry.txt" || true


echo "================================"
echo " ED UNIFIED REGISTRY v1.0"
echo "================================"
echo
echo "Registry created:"
echo "$REG"

;;

status)

echo "ED Unified Registry v1.0"

if [ -f "$REG/master-registry.txt" ]; then
echo "STATUS: ONLINE"
else
echo "STATUS: NOT BUILT"
fi

;;

*)

echo "Commands:"
echo " build"
echo " status"

;;

esac
