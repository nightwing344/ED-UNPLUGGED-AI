#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
ARCH="$BASE/Architecture"

ACTION="${1:-status}"

case "$ACTION" in

analyze)

FINAL="$ARCH/final-module-decisions.txt"
UTILITY="$ARCH/utility-modules.txt"
ARCHIVE="$ARCH/archive-candidates.txt"
KERNEL="$ARCH/kernel-review-list.txt"

>"$FINAL"
>"$UTILITY"
>"$ARCHIVE"
>"$KERNEL"


echo "================================" >> "$FINAL"
echo " ED MODULE DECISION ENGINE v1.0" >> "$FINAL"
echo "================================" >> "$FINAL"


for FILE in "$RUNTIME"/*.sh
do

[ -e "$FILE" ] || continue

NAME=$(basename "$FILE")

CATEGORY="UTILITY"


case "$NAME" in

*kernel*|*governance*|*security*|*runtime*)
CATEGORY="KERNEL REVIEW"
;;

*old*|*backup*|*legacy*)
CATEGORY="ARCHIVE REVIEW"
;;

*status*|*bridge*|*manager*|*helper*)
CATEGORY="UTILITY"
;;

*)
CATEGORY="PLUGIN REVIEW"
;;

esac


echo "$NAME | $CATEGORY" >> "$FINAL"


case "$CATEGORY" in

"KERNEL REVIEW")
echo "$NAME" >> "$KERNEL"
;;

"ARCHIVE REVIEW")
echo "$NAME" >> "$ARCHIVE"
;;

UTILITY)
echo "$NAME" >> "$UTILITY"
;;

esac


done


echo "✓ Decision analysis complete"

echo "$FINAL"

;;

status)

echo "================================"
echo " ED MODULE DECISION ENGINE"
echo "================================"

;;

*)

echo "Commands:"
echo " analyze"
echo " status"

;;

esac

