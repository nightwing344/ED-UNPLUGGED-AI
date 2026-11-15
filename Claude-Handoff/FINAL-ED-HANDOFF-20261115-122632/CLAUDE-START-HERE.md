# ED UNPLUGGED AI: COMPLETE PROJECT HANDOFF

Handoff date: 2026-11-15T12:26:32-06:00

## Project identity
Repository: https://github.com/nightwing344/ED-UNPLUGGED-AI
Local repository: /data/data/com.termux/files/home/ED-GITHUB-COMPARE
Branch: ed-v1.1-memory
Recorded HEAD: 4af0b83e381c6e0f3b7bcd542e62123b8a6c0d56

## Read these first
1. CLAUDE-CHAT-BRIEF.md
2. CLAUDE-CODE-IMPORT.md
3. ED-HANDOFF-MANIFEST.txt
4. LOCAL-WORKTREE-STATUS.txt
5. LOCAL-CHANGED-FILES.txt
6. LOCAL-UNTRACKED-FILES.txt
7. LOCAL-DIFF-STAT.txt
8. DELTA-MANIFEST.json
9. EXCLUDED-FILES.tsv
10. VERIFICATION-RESULTS.txt

## Three source packages

A. ED CORE:
/storage/emulated/0/ED/Exports/ED-CORE-20261115-114842.zip
Split parts and checksums are in:
/storage/emulated/0/ED/Claude-Handoff/20261115-121614

B. ED ARCHIVE:
/storage/emulated/0/ED/Exports/ED-ARCHIVE-20261115-114842.zip
Split parts and checksums are in:
/storage/emulated/0/ED/Claude-Handoff/20261115-121614

C. LOCAL CHANGES:
/storage/emulated/0/ED/Claude-Handoff/LOCAL-DELTA-20261115-122027/ED-LOCAL-CHANGES.zip
Split part and checksums are in:
/storage/emulated/0/ED/Claude-Handoff/LOCAL-DELTA-20261115-122027

Do not treat the GitHub branch alone as the complete project.
The local working tree contains uncommitted and untracked material.
Preserve all source paths and distinguish tracked, modified, and untracked files.

## Environment configuration
This handoff includes a sanitized .env.example.
The three original environment templates were identical by SHA-256.
Their original values were not displayed or copied into this handoff.
Never request or expose real API keys.

## Safety and project rules
- Preserve the supplied source before proposing changes.
- Do not delete, reset, overwrite, or clean project files.
- Do not push, pull, or commit without explicit authorization.
- Do not silently introduce cloud fallback when local-only behavior is required.
- Identify assumptions and distinguish verified facts from inferences.
- Inspect the local delta and exclusions before declaring the handoff complete.
- Reconstruct split archives and verify hashes before extraction.
- Do not execute unknown scripts merely because they are included.
- Treat backups and checkpoints as historical evidence, not necessarily current production.

## Expected first response from Claude
1. Confirm receipt of all three source packages.
2. Verify every uploaded part against the provided SHA-256 manifests.
3. Reconstruct and verify ED CORE, ED ARCHIVE, and LOCAL DELTA.
4. Inventory the combined source tree without modifying it.
5. Identify duplicate files, conflicting versions, missing dependencies,
   secrets risks, and the authoritative runtime entry points.
6. Produce a complete project map and current-state assessment.
7. Ask before any production edits or Git operations.
