#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
ARCH="$BASE/Architecture"
BACKUP="$BASE/Backup"

ACTION="${1:-status}"

case "$ACTION" in

snapshot)

STAMP=$(date +%Y%m%d-%H%M%S)
SNAP="$BACKUP/GENESIS-SNAPSHOT-$STAMP"

mkdir -p "$SNAP"

echo "================================"
echo " ED GENESIS SNAPSHOT v1.0"
echo "================================"

echo "Creating snapshot..."

cp -r "$RUNTIME" "$SNAP/Runtime"
cp -r "$ARCH" "$SNAP/Architecture"

mkdir -p "$SNAP/Reports"

cp "$BASE"/Reports/* "$SNAP/Reports/" 2>/dev/null || true


echo "Generating manifest..."

find "$SNAP" -type f | sort > "$SNAP/file-manifest.txt"

echo "Generating hashes..."

(
cd "$SNAP"
find . -type f -exec sha256sum {} \;
) > "$SNAP/hash-manifest.txt"


echo "Creating migration map..."

cat > "$ARCH/migration-plan-v1.txt" <<EOF2
================================
 ED MIGRATION PLAN v1.0
================================

KERNEL:
- Runtime
- Executive Brain
- Router
- Agent Runtime
- Memory
- Knowledge
- Learning
- Security
- Mission
- Governance


AGENTS:
- Workers
- Swarm
- Specialists
- Agent Tools


INTELLIGENCE:
- Decision
- Planning
- Curiosity
- Learning


MEMORY:
- Experience
- Retrieval
- Mission Memory


PLUGINS:
- Economic
- Digital Twin
- Simulation
- Research
- Connectors


RULE:
No deletion during migration.

EOF2


cat > "$ARCH/rollback-map-v1.txt" <<EOF2
================================
 ED ROLLBACK MAP v1.0
================================

Snapshot:
$SNAP

Restore method:
Copy snapshot directories back to ED-Core.

Protection:
Original Runtime preserved.

EOF2


echo
echo "✓ Genesis snapshot complete"
echo
echo "Snapshot:"
echo "$SNAP"

;;

status)

echo "ED Snapshot Migration Readiness Engine v1.0"

;;

*)

echo "Commands:"
echo " snapshot"
echo " status"

;;

esac

