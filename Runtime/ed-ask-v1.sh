#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ED_CORE="${ED_CORE:-$HOME/ED-Core}"
RUNTIME="$ED_CORE/Runtime"
MEMORY="$ED_CORE/Memory"
REPORTS="$ED_CORE/Reports"

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
    echo "Usage: ED ask <question>"
    exit 1
fi

mkdir -p "$REPORTS"

echo "================================"
echo " ED INTELLIGENCE RUNTIME v1"
echo "================================"
echo

# ------------------------------------------------
# MODEL BACKEND
# ------------------------------------------------

if ! command -v ollama >/dev/null 2>&1; then
    echo "ERROR: Ollama is not installed."
    exit 20
fi

if ! ollama list >/dev/null 2>&1; then

    echo "Starting local intelligence backend..."

    nohup ollama serve \
        > "$REPORTS/ollama-runtime.log" \
        2>&1 &

    OLLAMA_PID=$!

    READY=0

    for _ in 1 2 3 4 5 6 7 8 9 10; do
        sleep 1

        if ollama list >/dev/null 2>&1; then
            READY=1
            break
        fi
    done

    if [ "$READY" -ne 1 ]; then
        echo "ERROR: Ollama failed to become ready."
        echo "PID attempted: $OLLAMA_PID"
        echo "Log: $REPORTS/ollama-runtime.log"
        exit 21
    fi
fi

# ------------------------------------------------
# MODEL DISCOVERY
# ------------------------------------------------

MODEL="$(
    ollama list 2>/dev/null |
    awk 'NR > 1 && NF {print $1; exit}'
)"

if [ -z "$MODEL" ]; then
    echo "ERROR: Ollama is running but no local model is installed."
    echo
    echo "A model must be installed before ED can reason locally."
    exit 22
fi

# Prefer ED's known model when installed.
if ollama list 2>/dev/null |
   awk 'NR > 1 {print $1}' |
   grep -Fxq 'llama3.2:3b'; then

    MODEL="llama3.2:3b"
fi

# ------------------------------------------------
# READ-ONLY MEMORY RETRIEVAL
# ------------------------------------------------

MEMORY_CONTEXT="No relevant persistent memory was found."

if [ -d "$MEMORY" ]; then

    MATCHES="$(
        grep -RilF \
            --exclude='*.log' \
            --exclude='memory-links.graph' \
            "$REQUEST" \
            "$MEMORY" \
            2>/dev/null |
        head -3 || true
    )"

    if [ -n "$MATCHES" ]; then

        MEMORY_CONTEXT=""

        while IFS= read -r FILE; do
            [ -f "$FILE" ] || continue

            CONTENT="$(
                head -40 "$FILE" 2>/dev/null || true
            )"

            MEMORY_CONTEXT="${MEMORY_CONTEXT}
--- MEMORY SOURCE ---
$CONTENT
"

        done <<< "$MATCHES"
    fi
fi

# ------------------------------------------------
# IDENTITY
# ------------------------------------------------

IDENTITY="You are ED (ED Unplugged AI), an operating intelligence assistant.

You are not merely a command dispatcher.

Your job is to understand the user's request, reason about it, use relevant supplied memory when useful, and give a direct useful response.

Core rules:
- Never claim an action occurred unless it actually occurred.
- Never claim a subsystem is working merely because its file exists.
- Distinguish real execution from planned capability.
- User retains authority over destructive or persistent changes.
- Do not silently write memory.
- Do not invent memories.
- If supplied memory is irrelevant, ignore it.
- Be concise but useful.
- Respond to the user's actual request rather than describing the architecture."

PROMPT="$IDENTITY

PERSISTENT MEMORY CONTEXT:
$MEMORY_CONTEXT

USER REQUEST:
$REQUEST

ED RESPONSE:"

# ------------------------------------------------
# REAL INFERENCE
# ------------------------------------------------

echo "Backend: Ollama"
echo "Model:   $MODEL"
echo "Memory:  read-only"
echo
echo "ED RESPONSE:"
echo

RESPONSE="$(
    MODEL="$MODEL" PROMPT="$PROMPT" python - <<'PYAPI'
import json, os, urllib.request
data=json.dumps({
    "model": os.environ["MODEL"],
    "prompt": os.environ["PROMPT"],
    "stream": False
}).encode()
req=urllib.request.Request(
    "http://127.0.0.1:11434/api/generate",
    data=data,
    headers={"Content-Type":"application/json"}
)
with urllib.request.urlopen(req, timeout=120) as r:
    print(json.load(r).get("response",""))
PYAPI
)"
RC=$?

if [ "$RC" -ne 0 ] || [ -z "$RESPONSE" ]; then
    echo "ERROR: Model inference failed."
    echo "$RESPONSE"
    exit 23
fi

printf '%s\n' "$RESPONSE"

echo
echo "================================"
echo " RESPONSE COMPLETE"
echo "================================"
