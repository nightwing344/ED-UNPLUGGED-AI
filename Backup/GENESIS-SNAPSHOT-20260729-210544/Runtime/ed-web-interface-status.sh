#!/data/data/com.termux/files/usr/bin/bash

WEB="/storage/emulated/0/ED/Interfaces/Web"

echo "================================"
echo " ED WEB INTERFACE STATUS"
echo "================================"

if [ -f "$WEB/index.html" ]; then
echo "✓ Web Interface Installed"
else
echo "⚠ Missing"
fi

echo
echo "Location:"
echo "$WEB/index.html"

