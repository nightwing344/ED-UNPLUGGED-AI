#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "================================"
echo " ED SKILL SCAN"
echo "================================"

echo

if [ -d "/storage/emulated/0/ED/Skills/Installed" ]; then

find "/storage/emulated/0/ED/Skills/Installed" \
-maxdepth 2 \
-name "SKILL.md" \
-print

elif [ -d "$HOME/ED/Skills/Installed" ]; then

find "$HOME/ED/Skills/Installed" \
-maxdepth 2 \
-name "SKILL.md" \
-print

else

echo "No skill directory found."

fi

echo
echo "Skill scan complete."

