#!/data/data/com.termux/files/usr/bin/bash

set -euo pipefail

ED="/storage/emulated/0/ED"
MEM="$ED/Memory"
MAP="$MEM/Semantic/Links/RELATION_MAP.txt"

QUERY="${*:-}"

if [ -z "$QUERY" ]; then
    read -r -p "Semantic Query: " QUERY
fi


echo "========================================"
echo " ED SEMANTIC SEARCH"
echo "========================================"

echo
echo "Concept:"
echo "$QUERY"

echo
echo "--- Related Concepts ---"


case "$(echo "$QUERY" | tr '[:upper:]' '[:lower:]')" in

*brain*|*think*|*intelligence*)
echo "Memory Engine"
echo "Context Engine"
echo "Reasoning Engine"
echo "Ollama Brain"
;;

*legal*|*law*|*court*)
echo "Legal ED"
echo "Pro Se AI"
echo "Rogue Litigan Engine"
;;

*crypto*|*token*|*blockchain*)
echo "Crypto ED"
echo "Web3 Knowledge"
echo "Token Systems"
;;

*build*|*create*|*engineering*)
echo "Builder ED"
echo "DIY ED"
echo "Engineering Knowledge"
;;

*)
echo "General ED Knowledge"
;;

esac


echo
echo "--- Relationship Map ---"

grep -i "$QUERY" "$MAP" 2>/dev/null || echo "No direct link."


echo
echo "========================================"
echo " SEMANTIC SEARCH COMPLETE"
echo "========================================"

