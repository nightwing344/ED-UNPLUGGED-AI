#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
OS="$BASE/OS"
INTEL="$OS/Intelligence"

ACTION="${1:-status}"

LOG="$INTEL/intelligence-log.txt"

case "$ACTION" in

initialize)

echo "================================"
echo " ED INTELLIGENCE ROUTING LAYER v1.0"
echo "================================"

cat > "$INTEL/intelligence-registry.txt" <<EOF2
================================
 ED INTELLIGENCE REGISTRY v1.0
================================

EXECUTIVE:

ed-executive-brain.sh


REASONING:

ed-decision-engine.sh
ed-decision-engine-v2.sh
ed-decision-intelligence-v2.sh


PLANNING:

ed-planning-engine.sh


KNOWLEDGE:

ed-knowledge-engine.sh
ed-knowledge-graph.sh
ed-knowledge-graph-v2.sh


LEARNING:

ed-learning-engine.sh
ed-learning-loop.sh
ed-learning-feedback-loop.sh
ed-learning-pipeline.sh


CURIOSITY:

ed-curiosity.sh
ed-curiosity-engine.sh


STATUS:
REGISTERED

EOF2


cat > "$INTEL/reasoning-route.txt" <<EOF2
================================
 ED REASONING ROUTE v1.0
================================

INPUT
 |
 v
EXECUTIVE BRAIN
 |
 v
DECISION ENGINE
 |
 v
PLANNING ENGINE
 |
 v
KNOWLEDGE SYSTEM
 |
 v
LEARNING LOOP
 |
 v
IMPROVEMENT CYCLE


MODE:
CONTROLLED INTELLIGENCE

EOF2


cat > "$INTEL/intelligence-status.txt" <<EOF2
================================
 ED INTELLIGENCE STATUS
================================

Layer:
ONLINE

Executive Brain:
READY

Decision:
READY

Planning:
READY

Knowledge:
READY

Learning:
READY

Routing:
ACTIVE

EOF2


echo "$(date) Intelligence layer initialized" >> "$LOG"

echo "✓ Intelligence routing initialized"

;;

status)

echo "================================"
echo " ED INTELLIGENCE STATUS"
echo "================================"

cat "$INTEL/intelligence-status.txt" 2>/dev/null || echo "Not initialized"

;;

route)

echo "================================"
echo " ED REASONING ROUTE"
echo "================================"

cat "$INTEL/reasoning-route.txt" 2>/dev/null || echo "Route missing"

;;

list)

cat "$INTEL/intelligence-registry.txt" 2>/dev/null || echo "Registry missing"

;;

*)

echo "Commands:"
echo " initialize"
echo " status"
echo " route"
echo " list"

;;

esac

