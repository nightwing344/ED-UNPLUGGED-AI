#!/data/data/com.termux/files/usr/bin/bash

echo "========================================"
echo " ED Local Brain Test"
echo "========================================"

MODEL=$(ollama list | awk 'NR==2 {print $1}')

echo "Using:"
echo "$MODEL"

echo

ollama run "$MODEL" "You are ED. Reply with a short system check confirming local brain online."

echo

echo "========================================"
echo " Test Complete"
echo "========================================"
