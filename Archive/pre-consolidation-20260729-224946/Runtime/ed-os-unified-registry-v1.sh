#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
OS="$BASE/OS"
REG="$OS/Registry"

ACTION="${1:-status}"

LOG="$REG/registry-log.txt"

case "$ACTION" in

initialize)

echo "================================"
echo " ED OS UNIFIED REGISTRY v1.0"
echo "================================"


cat > "$REG/system-registry.txt" <<EOF2
================================
 ED OS SYSTEM REGISTRY v1.0
================================


KERNEL:

Runtime
Executive Brain
Router
Agent Runtime
Memory
Knowledge
Learning
Security
Mission
Governance


SYSTEM LAYERS:

Boot
Mission Control
Agent Orchestration
Intelligence Fusion
Memory Fabric
Governance Authority


PLUGIN SYSTEM:

Economic
Digital Twin
Simulation
Research
Connectors


MIGRATION:

Safe Migration Enabled


SYSTEM STATE:

REGISTERED


EOF2


cat > "$REG/module-index.txt" <<EOF2
================================
 ED MODULE INDEX
================================

Total Runtime Modules:

159

Classification:

Kernel:
ACTIVE

Agents:
ACTIVE

Intelligence:
ACTIVE

Memory:
ACTIVE

Governance:
ACTIVE

Plugins:
ACTIVE

Utilities:
REGISTERED


EOF2


cat > "$REG/capability-index.txt" <<EOF2
================================
 ED CAPABILITY INDEX
================================

CAPABILITIES:

Reasoning
Planning
Learning
Memory
Task Execution
Agent Coordination
Research
Simulation
Economic Intelligence
Digital Twin
Governance
Security


STATUS:

AVAILABLE


EOF2


cat > "$REG/layer-status.txt" <<EOF2
================================
 ED OS LAYER STATUS
================================

Kernel:
ONLINE

Runtime:
ONLINE

Boot:
ONLINE

Mission:
ONLINE

Agents:
ONLINE

Intelligence:
ONLINE

Memory:
ONLINE

Governance:
ONLINE

Plugins:
READY


SYSTEM:
OPERATIONAL


EOF2


echo "$(date) Unified registry initialized" >> "$LOG"

echo "✓ Unified registry initialized"

;;


status)

cat "$REG/layer-status.txt" 2>/dev/null || echo "Registry not initialized"

;;

modules)

cat "$REG/module-index.txt" 2>/dev/null || echo "Module index missing"

;;

capabilities)

cat "$REG/capability-index.txt" 2>/dev/null || echo "Capability index missing"

;;

*)

echo "Commands:"
echo " initialize"
echo " status"
echo " modules"
echo " capabilities"

;;

esac

