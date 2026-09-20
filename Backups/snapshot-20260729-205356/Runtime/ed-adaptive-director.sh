#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

GRAPH="/storage/emulated/0/ED/Knowledge/Graph"

if [ -z "$REQUEST" ]; then
read -r -p "Request: " REQUEST
fi


echo "================================"
echo " ED ADAPTIVE DIRECTOR"
echo "================================"

echo
echo "Request:"
echo "$REQUEST"


LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')


echo
echo "Specialist Scoring:"


LEGAL=0
DEV=0
BUILD=0
RESEARCH=0
CREATIVE=0
CRYPTO=0


if echo "$LOWER" | grep -Eq "legal|court|law|case|motion|custody"; then
LEGAL=95
fi

if echo "$LOWER" | grep -Eq "app|software|code|ai|database"; then
DEV=95
fi

if echo "$LOWER" | grep -Eq "build|hardware|repair|electrical|machine"; then
BUILD=85
fi

if echo "$LOWER" | grep -Eq "research|analyze|study|investigate"; then
RESEARCH=85
fi

if echo "$LOWER" | grep -Eq "design|write|creative|idea"; then
CREATIVE=80
fi

if echo "$LOWER" | grep -Eq "crypto|token|blockchain|web3"; then
CRYPTO=90
fi


echo
[ "$LEGAL" -gt 0 ] && echo "✓ Legal-ED $LEGAL%"
[ "$DEV" -gt 0 ] && echo "✓ Developer-ED $DEV%"
[ "$BUILD" -gt 0 ] && echo "✓ Builder-ED $BUILD%"
[ "$RESEARCH" -gt 0 ] && echo "✓ Research-ED $RESEARCH%"
[ "$CREATIVE" -gt 0 ] && echo "✓ Creative-ED $CREATIVE%"
[ "$CRYPTO" -gt 0 ] && echo "✓ Crypto-ED $CRYPTO%"


OUTPUT="/storage/emulated/0/ED/Memory/Context/Active/adaptive-director-package.txt"


{
echo "# ED Adaptive Director Package"
echo
echo "Request:"
echo "$REQUEST"
echo
echo "Routing Scores:"
[ "$LEGAL" -gt 0 ] && echo "Legal-ED:$LEGAL"
[ "$DEV" -gt 0 ] && echo "Developer-ED:$DEV"
[ "$BUILD" -gt 0 ] && echo "Builder-ED:$BUILD"
[ "$RESEARCH" -gt 0 ] && echo "Research-ED:$RESEARCH"
[ "$CREATIVE" -gt 0 ] && echo "Creative-ED:$CREATIVE"
[ "$CRYPTO" -gt 0 ] && echo "Crypto-ED:$CRYPTO"

echo
echo "Learning Enabled:"
echo "✓ Knowledge Graph Available"
echo "✓ Historical Context Available"
echo "✓ Approval Required"

} > "$OUTPUT"


echo
echo "Adaptive Package:"
echo "$OUTPUT"

echo
echo "================================"
echo " ADAPTIVE DIRECTOR COMPLETE"
echo "================================"

