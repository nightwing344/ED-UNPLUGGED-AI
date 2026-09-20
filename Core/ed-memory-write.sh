#!/data/data/com.termux/files/usr/bin/bash

TYPE="$1"
TEXT="$2"

BASE=/storage/emulated/0/ED/Memory

if [ -z "$TYPE" ] || [ -z "$TEXT" ]; then
    echo "Usage:"
    echo "ed-memory-write.sh <folder> <text>"
    exit 1
fi

DATE=$(date +%Y-%m-%d-%H%M)

echo "$DATE"
echo "$TEXT" >> "$BASE/$TYPE/$DATE.txt"

echo "Memory saved:"
echo "$BASE/$TYPE/$DATE.txt"
