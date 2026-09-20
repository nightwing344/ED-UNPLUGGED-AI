#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
ARCH="$BASE/Architecture"
RUNTIME="$BASE/Runtime"

ACTION="${1:-status}"

case "$ACTION" in

review)

DATE=$(date +%Y%m%d-%H%M%S)

DEC="$ARCH/consolidation-decisions-$DATE.txt"
DEP="$ARCH/dependency-review-$DATE.txt"
PROP="$ARCH/canonical-architecture-proposal-$DATE.txt"

echo "================================" > "$DEC"
echo " ED CONSOLIDATION DECISION REVIEW v1.0" >> "$DEC"
echo "================================" >> "$DEC"

echo >> "$DEC"
echo "RULE:"
echo "NO DELETE"
echo "NO AUTOMATIC MERGE"
echo "REVIEW REQUIRED"

echo >> "$DEC"
echo "KEEP CANDIDATES"
echo "--------------------------------"

for FILE in "$BASE"/OS/*/*.sh
do
    [ -f "$FILE" ] || continue
    basename "$FILE"
done >> "$DEC"

echo >> "$DEC"
echo "ARCHIVE REVIEW"
echo "--------------------------------"

grep "DUPLICATE:" "$ARCH"/duplicate-review-*.txt \
2>/dev/null | sed 's/DUPLICATE: //' >> "$DEC" || true


echo "================================" > "$DEP"
echo " ED DEPENDENCY REVIEW v1.0" >> "$DEP"
echo "================================" >> "$DEP"

echo >> "$DEP"
echo "Modules requiring dependency analysis:"
find "$RUNTIME" -name "*.sh" -type f | while read FILE
do
echo "$(basename "$FILE")"
done >> "$DEP"


echo "================================" > "$PROP"
echo " ED CANONICAL ARCHITECTURE PROPOSAL v1.0" >> "$PROP"
echo "================================" >> "$PROP"

echo >> "$PROP"

cat >> "$PROP" <<EOF2
TARGET ARCHITECTURE:

ED OS
 |
 +-- Kernel
 |
 +-- Governance
 |
 +-- Intelligence
 |
 +-- Memory
 |
 +-- Agents
 |
 +-- Plugins

RULES:

1. Registry controls authority
2. OS contains canonical modules
3. Runtime becomes compatibility layer
4. Archive contains retired versions
5. No destructive migration
EOF2

echo
echo "CONSOLIDATION REVIEW COMPLETE"

echo
echo "REPORTS:"
echo "$DEC"
echo "$DEP"
echo "$PROP"

;;

status)

echo "ED Consolidation Review Engine v1.0"
echo "Mode: REVIEW ONLY"

;;

*)

echo "Commands:"
echo " review"
echo " status"

;;

esac
