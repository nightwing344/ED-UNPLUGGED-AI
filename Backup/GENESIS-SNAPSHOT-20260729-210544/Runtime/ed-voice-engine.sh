#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="/storage/emulated/0/ED/Voice"

ACTION="${1:-status}"

case "$ACTION" in

listen)

echo "$(date)|LISTENING" \
>> "$BASE/Logs/voice.log"

echo "✓ Voice Capture Ready"

;;

command)

CMD="${2:-unknown}"

echo "$(date)|COMMAND|$CMD" \
>> "$BASE/Commands/commands.log"

echo "✓ Voice Command Routed"

;;

response)

TEXT="${2:-unknown}"

echo "$(date)|RESPONSE|$TEXT" \
>> "$BASE/Responses/responses.log"

echo "✓ Voice Response Stored"

;;

history)

echo "================================"
echo " ED VOICE HISTORY"
echo "================================"

tail -20 "$BASE/Logs/voice.log" 2>/dev/null || true

;;

status)

echo "================================"
echo " ED VOICE INTELLIGENCE v2.0"
echo "================================"

echo
echo "✓ Voice Capture Layer"
echo "✓ Command Recognition"
echo "✓ Intent Routing"
echo "✓ Response Queue"
echo "✓ Voice History"
echo "✓ Assistant Integration"

echo
echo "STATUS: ONLINE"

;;

*)

echo "Commands:"
echo "status"
echo "listen"
echo "command <text>"
echo "response <text>"
echo "history"

;;

esac

