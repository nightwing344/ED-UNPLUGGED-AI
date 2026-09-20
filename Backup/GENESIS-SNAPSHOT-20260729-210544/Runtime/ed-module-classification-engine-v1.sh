#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
ARCH="$BASE/Architecture"

ACTION="${1:-status}"

case "$ACTION" in

analyze)

MASTER="$ARCH/module-classification.txt"
KERNEL="$ARCH/kernel-modules.txt"
EXT="$ARCH/extension-modules.txt"
REVIEW="$ARCH/review-modules.txt"


> "$MASTER"
> "$KERNEL"
> "$EXT"
> "$REVIEW"


echo "================================" >> "$MASTER"
echo " ED MODULE CLASSIFICATION v1.0" >> "$MASTER"
echo "================================" >> "$MASTER"
echo >> "$MASTER"


for FILE in "$RUNTIME"/*.sh
do

[ -e "$FILE" ] || continue

NAME=$(basename "$FILE")


CATEGORY="REVIEW"


case "$NAME" in

ed-runtime*|ed-executive-brain*|ed-router*|ed-adaptive-router*)
CATEGORY="KERNEL"
;;

ed-agent*|ed-memory*|ed-knowledge*|ed-learning*|ed-security*)
CATEGORY="CORE SERVICE"
;;

ed-mission*|ed-economic*|ed-digital-twin*|ed-simulation*|ed-research*)
CATEGORY="EXTENSION"
;;

*)
CATEGORY="REVIEW"
;;

esac


echo "$NAME | $CATEGORY" >> "$MASTER"


case "$CATEGORY" in

KERNEL)
echo "$NAME" >> "$KERNEL"
;;

EXTENSION)
echo "$NAME" >> "$EXT"
;;

REVIEW)
echo "$NAME" >> "$REVIEW"
;;

esac


done


echo
echo "✓ Classification complete"
echo

echo "Kernel modules:"
wc -l < "$KERNEL"

echo "Core services:"
grep "CORE SERVICE" "$MASTER" | wc -l

echo "Extensions:"
wc -l < "$EXT"

echo "Review:"
wc -l < "$REVIEW"


;;

status)

echo "================================"
echo " ED MODULE CLASSIFICATION"
echo "================================"

if [ -f "$ARCH/module-classification.txt" ]; then
echo "Classification: READY"
else
echo "Classification: NOT RUN"
fi

;;

*)

echo "Commands:"
echo " analyze"
echo " status"

;;

esac

