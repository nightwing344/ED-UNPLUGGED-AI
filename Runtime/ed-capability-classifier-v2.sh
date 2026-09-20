#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUNTIME="$HOME/ED-Core/Runtime"
ARCH="$HOME/ED-Core/Architecture"

ACTION="${1:-status}"

case "$ACTION" in

analyze)

MAP="$ARCH/capability-map-v2.txt"

{
echo "================================"
echo " ED CAPABILITY CLASSIFICATION v2.0"
echo "================================"
echo


echo "=== AGENT LAYER ==="
grep -E "agent|swarm|worker|specialist" \
<(find "$RUNTIME" -name "*.sh" -printf "%f\n") 2>/dev/null || true

echo

echo "=== INTELLIGENCE LAYER ==="
grep -E "brain|decision|planning|reason|curiosity|learning|knowledge" \
<(find "$RUNTIME" -name "*.sh" -printf "%f\n") 2>/dev/null || true

echo

echo "=== GOVERNANCE LAYER ==="
grep -E "governance|confidence|identity|profile|security" \
<(find "$RUNTIME" -name "*.sh" -printf "%f\n") 2>/dev/null || true

echo

echo "=== MEMORY LAYER ==="
grep -E "memory|experience|lesson" \
<(find "$RUNTIME" -name "*.sh" -printf "%f\n") 2>/dev/null || true

echo

echo "=== UTILITY LAYER ==="
grep -E "status|manager|bridge|connector|config" \
<(find "$RUNTIME" -name "*.sh" -printf "%f\n") 2>/dev/null || true

} > "$MAP"


echo "✓ Capability classification complete"
echo "$MAP"

;;

status)

echo "ED Capability Classifier v2.0"

;;

*)

echo "Commands:"
echo " analyze"
echo " status"

;;

esac

