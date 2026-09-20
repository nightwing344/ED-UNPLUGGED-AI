#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REGISTRY="$HOME/ED-Core/CapabilityRegistry"

ACTION="${1:-status}"
shift || true

case "$ACTION" in

register)

TYPE="$1"
NAME="$2"
DESCRIPTION="$3"

FILE="$REGISTRY/$TYPE-$NAME.cap"

cat > "$FILE" <<EOF2
TYPE=$TYPE
NAME=$NAME
DESCRIPTION=$DESCRIPTION
CREATED=$(date)
EOF2

echo "✓ Capability registered"

;;

find)

TERM="${1:-}"

echo "================================"
echo " ED CAPABILITY SEARCH"
echo "================================"

grep -ril "$TERM" "$REGISTRY" 2>/dev/null || echo "No capability found"

;;

show)

NAME="$1"

grep -R "$NAME" "$REGISTRY" 2>/dev/null || echo "Capability not found"

;;

status)

COUNT=$(find "$REGISTRY" -type f 2>/dev/null | wc -l)

echo "================================"
echo " ED CAPABILITY REGISTRY v1.0"
echo "================================"
echo
echo "Capabilities: $COUNT"
echo "Status: ONLINE"

;;

*)

echo "Commands:"
echo " register <type> <name> <description>"
echo " find <term>"
echo " show <name>"
echo " status"

;;

esac

