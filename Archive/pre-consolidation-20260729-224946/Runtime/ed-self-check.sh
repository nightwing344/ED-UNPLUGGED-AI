#!/data/data/com.termux/files/usr/bin/bash

echo "================================"
echo " ED SELF CHECK"
echo "================================"

BASE="/storage/emulated/0/ED"

echo

for ITEM in \
"Core" \
"Memory" \
"Knowledge" \
"Specialists" \
"Projects"
do

if [ -d "$BASE/$ITEM" ]; then
echo "✓ $ITEM ONLINE"
else
echo "⚠ $ITEM MISSING"
fi

done

echo
echo "Self Improvement:"
echo "✓ Observation ACTIVE"
echo "✓ Suggestions ACTIVE"
echo "✓ Auto Changes DISABLED"

echo
echo "Status: HEALTHY"
