#!/data/data/com.termux/files/usr/bin/bash

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
    read -r -p "Thought: " REQUEST
fi

echo
echo "================================"
echo " ED CURIOSITY ENGINE"
echo "================================"

echo
echo "Input:"
echo "$REQUEST"

echo
echo "Curiosity Scan:"

LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')

if echo "$LOWER" | grep -Eq "build|create|make|develop"; then
    echo "✓ Creation detected"
    echo "Questions ED may explore:"
    echo "- What is the goal?"
    echo "- What problem does this solve?"
    echo "- What are possible improvements?"
fi

if echo "$LOWER" | grep -Eq "fix|repair|error|broken"; then
    echo "✓ Problem solving detected"
    echo "Questions ED may explore:"
    echo "- What changed?"
    echo "- What worked before?"
    echo "- What evidence exists?"
fi

if echo "$LOWER" | grep -Eq "why|how|explain"; then
    echo "✓ Learning mode detected"
    echo "ED seeks deeper understanding."
fi


echo
echo "Curiosity Rules:"
echo "- Ask before assuming."
echo "- Explore before concluding."
echo "- Record lessons."
echo "- User has final authority."

echo
echo "Status: ACTIVE"

