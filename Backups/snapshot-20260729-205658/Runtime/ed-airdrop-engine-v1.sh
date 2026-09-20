#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

AIRDROP="$HOME/ED-Core/Airdrop"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


create)

USER="$1"

FILE="$AIRDROP/$USER.allocation"

cat > "$FILE" <<EOF2
USER=$USER

GENESIS=0
REPUTATION=0
CONTRIBUTIONS=0
GOVERNANCE=0

ALLOCATION_SCORE=0
TIER=NONE

STATUS=ACTIVE
CREATED=$(date)
EOF2

echo "✓ Allocation profile created"

;;


set)

USER="$1"
FIELD="$2"
VALUE="$3"

FILE="$AIRDROP/$USER.allocation"

if [ -f "$FILE" ]; then

sed -i "s/^$FIELD=.*/$FIELD=$VALUE/" "$FILE"

echo "✓ Allocation updated"

else

echo "Profile not found"

fi

;;


calculate)

USER="$1"

FILE="$AIRDROP/$USER.allocation"

if [ -f "$FILE" ]; then

GENESIS=$(grep GENESIS "$FILE" | cut -d= -f2)
REP=$(grep REPUTATION "$FILE" | cut -d= -f2)
CON=$(grep CONTRIBUTIONS "$FILE" | cut -d= -f2)
GOV=$(grep GOVERNANCE "$FILE" | cut -d= -f2)


SCORE=$((GENESIS*500 + REP + CON + GOV))


if [ "$SCORE" -ge 1000 ]; then
TIER="GENESIS"

elif [ "$SCORE" -ge 500 ]; then
TIER="CORE"

elif [ "$SCORE" -ge 100 ]; then
TIER="COMMUNITY"

else
TIER="OBSERVER"

fi


sed -i "s/ALLOCATION_SCORE=.*/ALLOCATION_SCORE=$SCORE/" "$FILE"
sed -i "s/TIER=.*/TIER=$TIER/" "$FILE"


echo "================================"
echo " ED ALLOCATION RESULT"
echo "================================"

echo "Score: $SCORE"
echo "Tier: $TIER"


else

echo "Profile not found"

fi

;;


show)

cat "$AIRDROP/$1.allocation" 2>/dev/null || echo "Not found"

;;


list)

ls "$AIRDROP"/*.allocation 2>/dev/null || echo "No allocations"

;;


status)

COUNT=$(find "$AIRDROP" -name "*.allocation" 2>/dev/null | wc -l)

echo "================================"
echo " ED AIRDROP ENGINE v1.0"
echo "================================"

echo
echo "Profiles: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " create <user>"
echo " set <user> <field> <value>"
echo " calculate <user>"
echo " show <user>"
echo " list"
echo " status"

;;

esac

