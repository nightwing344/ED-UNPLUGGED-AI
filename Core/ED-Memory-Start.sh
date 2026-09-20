#!/data/data/com.termux/files/usr/bin/bash

pkill -f ed-memory-loop.sh 2>/dev/null || true

nohup /storage/emulated/0/ED/Core/ed-memory-loop.sh \
> /storage/emulated/0/ED/Logs/memory-loop-console.log 2>&1 &

echo "ED Memory Loop Started"
