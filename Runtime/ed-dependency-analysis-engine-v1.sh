#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
OS="$BASE/OS"
ARCH="$BASE/Architecture"

ACTION="${1:-status}"

case "$ACTION" in

analyze)

DATE=$(date +%Y%m%d-%H%M%S)

MAP="$ARCH/dependency-map-$DATE.txt"
CONFLICT="$ARCH/dependency-conflicts-$DATE.txt"
ORDER="$ARCH/consolidation-order-$DATE.txt"

echo "================================" > "$MAP"
echo " ED DEPENDENCY MAP v1.0" >> "$MAP"
echo "================================" >> "$MAP"

echo >> "$MAP"
echo "Generated:"
date >> "$MAP"

echo >> "$MAP"
echo "MODULE DEPENDENCIES"
echo "--------------------------------" >> "$MAP"

find "$RUNTIME" -name "*.sh" -type f | while read FILE
do

NAME=$(basename "$FILE")

echo >> "$MAP"
echo "MODULE: $NAME" >> "$MAP"

grep -E "source |bash |sh |\\./" "$FILE" \
2>/dev/null | head -10 >> "$MAP" || true

done


echo "================================" > "$CONFLICT"
echo " ED DEPENDENCY CONFLICT REVIEW" >> "$CONFLICT"
echo "================================" >> "$CONFLICT"

echo >> "$CONFLICT"
echo "Potential duplicate responsibilities:" >> "$CONFLICT"

find "$OS" -name "*.sh" -type f | \
sed 's#.*/##' | \
sort | uniq -d >> "$CONFLICT" || true


echo "================================" > "$ORDER"
echo " ED CONSOLIDATION ORDER PROPOSAL" >> "$ORDER"
echo "================================" >> "$ORDER"

cat >> "$ORDER" <<EOF2

PHASE 1:
Kernel dependencies

PHASE 2:
Governance dependencies

PHASE 3:
Memory dependencies

PHASE 4:
Intelligence dependencies

PHASE 5:
Agent dependencies

PHASE 6:
Plugin dependencies

PHASE 7:
Registry update

PHASE 8:
Health verification

RULE:
Archive before change.
Rollback required.
EOF2


echo
echo "DEPENDENCY ANALYSIS COMPLETE"

echo
echo "REPORTS:"
echo "$MAP"
echo "$CONFLICT"
echo "$ORDER"

;;

status)

echo "ED Dependency Analysis Engine v1.0"
echo "Mode: ANALYSIS ONLY"

;;

*)

echo "Commands:"
echo " analyze"
echo " status"

;;

esac
