#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
CORE=$ED/Core
LOG=$ED/Logs/memory-loop.log

echo "========================================"
echo " ED Memory Loop Running"
echo "========================================"

while true
do

echo "$(date) Memory cycle started" >> "$LOG"

# Run ingestion if available
if [ -x "$CORE/ed-memory-ingest.sh" ]; then
    "$CORE/ed-memory-ingest.sh" >> "$LOG" 2>&1 || true
fi

# Update index if available
if [ -x "$CORE/ed-memory-index.sh" ]; then
    "$CORE/ed-memory-index.sh" >> "$LOG" 2>&1 || true
fi

# Mirror memory if available
if [ -x "$CORE/ed-memory-mirror.sh" ]; then
    "$CORE/ed-memory-mirror.sh" >> "$LOG" 2>&1 || true
fi

echo "$(date) Memory cycle complete" >> "$LOG"

# Wait 30 minutes
sleep 1800

done
