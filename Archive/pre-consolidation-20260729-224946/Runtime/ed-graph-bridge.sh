#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

GRAPH="$HOME/ED-Core/Runtime/ed-knowledge-graph.sh"

if [ -z "$REQUEST" ]; then
    echo "No request supplied"
    exit 1
fi


echo "================================"
echo " ED GRAPH BRIDGE"
echo "================================"

echo
echo "Context:"
echo "$REQUEST"


LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')


if echo "$LOWER" | grep -Eq "build|create|develop|make"; then

echo
echo "Creation pattern detected"

bash "$GRAPH" project "$REQUEST"

fi


if echo "$LOWER" | grep -Eq "decide|decision|architecture|choose"; then

echo
echo "Decision pattern detected"

bash "$GRAPH" decision "$REQUEST"

fi


echo
echo "✓ Graph bridge complete"

