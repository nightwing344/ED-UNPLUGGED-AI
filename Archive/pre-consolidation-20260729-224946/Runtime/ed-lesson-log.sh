#!/data/data/com.termux/files/usr/bin/bash

LESSON_TEXT="${*:-}"

DATE=$(date +"%Y%m%d-%H%M%S")

FILE="/storage/emulated/0/ED/Memory/Lessons/lesson-$DATE.md"

cat > "$FILE" <<EOF2
# ED Lesson

Date:
$DATE

Lesson:

$LESSON_TEXT

Source:
User interaction

Status:
Stored
EOF2

echo "Lesson Saved:"
echo "$FILE"
