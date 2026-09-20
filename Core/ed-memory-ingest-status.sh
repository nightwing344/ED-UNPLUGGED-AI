#!/data/data/com.termux/files/usr/bin/bash

MEM=/storage/emulated/0/ED/Memory

echo "========================================"
echo " ED Ingestion Status"
echo "========================================"

echo "Inbox:"
find "$MEM/Inbox" -type f 2>/dev/null | wc -l

echo "Processed:"
find "$MEM/Ingestion/Processed" -type f 2>/dev/null | wc -l

echo "Logs:"
if [ -f "$MEM/Ingestion/Logs/ingestion.log" ]; then
    tail -10 "$MEM/Ingestion/Logs/ingestion.log"
else
    echo "No logs"
fi

echo "========================================"
