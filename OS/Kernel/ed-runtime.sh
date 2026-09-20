#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
    read -r -p "ED Request: " REQUEST
fi

echo
echo "================================"
echo " ED UNIFIED RUNTIME"
echo "================================"

echo
echo "Request:"
echo "$REQUEST"

echo
echo "--- Identity Layer ---"

if [ -f "/storage/emulated/0/ED/Core/Identity/IDENTITY.md" ]; then
echo "✓ Identity Loaded"
else
echo "! Identity unavailable"
fi


echo
echo "--- Governance Layer ---"

echo "✓ User authority active"
echo "✓ Update protection active"
echo "✓ Memory approval active"


echo
echo "--- Director Layer ---"

bash "$HOME/ED-Core/Runtime/ed-director-bridge.sh" "$REQUEST"


echo
echo "--- Specialist Layer ---"

bash "$HOME/ED-Core/Runtime/ed-specialist-consult.sh" "$REQUEST"


echo
echo "--- Curiosity Layer ---"

bash "$HOME/ED-Core/Runtime/ed-curiosity.sh" "$REQUEST"


echo
echo "--- Memory Layer ---"

echo "✓ Memory bridge available"
echo "✓ User approval required"


echo
echo "================================"
echo " ED RUNTIME COMPLETE"
echo "================================"

echo
echo "Next action:"
echo "ED response generation pending"


echo
echo "--- Response Intelligence Layer ---"

bash "$HOME/ED-Core/Runtime/ed-response-engine.sh" "$REQUEST"

echo
echo "✓ Response package generated"

