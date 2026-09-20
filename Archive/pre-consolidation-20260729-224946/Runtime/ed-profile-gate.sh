#!/data/data/com.termux/files/usr/bin/bash

PROFILE="/storage/emulated/0/ED/User-Profiles/ACTIVE_PROFILE.txt"

echo
echo "--- ED PROFILE CHECK ---"

if [ -f "$PROFILE" ]; then
    cat "$PROFILE"
else
    echo "No profile found."
    echo "Using SAFE_MODE default."
fi

echo "--- PROFILE CHECK COMPLETE ---"
echo
