#!/data/data/com.termux/files/usr/bin/bash

BASE=/storage/emulated/0/ED

echo "========================================"
echo " ED RESET MODE"
echo "========================================"

echo "1) Soft Reset"
echo "2) Workspace Repair"
echo "3) Identity Repair"
echo "4) Snapshot Recovery"
echo "5) Exit"

read -p "Select: " CHOICE

DATE=$(date +%Y%m%d-%H%M)

case $CHOICE in

1)
echo "Soft Reset"
pkill -f "openclaw gateway" 2>/dev/null || true
nohup openclaw gateway run > ~/openclaw-gateway.log 2>&1 &
echo "$DATE Soft Reset" >> "$BASE/Core/RESET_LOG.txt"
;;

2)
echo "Workspace Repair"
mkdir -p "$BASE"/{Core,Memory,Skills,Projects,Logs,Backups,Snapshots}
echo "$DATE Workspace Repair" >> "$BASE/Core/RESET_LOG.txt"
;;

3)
echo "Identity Repair"
echo "Restore identity files manually from ED-Build"
echo "$DATE Identity Repair" >> "$BASE/Core/RESET_LOG.txt"
;;

4)
echo "Snapshot Recovery"
LATEST=$(ls -t "$BASE"/Snapshots/*.tar.gz 2>/dev/null | head -1)

if [ -n "$LATEST" ]; then
echo "Latest snapshot:"
echo "$LATEST"
else
echo "No snapshot found"
fi

;;

5)
exit 0
;;

*)
echo "Invalid choice"
;;

esac

echo
echo "Reset Complete"
