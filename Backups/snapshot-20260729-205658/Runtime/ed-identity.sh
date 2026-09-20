#!/data/data/com.termux/files/usr/bin/bash

IDENTITY="/storage/emulated/0/ED/Core/Identity"

ACTION="${1:-status}"

case "$ACTION" in

status)

echo "================================"
echo " ED IDENTITY CORE"
echo "================================"

echo

cat "$IDENTITY/ED_IDENTITY.md"

;;

capabilities)

cat "$IDENTITY/CAPABILITIES.md"

;;

*)

echo "Commands:"
echo "status"
echo "capabilities"

;;

esac

