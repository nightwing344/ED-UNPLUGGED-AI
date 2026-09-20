#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
    read -r -p "ED Request: " REQUEST
fi

echo
echo "================================"
echo " ED ORCHESTRATOR"
echo "================================"

echo
echo "Request:"
echo "$REQUEST"


echo
echo "--- Director Layer ---"

bash "$HOME/ED-Core/Runtime/ed-director-bridge.sh" "$REQUEST"


echo
echo "--- Skill Registry Layer ---"

bash "$HOME/ED-Core/Runtime/ed-director-skill-bridge.sh" "$REQUEST"


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
echo " ORCHESTRATION COMPLETE"
echo "================================"

