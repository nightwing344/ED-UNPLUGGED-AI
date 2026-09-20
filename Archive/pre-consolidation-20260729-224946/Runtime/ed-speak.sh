#!/data/data/com.termux/files/usr/bin/bash

TEXT="${*:-}"

if [ -z "$TEXT" ]; then
echo "Nothing to speak"
exit 1
fi

echo
echo "ED:"
echo "$TEXT"

# Android text-to-speech bridge
termux-tts-speak "$TEXT" 2>/dev/null || true

