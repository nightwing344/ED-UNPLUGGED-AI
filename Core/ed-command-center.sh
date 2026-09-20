#!/data/data/com.termux/files/usr/bin/bash

echo "========================================"
echo "        ED COMMAND CENTER"
echo "========================================"

while true
do

echo
echo "1) Preflight Check"
echo "2) Health Check"
echo "3) Recovery Check"
echo "4) Local Brain Check"
echo "5) Snapshot Check"
echo "6) Exit"
echo

read -p "Select option: " CHOICE

case $CHOICE in

1)
~/ed-preflight-check.sh
;;

2)
~/ed-health-check.sh
;;

3)
/storage/emulated/0/ED/Core/ed-recovery-check.sh
;;

4)
/storage/emulated/0/ED/Core/ed-local-brain-check.sh
;;

5)
~/ED-Build/Snapshot-Latest.sh
;;

6)
echo "Exiting ED Command Center"
exit 0
;;

*)
echo "Invalid option"
;;

esac

done
