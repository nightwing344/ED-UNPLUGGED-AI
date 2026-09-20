#!/data/data/com.termux/files/usr/bin/bash

case "$1" in

adult)
NAME="Adult"
MODE="18_PLUS_MODE"
;;

child)
NAME="Child"
MODE="RESTRICTED_MODE"
;;

default|*)
NAME="Default"
MODE="SAFE_MODE"
;;

esac


cat > /storage/emulated/0/ED/User-Profiles/ACTIVE_PROFILE.txt <<PROFILE
ACTIVE PROFILE:

$NAME

Mode:
$MODE

Rules:
- User requested activation
- No automatic switching
- User retains authority
- No automatic updates
PROFILE

echo "Profile:"
echo "$NAME"
echo "$MODE"
