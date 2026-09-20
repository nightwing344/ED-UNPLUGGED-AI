#!/data/data/com.termux/files/usr/bin/bash

QUESTION_TEXT="${*:-}"

DATE=$(date +"%Y%m%d-%H%M%S")

FILE="/storage/emulated/0/ED/Memory/Questions/question-$DATE.md"

cat > "$FILE" <<EOF2
# ED Question

$QUESTION_TEXT

Created:
$DATE

Status:
OPEN

EOF2

echo "Question Stored:"
echo "$FILE"

