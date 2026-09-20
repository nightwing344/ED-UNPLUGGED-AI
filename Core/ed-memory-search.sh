#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
INDEX=$ED/Memory/Retrieval/Index/memory-index.txt

echo "========================================"
echo " ED Memory Search"
echo "========================================"

if [ ! -f "$INDEX" ]; then
    echo "Index missing. Run index builder first."
    exit 1
fi

read -p "Search term: " QUERY

echo
echo "Results:"
grep -i "$QUERY" "$INDEX" || echo "No matches"

echo
echo "$(date) Search: $QUERY" >> \
$ED/Memory/Retrieval/Logs/search.log

echo "========================================"
