#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
    read -r -p "Request: " REQUEST
fi

echo
echo "================================"
echo " DIRECTOR ANALYSIS"
echo "================================"

echo
echo "Request:"
echo "$REQUEST"

LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')

LEGAL=0
DEV=0
BUILD=0
RESEARCH=0
CREATIVE=0
CRYPTO=0

echo
echo "Domain Scan:"
echo

if echo "$LOWER" | grep -Eq "court|legal|law|judge|motion|custody|filing|case"; then
    LEGAL=95
    echo "✓ Legal Domain: $LEGAL%"
fi

if echo "$LOWER" | grep -Eq "code|app|software|program|ai|website|database"; then
    DEV=90
    echo "✓ Developer Domain: $DEV%"
fi

if echo "$LOWER" | grep -Eq "build|repair|hardware|machine|tool|electrical"; then
    BUILD=85
    echo "✓ Builder Domain: $BUILD%"
fi

if echo "$LOWER" | grep -Eq "research|study|analyze|investigate|information"; then
    RESEARCH=85
    echo "✓ Research Domain: $RESEARCH%"
fi

if echo "$LOWER" | grep -Eq "design|story|creative|write|idea"; then
    CREATIVE=80
    echo "✓ Creative Domain: $CREATIVE%"
fi

if echo "$LOWER" | grep -Eq "crypto|token|blockchain|web3"; then
    CRYPTO=90
    echo "✓ Crypto Domain: $CRYPTO%"
fi


PACKAGE="/storage/emulated/0/ED/Memory/Context/Active/director-context.txt"

{
echo "# ED Director Context"
echo
echo "Request:"
echo "$REQUEST"
echo
echo "Detected Specialists:"
[ "$LEGAL" -gt 0 ] && echo "- Legal-ED"
[ "$DEV" -gt 0 ] && echo "- Developer-ED"
[ "$BUILD" -gt 0 ] && echo "- Builder-ED"
[ "$RESEARCH" -gt 0 ] && echo "- Research-ED"
[ "$CREATIVE" -gt 0 ] && echo "- Creative-ED"
[ "$CRYPTO" -gt 0 ] && echo "- Crypto-ED"
echo
echo "User retains final authority."
echo "Specialists provide recommendations only."
} > "$PACKAGE"


echo
echo "Context Package Created:"
echo "$PACKAGE"

echo
echo "================================"
echo " DIRECTOR BRIDGE COMPLETE"
echo "================================"

