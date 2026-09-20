#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REP="$HOME/ED-Core/Reputation"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


create)

USER="$1"

FILE="$REP/$USER.profile"

cat > "$FILE" <<EOF2
USER=$USER
CREATED=$(date)

CONTRIBUTIONS=0
REPUTATION=0
LEVEL=1

STATUS=ACTIVE
EOF2

echo "✓ Reputation profile created"

;;


add)

USER="$1"
TYPE="$2"
VALUE="${3:-1}"

FILE="$REP/$USER.profile"

if [ -f "$FILE" ]; then

CURRENT=$(grep REPUTATION "$FILE" | cut -d= -f2)

NEW=$((CURRENT + VALUE))

sed -i "s/REPUTATION=.*/REPUTATION=$NEW/" "$FILE"

COUNT=$(grep CONTRIBUTIONS "$FILE" | cut -d= -f2)

COUNT=$((COUNT + 1))

sed -i "s/CONTRIBUTIONS=.*/CONTRIBUTIONS=$COUNT/" "$FILE"

echo "✓ Contribution recorded"
echo "Type: $TYPE"
echo "Points: $VALUE"

else

echo "Profile not found"

fi

;;


show)

USER="$1"

cat "$REP/$USER.profile" 2>/dev/null || echo "User not found"

;;


rank)

echo "================================"
echo " ED REPUTATION RANKINGS"
echo "================================"

for FILE in "$REP"/*.profile
do

[ -e "$FILE" ] || continue

USER=$(grep USER "$FILE" | cut -d= -f2)
SCORE=$(grep REPUTATION "$FILE" | cut -d= -f2)

echo "$USER : $SCORE"

done

;;


status)

COUNT=$(find "$REP" -name "*.profile" 2>/dev/null | wc -l)

echo "================================"
echo " ED REPUTATION ENGINE v1.0"
echo "================================"

echo
echo "Profiles: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " create <user>"
echo " add <user> <type> <points>"
echo " show <user>"
echo " rank"
echo " status"

;;

esac

