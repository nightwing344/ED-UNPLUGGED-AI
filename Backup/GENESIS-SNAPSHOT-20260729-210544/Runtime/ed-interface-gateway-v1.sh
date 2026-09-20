#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

INTERFACE="$HOME/ED-Core/Interface"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


register)

NAME="$1"
TYPE="${2:-unknown}"

FILE="$INTERFACE/$NAME.interface"

cat > "$FILE" <<EOF2
NAME=$NAME
TYPE=$TYPE
STATUS=REGISTERED
CREATED=$(date)
EOF2

echo "✓ Interface registered"

;;


request)

SOURCE="$1"
shift

COMMAND="$*"

LOG="$INTERFACE/request.log"

echo "$(date)|$SOURCE|$COMMAND" >> "$LOG"


echo "================================"
echo " ED GATEWAY REQUEST"
echo "================================"

echo
echo "Source:"
echo "$SOURCE"

echo
echo "Command:"
echo "$COMMAND"

echo
echo "✓ Request accepted"

;;


list)

echo "================================"
echo " ED INTERFACES"
echo "================================"

for FILE in "$INTERFACE"/*.interface
do
    [ -e "$FILE" ] || continue
    echo
    cat "$FILE"
done

;;


logs)

tail -50 "$INTERFACE/request.log" 2>/dev/null || echo "No requests"

;;


status)

COUNT=$(find "$INTERFACE" -name "*.interface" 2>/dev/null | wc -l)

echo "================================"
echo " ED EXTERNAL INTERFACE GATEWAY v1.0"
echo "================================"

echo
echo "Interfaces: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " register <name> <type>"
echo " request <source> <command>"
echo " list"
echo " logs"
echo " status"

;;

esac

