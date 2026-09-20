#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

GOV="$HOME/ED-Core/Governance"

ACTION="${1:-status}"
shift || true


case "$ACTION" in

request)

ACTION_NAME="$*"

ID="approval-$(date +%Y%m%d-%H%M%S)"

cat > "$GOV/$ID.request" <<EOF2
ACTION=$ACTION_NAME
STATUS=PENDING
CREATED=$(date)
EOF2

echo "================================"
echo " ED GOVERNANCE REQUEST"
echo "================================"
echo
echo "ID: $ID"
echo "Status: PENDING"

;;


approve)

ID="$1"

FILE="$GOV/$ID.request"

if [ -f "$FILE" ]; then

sed -i 's/STATUS=PENDING/STATUS=APPROVED/' "$FILE"

echo "✓ Action approved"

else

echo "Request not found"

fi

;;


deny)

ID="$1"

FILE="$GOV/$ID.request"

if [ -f "$FILE" ]; then

sed -i 's/STATUS=PENDING/STATUS=DENIED/' "$FILE"

echo "✓ Action denied"

else

echo "Request not found"

fi

;;


audit)

echo "================================"
echo " ED GOVERNANCE AUDIT"
echo "================================"

for FILE in "$GOV"/*.request
do
    [ -e "$FILE" ] || continue
    echo
    cat "$FILE"
done

;;


status)

COUNT=$(find "$GOV" -name "*.request" 2>/dev/null | wc -l)

echo "================================"
echo " ED SELF GOVERNANCE v1.0"
echo "================================"
echo
echo "Requests: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " request <action>"
echo " approve <id>"
echo " deny <id>"
echo " audit"
echo " status"

;;

esac

