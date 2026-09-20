#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/Interface/Web"

STATE="$HOME/.ed/runtime"
LOG="$STATE/web-server.log"
PID="$STATE/web-server.pid"

URL="http://127.0.0.1:3000"
HEALTH="$URL/api/health"

mkdir -p "$STATE"

health() {
  curl -fsS --max-time 3 "$HEALTH" 2>/dev/null
}

echo "ED WEB START"
echo "============"

if RESPONSE="$(health)"; then
  echo "✓ ED backend already online"
  echo "$RESPONSE"
  echo "URL: $URL"
  exit 0
fi

if [ ! -f "$WEB/dist/server.cjs" ]; then
  echo "❌ Missing production server:"
  echo "$WEB/dist/server.cjs"
  echo "Run the ED web build first."
  exit 1
fi

echo "Starting ED backend..."

cd "$WEB"

nohup env NODE_ENV=production \
  node dist/server.cjs >> "$LOG" 2>&1 &

PID_VALUE=$!
echo "$PID_VALUE" > "$PID"

for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  sleep 1

  if RESPONSE="$(health)"; then
    echo "✓ ED backend online"
    echo "$RESPONSE"
    echo "PID: $PID_VALUE"
    echo "URL: $URL"
    exit 0
  fi

  if ! kill -0 "$PID_VALUE" 2>/dev/null; then
    echo "❌ ED backend exited during startup"
    echo
    echo "--- SERVER LOG ---"
    tail -50 "$LOG" 2>/dev/null || true
    exit 1
  fi
done

echo "❌ ED backend did not answer health check"
echo
echo "--- SERVER LOG ---"
tail -50 "$LOG" 2>/dev/null || true
exit 1
