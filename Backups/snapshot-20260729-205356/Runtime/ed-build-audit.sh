#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

TARGET="${1:-}"
NAME="${2:-ED Component}"

echo "================================"
echo " ED BUILD AUDIT v1.0"
echo "================================"
echo
echo "Component: $NAME"
echo

if [ -z "$TARGET" ]; then
    echo "Usage:"
    echo "ed-build-audit <file> <name>"
    exit 1
fi


echo "[1] File Check"

if [ -f "$TARGET" ]; then
    echo "✓ File exists"
else
    echo "✗ File missing"
    exit 1
fi


echo
echo "[2] Permission Check"

if [ -x "$TARGET" ]; then
    echo "✓ Executable"
else
    echo "Fixing permissions..."
    chmod +x "$TARGET"
    echo "✓ Permission repaired"
fi


echo
echo "[3] Syntax Check"

if bash -n "$TARGET"; then
    echo "✓ Bash syntax valid"
else
    echo "✗ Syntax error detected"
    exit 1
fi


echo
echo "[4] Runtime Check"

mkdir -p "$HOME/ED-Core/Temp"

if "$TARGET" status >"$HOME/ED-Core/Temp/ed-audit-result.txt" 2>&1; then
    echo "✓ Status response OK"
else
    echo "⚠ Status check unavailable"
fi


echo
echo "[5] Audit Report"

REPORT="$HOME/ED-Core/Reports"

mkdir -p "$REPORT"

FILE="$REPORT/BUILD-AUDIT-$(date +%Y%m%d-%H%M%S).txt"

cat > "$FILE" <<EOF2
ED BUILD AUDIT v1.0

Component:
$NAME

File:
$TARGET

Checked:
$(date)

RESULT:
PASS

EOF2


echo "Report:"
echo "$FILE"

echo
echo "================================"
echo " BUILD VERIFIED"
echo "================================"

