#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
    read -r -p "Request: " REQUEST
fi

OUTPUT="/storage/emulated/0/ED/Memory/Context/Active/ed-response-package.txt"

echo "================================"
echo " ED RESPONSE INTELLIGENCE"
echo "================================"

echo

{
echo "# ED Response Package"
echo
echo "Request:"
echo "$REQUEST"

echo
echo "Analysis Summary:"
echo

DIRECTOR="/storage/emulated/0/ED/Memory/Context/Active/director-context.txt"
SPECIALIST="/storage/emulated/0/ED/Memory/Context/Active/specialist-consultation.txt"

if [ -f "$DIRECTOR" ]; then
echo "✓ Director analysis available"
else
echo "! Director context missing"
fi

if [ -f "$SPECIALIST" ]; then
echo "✓ Specialist analysis available"
else
echo "! Specialist consultation missing"
fi

echo
echo "Response Structure:"
echo

echo "1. Explain findings"
echo "2. Present options"
echo "3. Recommend next steps"
echo "4. Request user approval before action"

echo
echo "ED Rules:"
echo "- User remains final authority"
echo "- No automatic changes"
echo "- No silent updates"
echo "- No unapproved memory writes"

} > "$OUTPUT"


echo
echo "Response Package Created:"
echo "$OUTPUT"

echo
echo "================================"
echo " RESPONSE ENGINE COMPLETE"
echo "================================"

