#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

NETWORK="$HOME/ED-Core/Network"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


identity)

FILE="$NETWORK/node.identity"

if [ ! -f "$FILE" ]; then

cat > "$FILE" <<EOF2
NODE_ID=ED-$(date +%s)
CREATED=$(date)
TYPE=LOCAL
STATUS=ACTIVE
EOF2

fi

cat "$FILE"

;;


register)

NAME="$1"
TYPE="${2:-agent}"

FILE="$NETWORK/$NAME.node"

cat > "$FILE" <<EOF2
NAME=$NAME
TYPE=$TYPE
REGISTERED=$(date)
STATUS=TRUSTED
EOF2

echo "✓ Node registered"

;;


list)

echo "================================"
echo " ED NETWORK NODES"
echo "================================"

for NODE in "$NETWORK"/*.node
do
    [ -e "$NODE" ] || continue
    echo
    cat "$NODE"
done

;;


ping)

NODE="$1"

if [ -f "$NETWORK/$NODE.node" ]; then

echo "✓ Node reachable"
cat "$NETWORK/$NODE.node"

else

echo "Node not found"

fi

;;


status)

COUNT=$(find "$NETWORK" -name "*.node" 2>/dev/null | wc -l)

echo "================================"
echo " ED NETWORK NODE v1.0"
echo "================================"
echo
echo "Connected Nodes: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " identity"
echo " register <name> <type>"
echo " list"
echo " ping <node>"
echo " status"

;;

esac

