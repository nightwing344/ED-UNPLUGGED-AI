#!/data/data/com.termux/files/usr/bin/bash

QUERY="${*:-}"

if [ -z "$QUERY" ]; then
    read -r -p "ED Request: " QUERY
fi


echo "========================================"
echo " DIRECTOR ED SPECIALIST ANALYSIS"
echo "========================================"

echo
echo "Request:"
echo "$QUERY"

LOWER=$(echo "$QUERY" | tr '[:upper:]' '[:lower:]')


echo
echo "Specialists Consulted:"


ACTIVE=""


if echo "$LOWER" | grep -Eq "court|legal|law|judge|motion|custody|filing|appeal"
then
    ACTIVE="$ACTIVE
Legal ED
Pro Se AI ED
Rogue Litigan Engine"
fi


if echo "$LOWER" | grep -Eq "build|repair|fix|wire|electrical|mechanical|diy|tool"
then
    ACTIVE="$ACTIVE
Builder ED
DIY ED"
fi


if echo "$LOWER" | grep -Eq "code|program|software|script|app|ai|computer"
then
    ACTIVE="$ACTIVE
Developer ED
AI Research ED"
fi


if echo "$LOWER" | grep -Eq "crypto|token|blockchain|web3|wallet"
then
    ACTIVE="$ACTIVE
Crypto ED"
fi


if echo "$LOWER" | grep -Eq "research|study|learn|book|history"
then
    ACTIVE="$ACTIVE
Research ED
Teacher ED"
fi


if [ -z "$ACTIVE" ]
then
    ACTIVE="General ED"
fi


echo "$ACTIVE"


echo
echo "Director Decision:"
echo "The activated specialists provide expertise."
echo "Director ED integrates the response."


echo
echo "========================================"

