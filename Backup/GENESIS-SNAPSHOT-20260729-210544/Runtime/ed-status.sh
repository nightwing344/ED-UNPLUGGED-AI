#!/data/data/com.termux/files/usr/bin/bash

echo "================================"
echo " ED SYSTEM STATUS"
echo "================================"

echo

for ITEM in \
"/storage/emulated/0/ED/Memory" \
"/storage/emulated/0/ED/Specialists" \
"$HOME/ED-Core/Engines" \
"/storage/emulated/0/ED/Knowledge"
do

if [ -e "$ITEM" ]; then
echo "✓ $(basename "$ITEM") ONLINE"
else
echo "⚠ $(basename "$ITEM") MISSING"
fi

done

echo
echo "================================"

