#!/data/data/com.termux/files/usr/bin/bash

PHRASE="hey ed"

echo "================================"
echo " ED WAKE WORD LISTENER"
echo "================================"

echo
echo "Waiting for:"
echo "$PHRASE"

echo
echo "Listening simulation active."

read -r -p "Voice Input: " INPUT

LOWER=$(echo "$INPUT" | tr '[:upper:]' '[:lower:]')

if echo "$LOWER" | grep -q "$PHRASE"; then

echo
echo "✓ Wake Word Detected"

echo
echo "Sending to ED Runtime..."

else

echo
echo "No activation detected."

fi

