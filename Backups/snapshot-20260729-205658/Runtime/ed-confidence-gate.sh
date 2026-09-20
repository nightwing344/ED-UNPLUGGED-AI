#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ENGINE="${1:-assistant}"
CONF="${2:-0}"

THRESHOLD="0.75"

PASS=$(awk "BEGIN {print ($CONF >= $THRESHOLD)}")

if [ "$PASS" = "1" ]; then
    echo "PASS"
else
    echo "FALLBACK"
fi
