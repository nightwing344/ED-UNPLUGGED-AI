#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
CTX=$ED/Memory/Context

echo "========================================"
echo " ED Context Loader"
echo "========================================"

read -p "Current task: " TASK

FILE="$CTX/Active/current-context.md"

cat > "$FILE" <<EOFCTX
# Active Context

Task:
$TASK

Created:
$(date)

Status:
ACTIVE
EOFCTX

echo
echo "Context created:"
echo "$FILE"

echo "========================================"
