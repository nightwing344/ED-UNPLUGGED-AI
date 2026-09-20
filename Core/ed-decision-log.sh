#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED

echo "========================================"
echo " ED Decision Log"
echo "========================================"

read -p "Decision title: " TITLE
read -p "Decision notes: " NOTES

FILE="$ED/Memory/Reasoning/Decisions/$(date +%Y%m%d-%H%M).md"

cat > "$FILE" <<EOF2
# $TITLE

Date:
$(date)

Notes:

$NOTES
EOF2

echo "Saved:"
echo "$FILE"
