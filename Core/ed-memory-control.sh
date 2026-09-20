#!/data/data/com.termux/files/usr/bin/bash

CORE=/storage/emulated/0/ED/Core

echo "========================================"
echo " ED Memory Control"
echo "========================================"

echo "1) Start Memory Loop"
echo "2) Stop Memory Loop"
echo "3) Check Memory Status"
echo "4) Exit"

read -p "Select: " CHOICE

case $CHOICE in

1)
"$CORE/ED-Memory-Start.sh"
;;

2)
pkill -f ed-memory-loop.sh 2>/dev/null || true
echo "Memory Loop stopped"
;;

3)
"$CORE/ed-memory-monitor.sh"
;;

4)
exit 0
;;

*)
echo "Invalid option"
;;

esac
