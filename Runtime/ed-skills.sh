#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ACTION="${1:-status}"
SKILL="${2:-}"

SKILLS="/storage/emulated/0/ED/Skills"
LOG="/storage/emulated/0/ED/Logs/Skills/skills.log"

mkdir -p "$(dirname "$LOG")"

case "$ACTION" in

status)

echo "================================"
echo " ED SKILL REGISTRY STATUS"
echo "================================"

echo
echo "Installed:"
find "$SKILLS/Installed" -maxdepth 1 -type d | tail -n +2

echo
echo "Disabled:"
find "$SKILLS/Disabled" -maxdepth 1 -type d | tail -n +2

echo
echo "Registry: ACTIVE"

;;

list)

echo "================================"
echo " ED AVAILABLE SKILLS"
echo "================================"

find "$SKILLS" -maxdepth 2 -type d

;;

enable)

if [ -z "$SKILL" ]; then
echo "Skill name required"
exit 1
fi

echo "Enable request:"
echo "$SKILL"

echo "Approval required before activation."

;;

disable)

if [ -z "$SKILL" ]; then
echo "Skill name required"
exit 1
fi

echo "Disable request:"
echo "$SKILL"

echo "Approval required before change."

;;

*)

echo "Usage:"
echo "ed-skills status"
echo "ed-skills list"
echo "ed-skills enable NAME"
echo "ed-skills disable NAME"

;;

esac

