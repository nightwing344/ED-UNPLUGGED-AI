#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

MODELS="$HOME/ED-Core/Models"

ACTION="${1:-status}"
shift || true


case "$ACTION" in

route)

REQUEST="$*"

echo "================================"
echo " ED MODEL INTELLIGENCE ROUTER v2.0"
echo "================================"
echo

echo "Analyzing request..."

LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')


if echo "$LOWER" | grep -Eq "code|script|debug|program"; then

MODEL="local-coder"

elif echo "$LOWER" | grep -Eq "analyze|strategy|plan|architecture"; then

MODEL="local-reasoning"

elif echo "$LOWER" | grep -Eq "simple|quick|summary"; then

MODEL="fast-model"

else

MODEL="local-general"

fi


echo
echo "Selected Model:"
echo "$MODEL"


LOG="$MODELS/router-history.log"

echo "$(date)|$MODEL|$REQUEST" >> "$LOG"


;;


register)

NAME="$1"
TYPE="${2:-general}"

FILE="$MODELS/$NAME.model"


cat > "$FILE" <<EOF2
MODEL=$NAME
TYPE=$TYPE
CREATED=$(date)
STATUS=ACTIVE
EOF2


echo "✓ Model registered"

;;


list)

echo "================================"
echo " ED MODEL REGISTRY"
echo "================================"

ls "$MODELS"/*.model 2>/dev/null || echo "No models registered"

;;


health)

echo "================================"
echo " ED MODEL HEALTH"
echo "================================"

if command -v ollama >/dev/null; then
    echo "✓ Ollama available"
else
    echo "⚠ Ollama unavailable"
fi

;;


status)

COUNT=$(find "$MODELS" -name "*.model" 2>/dev/null | wc -l)

echo "================================"
echo " ED MODEL ROUTER v2.0"
echo "================================"
echo
echo "Registered Models: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " route <request>"
echo " register <name> <type>"
echo " list"
echo " health"
echo " status"

;;

esac

