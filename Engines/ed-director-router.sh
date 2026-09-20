#!/data/data/com.termux/files/usr/bin/bash

QUERY="${*:-}"

if [ -z "$QUERY" ]; then
read -r -p "ED Request: " QUERY
fi


echo "========================================"
echo " DIRECTOR ED ROUTER"
echo "========================================"

echo
echo "Request:"
echo "$QUERY"

LOWER=$(echo "$QUERY" | tr '[:upper:]' '[:lower:]')


echo
echo "Consulting Departments:"


if echo "$LOWER" | grep -Eq "court|legal|law|custody|motion|filing|judge"
then
echo "[ACTIVE] Legal ED"
echo "[ACTIVE] Pro Se AI ED"
fi


if echo "$LOWER" | grep -Eq "build|repair|wire|engine|mechanical|diy"
then
echo "[ACTIVE] Builder ED"
echo "[ACTIVE] DIY ED"
fi


if echo "$LOWER" | grep -Eq "code|program|ai|script|software"
then
echo "[ACTIVE] Developer ED"
echo "[ACTIVE] AI Research ED"
fi


if echo "$LOWER" | grep -Eq "crypto|token|blockchain|web3"
then
echo "[ACTIVE] Crypto ED"
fi


if echo "$LOWER" | grep -Eq "research|learn|study|book"
then
echo "[ACTIVE] Research ED"
echo "[ACTIVE] Teacher ED"
fi


echo
echo "Director Decision:"
echo "Specialists provide input."
echo "Director ED maintains final response."

echo
echo "========================================"

