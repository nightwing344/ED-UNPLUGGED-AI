#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
OS="$BASE/OS"
REG="$BASE/Registry"
ARCH="$BASE/Architecture"

ACTION="${1:-status}"

case "$ACTION" in

plan)

DATE=$(date +%Y%m%d-%H%M%S)

PLAN="$ARCH/consolidation-plan-$DATE.txt"
DUP="$ARCH/duplicate-review-$DATE.txt"
MERGE="$ARCH/merge-candidates-$DATE.txt"
ARCHIVE="$ARCH/archive-required-$DATE.txt"

echo "================================" > "$PLAN"
echo " ED OS CONSOLIDATION PLAN v1.0" >> "$PLAN"
echo "================================" >> "$PLAN"

echo "Generated:" >> "$PLAN"
date >> "$PLAN"

echo >> "$PLAN"
echo "RULE:" >> "$PLAN"
echo "NO DELETE" >> "$PLAN"
echo "NO MOVE" >> "$PLAN"
echo "PLAN ONLY" >> "$PLAN"

echo "================================" > "$DUP"
echo " DUPLICATE REVIEW" >> "$DUP"
echo "================================" >> "$DUP"

echo "================================" > "$MERGE"
echo " MERGE CANDIDATES" >> "$MERGE"
echo "================================" >> "$MERGE"

echo "================================" > "$ARCHIVE"
echo " ARCHIVE REQUIRED" >> "$ARCHIVE"
echo "================================" >> "$ARCHIVE"

echo
echo "COMPARING MODULES"

for FILE in "$RUNTIME"/*.sh
do

NAME=$(basename "$FILE")

if [ -f "$OS/Kernel/$NAME" ] || \
   [ -f "$OS/Agents/$NAME" ] || \
   [ -f "$OS/Intelligence/$NAME" ] || \
   [ -f "$OS/Memory/$NAME" ] || \
   [ -f "$OS/Governance/$NAME" ] || \
   [ -f "$OS/Plugins/$NAME" ]
then

echo "DUPLICATE: $NAME" | tee -a "$DUP"
echo "REVIEW: $NAME" >> "$MERGE"

else

echo "NEW: $NAME" >> "$PLAN"

fi

done

echo
echo "ARCHIVE REVIEW"

echo "Runtime preserved as legacy source" >> "$ARCHIVE"
echo "Snapshot required before final consolidation" >> "$ARCHIVE"

echo
echo "STATUS:"
echo "CONSOLIDATION PLAN GENERATED"

echo
echo "FILES:"
echo "$PLAN"
echo "$DUP"
echo "$MERGE"
echo "$ARCHIVE"

;;

status)

echo "ED OS Consolidation Engine v1.0"
echo "Mode: PLAN ONLY"

;;

*)

echo "Commands:"
echo " plan"
echo " status"

;;

esac
