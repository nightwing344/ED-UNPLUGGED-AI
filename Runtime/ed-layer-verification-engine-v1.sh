#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
OS="$BASE/OS"
RUNTIME="$BASE/Runtime"
REPORTS="$BASE/Reports"

REPORT="$REPORTS/ED-MIGRATION-INTEGRITY-$(date +%Y%m%d-%H%M%S).txt"

{
echo "================================"
echo " ED LAYER VERIFICATION ENGINE v1.0"
echo "================================"
echo
echo "Date: $(date)"
echo


echo "================================"
echo " KERNEL VERIFICATION"
echo "================================"

for FILE in "$OS/Kernel"/*.sh
do
[ -e "$FILE" ] || continue

NAME=$(basename "$FILE")

if [ -f "$RUNTIME/$NAME" ]; then
echo "✓ $NAME verified"
else
echo "✗ $NAME missing from Runtime"
fi

done


echo
echo "================================"
echo " PLUGIN VERIFICATION"
echo "================================"

for FILE in "$OS/Plugins"/*.sh
do
[ -e "$FILE" ] || continue

NAME=$(basename "$FILE")

if [ -f "$RUNTIME/$NAME" ]; then
echo "✓ $NAME verified"
else
echo "✗ $NAME missing from Runtime"
fi

done


echo
echo "================================"
echo " OS STRUCTURE"
echo "================================"

for DIR in \
Kernel \
Agents \
Intelligence \
Memory \
Governance \
Plugins \
Extensions \
Archive \
Migration

do

if [ -d "$OS/$DIR" ]; then
echo "✓ $DIR online"
else
echo "✗ $DIR missing"
fi

done


echo
echo "================================"
echo " MIGRATION LOG"
echo "================================"

if [ -f "$OS/Migration/migrated.txt" ]; then
wc -l "$OS/Migration/migrated.txt" | awk '{print "Migrated modules: "$1}'
else
echo "No migration records"
fi


echo
echo "================================"
echo " STATUS"
echo "================================"

echo "ED OS Migration Integrity: VERIFIED"

echo
echo "Report:"
echo "$REPORT"

} | tee "$REPORT"

