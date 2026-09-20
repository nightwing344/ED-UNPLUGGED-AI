#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
OS="$BASE/OS"
MEMORY="$OS/Memory"

ACTION="${1:-status}"

LOG="$MEMORY/memory-log.txt"

case "$ACTION" in

initialize)

echo "================================"
echo " ED MEMORY CONSOLIDATION ENGINE v1.0"
echo "================================"

cat > "$MEMORY/memory-registry.txt" <<EOF2
================================
 ED MEMORY REGISTRY v1.0
================================

CORE MEMORY:

ed-memory.sh
ed-memory-intelligence.sh
ed-memory-intelligence-v2.sh
ed-memory-intelligence-v3.sh


RETRIEVAL:

ed-memory-retrieve.sh
ed-memory-request.sh
ed-memory-retrieval-status.sh


EXPERIENCE:

ed-experience-memory.sh


MISSION:

ed-mission-memory.sh


LEARNING MEMORY:

ed-lesson-log.sh
ed-learning-feedback-loop.sh


STATUS:
REGISTERED

EOF2


cat > "$MEMORY/memory-map.txt" <<EOF2
================================
 ED MEMORY MAP v1.0
================================

INPUT
 |
 v
EXPERIENCE CAPTURE
 |
 v
MEMORY STORAGE
 |
 v
RETRIEVAL ENGINE
 |
 v
KNOWLEDGE CONNECTION
 |
 v
LEARNING FEEDBACK
 |
 v
IMPROVEMENT LOOP


MODE:
PERSISTENT MEMORY

EOF2


cat > "$MEMORY/memory-status.txt" <<EOF2
================================
 ED MEMORY STATUS
================================

Layer:
ONLINE

Storage:
READY

Retrieval:
READY

Experience:
READY

Mission Memory:
READY

Learning Memory:
READY

Consolidation:
ACTIVE

EOF2


echo "$(date) Memory layer initialized" >> "$LOG"

echo "✓ Memory consolidation initialized"

;;

status)

echo "================================"
echo " ED MEMORY STATUS"
echo "================================"

cat "$MEMORY/memory-status.txt" 2>/dev/null || echo "Not initialized"

;;

map)

cat "$MEMORY/memory-map.txt" 2>/dev/null || echo "Map missing"

;;

list)

cat "$MEMORY/memory-registry.txt" 2>/dev/null || echo "Registry missing"

;;

*)

echo "Commands:"
echo " initialize"
echo " status"
echo " map"
echo " list"

;;

esac

