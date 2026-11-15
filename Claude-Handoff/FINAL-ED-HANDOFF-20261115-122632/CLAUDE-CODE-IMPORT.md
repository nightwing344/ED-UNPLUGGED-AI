# ED Claude Code Import Instructions

## Repository
https://github.com/nightwing344/ED-UNPLUGGED-AI

## Package reconstruction
Run these commands in the directory containing the numbered parts:

cat ED-CORE.part-* > ED-CORE-REBUILT.zip
cat ED-ARCHIVE.part-* > ED-ARCHIVE-REBUILT.zip

Then verify:
sha256sum ED-CORE-REBUILT.zip ED-ARCHIVE-REBUILT.zip

Compare the results against ORIGINAL-SHA256SUMS.txt.
Do not extract over an existing project directory. Extract into new,
separate inspection directories first.

## Package contents
- ED-CORE-FILE-LIST.txt
- ED-ARCHIVE-FILE-LIST.txt

## Local Git changes
The local working tree had changes at handoff time.
Review the supplied status and file manifests before modifying anything.
The ZIP packages and Git repository must be compared, not assumed identical.

## Safety
Do not delete, reset, overwrite, commit, or push without explicit approval.
Do not expose credentials or secrets in reports or uploads.
