#!/usr/bin/env bash
# PostToolUse hook: lint any TS/TSX file the AI just edited, and feed failures back to it.
set -euo pipefail

file=$(jq -r '.tool_input.file_path // empty')
case "$file" in
  *.ts | *.tsx) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

cd "$CLAUDE_PROJECT_DIR"
if ! output=$(npx oxlint --deny-warnings "$file" 2>&1); then
  echo "oxlint failed for $file:" >&2
  echo "$output" >&2
  exit 2 # exit code 2 surfaces stderr to Claude so it fixes the issue
fi
