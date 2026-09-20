#!/data/data/com.termux/files/usr/bin/bash

cat > /storage/emulated/0/ED/User-Profiles/ACTIVE_PROFILE.txt <<'PROFILE'
ACTIVE PROFILE:

Default

Mode:
SAFE_MODE

Rules:
- Start safe by default
- User approval required
- No automatic updates
- User retains authority
PROFILE

echo "Profile reset complete."
