#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BINDINGS="$HOME/ED-Core/AgentSkills"

ACTION="${1:-status}"
shift || true

case "$ACTION" in

bind)

AGENT="$1"
SKILL="$2"

FILE="$BINDINGS/$AGENT.skills"

touch "$FILE"

if grep -qx "$SKILL" "$FILE" 2>/dev/null; then
    echo "Skill already bound"
else
    echo "$SKILL" >> "$FILE"
    echo "✓ Skill bound"
fi

echo "Agent: $AGENT"
echo "Skill: $SKILL"

;;

list)

AGENT="$1"

echo "================================"
echo " ED AGENT SKILLS"
echo "================================"

echo "Agent: $AGENT"
echo

cat "$BINDINGS/$AGENT.skills" 2>/dev/null || echo "No skills"

;;

remove)

AGENT="$1"
SKILL="$2"

sed -i "/^$SKILL$/d" "$BINDINGS/$AGENT.skills"

echo "✓ Skill removed"

;;

status)

COUNT=$(find "$BINDINGS" -name "*.skills" 2>/dev/null | wc -l)

echo "================================"
echo " ED AGENT SKILL BINDING v1.0"
echo "================================"
echo
echo "Agent Profiles: $COUNT"
echo "Status: ONLINE"

;;

*)

echo "Commands:"
echo " bind <agent> <skill>"
echo " list <agent>"
echo " remove <agent> <skill>"
echo " status"

;;

esac

