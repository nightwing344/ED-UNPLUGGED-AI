#!/data/data/com.termux/files/usr/bin/bash

REQUEST="${*:-}"

DATE=$(date +"%Y%m%d-%H%M%S")

FILE="/storage/emulated/0/ED/Memory/Decisions/improvement-proposal-$DATE.md"

cat > "$FILE" <<EOF2
# ED Improvement Proposal

Date:
$DATE

Proposal:

$REQUEST

Status:

WAITING FOR USER APPROVAL

Approval Required:
YES
EOF2

echo "Proposal Created:"
echo "$FILE"
