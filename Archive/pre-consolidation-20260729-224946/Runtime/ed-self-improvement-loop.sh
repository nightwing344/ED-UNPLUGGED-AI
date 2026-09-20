#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

MEMORY="$HOME/ED-Core/Memory"

echo "================================"
echo " ED SELF IMPROVEMENT LOOP v1.0"
echo "================================"
echo

echo "Analyzing ED experience..."

TOTAL=$(find "$MEMORY" -type f 2>/dev/null | wc -l)

echo
echo "Experience Records: $TOTAL"
echo

PROMPT="
You are ED Self Improvement Analyst.

Review this system status:

Experience records: $TOTAL

Generate improvement recommendations.

Return:

AREA:
ISSUE:
RECOMMENDATION:
PRIORITY:
"

ollama run llama3.2:3b "$PROMPT" 2>/dev/null || true

REPORT="$HOME/ED-Core/Reports/ED-SELF-IMPROVEMENT-$(date +%Y%m%d-%H%M%S).txt"

{
echo "ED SELF IMPROVEMENT REPORT"
echo
date
echo
echo "Experience Records: $TOTAL"
} > "$REPORT"

echo
echo "Report:"
echo "$REPORT"

