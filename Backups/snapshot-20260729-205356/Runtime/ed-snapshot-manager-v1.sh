#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
SNAPSHOTS="$BASE/Snapshots"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


create)

NAME="${*:-manual}"

ID="snapshot-$(date +%Y%m%d-%H%M%S)"

DEST="$SNAPSHOTS/$ID"

mkdir -p "$DEST"


echo "Creating ED snapshot..."

cp -r "$BASE/Runtime" "$DEST/" 2>/dev/null || true
cp -r "$BASE/Registry" "$DEST/" 2>/dev/null || true
cp -r "$BASE/Architecture" "$DEST/" 2>/dev/null || true
cp -r "$BASE/Learning" "$DEST/" 2>/dev/null || true
cp -r "$BASE/KnowledgeGraph" "$DEST/" 2>/dev/null || true


find "$DEST" -type f -exec md5sum {} \; > "$DEST/checksums.txt"


cat > "$DEST/info.txt" <<EOF2
SNAPSHOT=$ID
NAME=$NAME
CREATED=$(date)
EOF2


echo "✓ Snapshot created"
echo "$DEST"

;;


list)

echo "================================"
echo " ED SNAPSHOTS"
echo "================================"

find "$SNAPSHOTS" -maxdepth 1 -type d -name "snapshot-*"

;;


verify)

ID="$1"

TARGET="$SNAPSHOTS/$ID"

if [ ! -d "$TARGET" ]; then
echo "Snapshot not found"
exit 1
fi


echo "Verifying..."

cd "$TARGET"

md5sum -c checksums.txt 2>/dev/null || true


;;


compare)

A="$1"
B="$2"

echo "================================"
echo " SNAPSHOT COMPARISON"
echo "================================"

diff -qr \
"$SNAPSHOTS/$A" \
"$SNAPSHOTS/$B" || true

;;


status)

COUNT=$(find "$SNAPSHOTS" -maxdepth 1 -type d -name "snapshot-*" 2>/dev/null | wc -l)

echo "================================"
echo " ED SNAPSHOT MANAGER v1.0"
echo "================================"

echo
echo "Snapshots: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " create <name>"
echo " list"
echo " verify <snapshot>"
echo " compare <A> <B>"
echo " status"

;;

esac

