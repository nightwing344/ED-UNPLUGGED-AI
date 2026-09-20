#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
MEM=$ED/Memory

echo "========================================"
echo " ED Memory Ingestion"
echo "========================================"

SOURCE="$MEM/Inbox"

if [ ! -d "$SOURCE" ]; then
    echo "Inbox missing"
    exit 1
fi

COUNT=$(find "$SOURCE" -type f | wc -l)

echo "Files waiting:"
echo "$COUNT"

if [ "$COUNT" -gt 0 ]; then
    mkdir -p "$MEM/Ingestion/Processed"

    for FILE in "$SOURCE"/*
    do
        [ -f "$FILE" ] || continue

        NAME=$(basename "$FILE")

        cp "$FILE" "$MEM/Ingestion/Processed/$NAME"

        echo "$(date) Processed $NAME" >> \
        "$MEM/Ingestion/Logs/ingestion.log"
    done

    echo "Processing complete"
else
    echo "No files to process"
fi

echo
echo "========================================"
echo " Ingestion Complete"
echo "========================================"
