#!/data/data/com.termux/files/usr/bin/bash

BASE=/storage/emulated/0/ED/Core

echo "========================================"
echo " ED Core Modules"
echo "========================================"

echo "1) Recovery Manager"
echo "2) Reset Mode"
echo "3) Governance Check"
echo "4) Memory Check"
echo "5) Security Check"
echo "6) Skill Manager"
echo "7) Project Manager"
echo "8) Exit"

read -p "Select: " OPTION

case $OPTION in

1)
"$BASE/ed-recovery-manager.sh"
;;

2)
"$BASE/ed-reset-mode.sh"
;;

3)
"$BASE/ed-governance-check.sh"
;;

4)
"$BASE/ed-memory-check.sh"
;;

5)
"$BASE/ed-security-check.sh"
;;

6)
"$BASE/ed-skill-manager.sh"
;;

7)
"$BASE/ed-project-manager.sh"
;;

8)
exit 0
;;

*)
echo "Invalid option"
;;

esac
