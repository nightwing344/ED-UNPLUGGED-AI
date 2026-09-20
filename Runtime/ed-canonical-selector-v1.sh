#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
ARCH="$BASE/Architecture"

DATE=$(date +%Y%m%d-%H%M%S)
OUT="$ARCH/canonical-system-map-$DATE.txt"

echo "================================"
echo " ED CANONICAL SELECTOR v1.0"
echo "================================"

{
echo "================================"
echo " ED CANONICAL SYSTEM MAP"
echo "================================"
echo
echo "Generated:"
date
echo

echo "================================"
echo "KERNEL AUTHORITY"
echo "================================"

grep -A20 "KERNEL:" \
"$ARCH/authoritative-module-map.txt" \
2>/dev/null || echo "Kernel map missing"


echo
echo "================================"
echo "GOVERNANCE AUTHORITY"
echo "================================"

grep -i "governance" \
"$ARCH/final-module-decisions.txt" \
2>/dev/null || true


echo
echo "================================"
echo "MEMORY AUTHORITY"
echo "================================"

grep -i "memory" \
"$ARCH/final-module-decisions.txt" \
2>/dev/null || true


echo
echo "================================"
echo "INTELLIGENCE AUTHORITY"
echo "================================"

grep -iE "decision|learning|knowledge|planning|curiosity" \
"$ARCH/final-module-decisions.txt" \
2>/dev/null || true


echo
echo "================================"
echo "AGENT AUTHORITY"
echo "================================"

grep -iE "agent|swarm|worker|specialist" \
"$ARCH/final-module-decisions.txt" \
2>/dev/null || true


echo
echo "================================"
echo "PLUGIN AUTHORITY"
echo "================================"

grep "PLUGIN REVIEW" \
"$ARCH/final-module-decisions.txt" \
2>/dev/null || true


echo
echo "================================"
echo "STATUS"
echo "================================"

echo "Canonical selection complete."
echo "No deletion performed."
echo "Ready for controlled consolidation."

} | tee "$OUT"


echo
echo "REPORT:"
echo "$OUT"
