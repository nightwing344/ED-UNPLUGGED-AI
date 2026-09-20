#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
    read -r -p "ED Request: " REQUEST
fi

echo
echo "================================"
echo " ED SECURE RUNTIME"
echo "================================"

echo

bash "$HOME/ED-Core/Runtime/ed-governance-gate.sh" "$REQUEST"

echo
echo "--- Identity Layer ---"
echo "✓ Identity Loaded"

echo
echo "--- Runtime Authorization ---"
echo "✓ Governance Passed"

echo
echo "Forwarding request to ED Runtime..."

bash "$HOME/ED-Core/Runtime/ed-runtime.sh" "$REQUEST"

