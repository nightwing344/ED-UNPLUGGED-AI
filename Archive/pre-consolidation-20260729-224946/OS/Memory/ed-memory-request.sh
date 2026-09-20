#!/data/data/com.termux/files/usr/bin/bash

NOTE="${*:-}"

if [ -z "$NOTE" ]; then
read -r -p "Memory candidate: " NOTE
fi

echo "================================"
echo " ED MEMORY APPROVAL"
echo "================================"

echo
echo "Candidate:"
echo "$NOTE"

echo
echo "Save this information?"

echo "Type:"
echo "yes - save"
echo "no  - discard"

read -r ANSWER

if [ "$ANSWER" = "yes" ]; then

FILE="/storage/emulated/0/ED/Memory/Inbox/memory-$RANDOM.txt"

{
echo "ED Memory Entry"
echo
echo "Date:"
date
echo
echo "Content:"
echo "$NOTE"
echo
echo "Approved by user"
} > "$FILE"

echo
echo "Saved:"
echo "$FILE"

else

echo
echo "Memory discarded."

fi

