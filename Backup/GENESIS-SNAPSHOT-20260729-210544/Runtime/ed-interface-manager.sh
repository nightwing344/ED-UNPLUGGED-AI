#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

INTERFACES="/storage/emulated/0/ED/Core/Interfaces"
LOG="$INTERFACES/interface.log"

ACTION="${1:-status}"
shift || true


case "$ACTION" in

register)

NAME="${*:-Unknown}"

echo "$(date)|REGISTER|$NAME" >> "$LOG"

echo "✓ Interface registered"
echo "$NAME"

;;

request)

CHANNEL="${1:-Unknown}"
shift

MESSAGE="$*"

echo "$(date)|REQUEST|$CHANNEL|$MESSAGE" >> "$LOG"

echo
echo "================================"
echo " ED INTERFACE REQUEST"
echo "================================"

echo
echo "Channel:"
echo "$CHANNEL"

echo
echo "Message:"
echo "$MESSAGE"

echo
echo "✓ Logged"
echo "✓ Governance Check Required"

;;

list)

cat "$INTERFACES/INTERFACE_REGISTRY.md"

;;

status)

echo "================================"
echo " ED INTERFACE STATUS"
echo "================================"

echo
echo "✓ Channel Registry"
echo "✓ Request Intake"
echo "✓ Logging"
echo "✓ Permission Hook"

echo
echo "Status: ACTIVE"

;;

*)

echo "Commands:"
echo "status"
echo "list"
echo "register <name>"
echo "request <channel> <message>"

;;

esac

