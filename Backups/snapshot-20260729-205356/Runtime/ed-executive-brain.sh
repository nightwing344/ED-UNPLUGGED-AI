#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

MODEL="llama3.2:3b"
RUNTIME="$HOME/ED-Core/Runtime"
REQUEST="$*"

if [ -z "$REQUEST" ]; then
    echo "ED Executive Brain waiting for command."
    exit 0
fi

echo "================================"
echo " ED EXECUTIVE BRAIN v2.0"
echo "================================"
echo
echo "Analyzing request..."
echo

PROMPT='
You are ED Executive Brain.

Choose the correct ED engine.

Prioritize exact intent:

mission = create/build/start a new project or mission
simulation = model, test, compare, forecast, economic simulations
security = audits, permissions, vulnerabilities, trust
personal = priorities, daily planning, personal dashboard
memory = remember, store, recall information
goal = objectives and targets
planning = workflows and task breakdowns

Valid engines ONLY:

memory
knowledge
planning
goal
mission
simulation
security
automation
agents
personal
voice
assistant

Rules:
- Return JSON only.
- No markdown.
- No explanations outside JSON.

Format:

{
 "engine":"name",
 "confidence":0.0,
 "reason":"short explanation"
}

User request:

'"$REQUEST"'
'

RESULT=$(ollama run "$MODEL" "$PROMPT" 2>/dev/null || true)

echo "$RESULT"

ENGINE=$(echo "$RESULT" | sed -n 's/.*"engine"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

echo
echo "Selected engine: $ENGINE"

case "$ENGINE" in

memory)
exec "$RUNTIME/ed-memory-intelligence.sh" "$REQUEST"
;;

knowledge)
exec "$RUNTIME/ed-knowledge-engine.sh" "$REQUEST"
;;

planning)
exec "$RUNTIME/ed-workflow-engine.sh" "$REQUEST"
;;

goal)
exec "$RUNTIME/ed-goal-engine.sh" "$REQUEST"
;;

mission)
exec "$RUNTIME/ed-mission-engine.sh" "$REQUEST"
;;

simulation)
exec "$RUNTIME/ed-simulation-engine.sh" "$REQUEST"
;;

security)
exec "$RUNTIME/ed-security-manager.sh" "$REQUEST"
;;

automation)
exec "$RUNTIME/ed-automation-engine.sh" "$REQUEST"
;;

agents)
exec "$RUNTIME/ed-agent-manager.sh" "$REQUEST"
;;

personal)
exec "$RUNTIME/ed-personal-os.sh" "$REQUEST"
;;

voice)
exec "$RUNTIME/ed-voice-engine.sh" "$REQUEST"
;;

assistant)
exec "$RUNTIME/ed-assistant-loop.sh" review
;;

*)
echo
echo "No valid engine selected."
echo "Sending to Assistant fallback."
exec "$RUNTIME/ed-assistant-loop.sh" review
;;

esac

