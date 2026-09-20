#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="/storage/emulated/0/ED/PersonalOS"

ACTION="${1:-status}"

case "$ACTION" in

priority)

ITEM="${2:-unknown}"

echo "$(date)|PRIORITY|$ITEM" \
>> "$BASE/Priorities/priorities.log"

echo "✓ Priority Added"

;;

project)

NAME="${2:-unknown}"

ID="PROJECT-$(date +%Y%m%d-%H%M%S)"

cat > "$BASE/Projects/$ID.txt" <<EOF2
ED PROJECT

ID:
$ID

NAME:
$NAME

STATUS:
ACTIVE

CREATED:
$(date)

EOF2

echo "✓ Project Created"
echo "$ID"

;;

routine)

NAME="${2:-unknown}"

echo "$(date)|ROUTINE|$NAME" \
>> "$BASE/Routines/routines.log"

echo "✓ Routine Added"

;;

daily)

NOTE="${2:-unknown}"

echo "$(date)|DAILY|$NOTE" \
>> "$BASE/Daily/daily.log"

echo "✓ Daily Log Updated"

;;

overview)

echo "================================"
echo " ED PERSONAL OVERVIEW"
echo "================================"

echo
echo "PRIORITIES:"
cat "$BASE/Priorities/priorities.log" 2>/dev/null || true

echo
echo "PROJECTS:"
find "$BASE/Projects" -type f 2>/dev/null \
| sed 's#.*/##'

echo
echo "ROUTINES:"
cat "$BASE/Routines/routines.log" 2>/dev/null || true

;;

status)

echo "================================"
echo " ED PERSONAL OS v1.0"
echo "================================"

echo
echo "✓ Personal Dashboard"
echo "✓ Priority System"
echo "✓ Project Tracking"
echo "✓ Routine Engine"
echo "✓ Daily Log"
echo "✓ Mission Integration"
echo "✓ Learning Integration"

echo
echo "STATUS: ONLINE"

;;

*)

echo "Commands:"
echo "status"
echo "priority <item>"
echo "project <name>"
echo "routine <name>"
echo "daily <note>"
echo "overview"

;;

esac

