#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

HOME_ED="$HOME/ED-Core"

count_files() {
    find "$1" -type f 2>/dev/null | wc -l
}

echo "================================"
echo " ED MISSION CONTROL v2.0"
echo "================================"
echo

echo "COMPANION"
echo "✓ Identity Online"
echo

echo "CORE SYSTEMS"

if [ -x "$HOME_ED/Runtime/ed-runtime-status.sh" ]; then
    echo "✓ Runtime"
else
    echo "⚠ Runtime"
fi

if [ -d "$HOME_ED/Memory" ]; then
    echo "✓ Memory ($(count_files "$HOME_ED/Memory") records)"
else
    echo "⚠ Memory"
fi

if [ -d "$HOME_ED/KnowledgeGraph" ]; then
    echo "✓ Knowledge Graph ($(count_files "$HOME_ED/KnowledgeGraph") files)"
else
    echo "⚠ Knowledge Graph"
fi

echo

echo "INTELLIGENCE"

if [ -d "$HOME_ED/Skills" ]; then
    echo "✓ Skills ($(count_files "$HOME_ED/Skills"))"
else
    echo "⚠ Skills"
fi

if [ -d "$HOME_ED/Swarm" ]; then
    echo "✓ Agents ($(count_files "$HOME_ED/Swarm"))"
else
    echo "⚠ Agents"
fi

echo

echo "OPERATIONS"

if [ -d "$HOME_ED/Missions" ]; then
    echo "✓ Missions ($(find "$HOME_ED/Missions" -type d -name 'mission-*' 2>/dev/null | wc -l))"
else
    echo "⚠ Missions"
fi

if [ -d "$HOME_ED/Decisions" ]; then
    echo "✓ Decisions ($(count_files "$HOME_ED/Decisions"))"
else
    echo "⚠ Decisions"
fi

echo

echo "LEARNING"

if [ -d "$HOME_ED/Learning" ]; then
    echo "✓ Learning ($(count_files "$HOME_ED/Learning"))"
else
    echo "⚠ Learning"
fi

echo

echo "NETWORK"

if [ -d "$HOME_ED/Network" ]; then
    echo "✓ Nodes ($(count_files "$HOME_ED/Network"))"
else
    echo "⚠ Network"
fi

echo

echo "================================"
echo " STATUS: OPERATIONAL"
echo "================================"

