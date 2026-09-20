#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

DECISIONS="$HOME/ED-Core/Decisions"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


analyze)

QUESTION="$*"

ID="decision-$(date +%Y%m%d-%H%M%S)"
FILE="$DECISIONS/$ID.txt"


cat > "$FILE" <<EOF2
DECISION ID=$ID

QUESTION:
$QUESTION

RISK SCORE:
0

OPPORTUNITY SCORE:
0

CONFIDENCE:
0

STATUS:
ANALYZED

CREATED:
$(date)
EOF2


echo "================================"
echo " ED DECISION ANALYSIS"
echo "================================"
echo
echo "ID: $ID"
echo "Status: ANALYZED"

;;


score)

ID="$1"
RISK="$2"
OPPORTUNITY="$3"
CONFIDENCE="$4"

FILE="$DECISIONS/$ID.txt"

if [ -f "$FILE" ]; then

cat >> "$FILE" <<EOF2

UPDATED SCORES:

RISK=$RISK
OPPORTUNITY=$OPPORTUNITY
CONFIDENCE=$CONFIDENCE

EOF2

echo "✓ Scores updated"

else

echo "Decision not found"

fi

;;


recommend)

ID="$1"

FILE="$DECISIONS/$ID.txt"

echo "================================"
echo " ED RECOMMENDATION"
echo "================================"

if grep -q "OPPORTUNITY=[7-9]" "$FILE" 2>/dev/null; then

echo "Recommendation: PROCEED"

elif grep -q "RISK=[7-9]" "$FILE" 2>/dev/null; then

echo "Recommendation: REVIEW"

else

echo "Recommendation: ANALYZE FURTHER"

fi

;;


list)

ls "$DECISIONS"/*.txt 2>/dev/null || echo "No decisions"

;;


status)

COUNT=$(find "$DECISIONS" -name "*.txt" 2>/dev/null | wc -l)

echo "================================"
echo " ED DECISION INTELLIGENCE v2.0"
echo "================================"
echo
echo "Decisions: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " analyze <question>"
echo " score <id> <risk> <opportunity> <confidence>"
echo " recommend <id>"
echo " list"
echo " status"

;;

esac

