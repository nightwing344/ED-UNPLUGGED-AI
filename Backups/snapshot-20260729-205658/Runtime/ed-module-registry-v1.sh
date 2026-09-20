#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
REGISTRY="$BASE/Registry"

ACTION="${1:-status}"
shift || true


categorize() {

NAME="$1"

case "$NAME" in

*memory*) echo "memory" ;;
*knowledge*) echo "knowledge" ;;
*learning*) echo "learning" ;;
*agent*|*swarm*) echo "agent" ;;
*mission*|*workflow*) echo "mission" ;;
*security*|*secure*) echo "security" ;;
*economic*|*airdrop*|*reputation*) echo "economy" ;;
*governance*) echo "governance" ;;
*simulation*) echo "simulation" ;;
*skill*) echo "skill" ;;
*router*) echo "router" ;;
*command*) echo "command" ;;
*self*) echo "self-improvement" ;;
*) echo "core" ;;

esac

}


case "$ACTION" in


build)

FILE="$REGISTRY/module-registry.db"

echo "Building ED module registry..."

echo "MODULE|CATEGORY|HASH|STATUS|CREATED" > "$FILE"


for MODULE in "$RUNTIME"/*.sh
do

[ -e "$MODULE" ] || continue

NAME=$(basename "$MODULE")

CATEGORY=$(categorize "$NAME")

HASH=$(md5sum "$MODULE" | cut -d' ' -f1)

if bash -n "$MODULE" 2>/dev/null
then
STATUS="healthy"
else
STATUS="error"
fi


echo "$NAME|$CATEGORY|$HASH|$STATUS|$(date)" >> "$FILE"


done


echo "✓ Registry created"
echo "$FILE"

;;


list)

cat "$REGISTRY/module-registry.db" 2>/dev/null || echo "Registry empty"

;;


search)

TERM="$1"

grep -i "$TERM" "$REGISTRY/module-registry.db" 2>/dev/null || echo "No modules found"

;;


category)

TERM="$1"

grep "|$TERM|" "$REGISTRY/module-registry.db" 2>/dev/null || echo "No category found"

;;


health)

echo "================================"
echo " ED MODULE HEALTH"
echo "================================"

awk -F'|' '
NR>1 {
if ($4=="healthy")
good++
else
bad++
}
END {
print "Healthy:",good
print "Errors:",bad
}
' "$REGISTRY/module-registry.db"

;;


status)

COUNT=$(wc -l < "$REGISTRY/module-registry.db" 2>/dev/null || echo 0)

echo "================================"
echo " ED MODULE REGISTRY v1.0"
echo "================================"

echo
echo "Registered Modules: $((COUNT-1))"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " build"
echo " list"
echo " search <term>"
echo " category <name>"
echo " health"
echo " status"

;;

esac

