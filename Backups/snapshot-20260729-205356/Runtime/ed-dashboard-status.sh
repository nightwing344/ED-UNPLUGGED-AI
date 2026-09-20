#!/data/data/com.termux/files/usr/bin/bash

DATA="/storage/emulated/0/ED/Interfaces/Dashboard/Data/dashboard-status.json"

echo "================================"
echo " ED DASHBOARD STATUS"
echo "================================"

if [ -f "$DATA" ]; then
    cat "$DATA"
else
    echo "Dashboard data unavailable"
fi

