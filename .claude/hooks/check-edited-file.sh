#!/usr/bin/env bash
# PostToolUse hook: check any file the AI just edited, and feed failures back to it.
#   - TS/TSX: oxlint
#   - tokens/*.json: rebuild tokens.css, then run the contrast and token-usage checks
set -euo pipefail

file=$(jq -r '.tool_input.file_path // empty')
[ -f "$file" ] || exit 0
cd "$CLAUDE_PROJECT_DIR"

fail() {
  echo "$1" >&2
  echo "$2" >&2
  exit 2 # exit code 2 surfaces stderr to Claude so it fixes the issue
}

case "$file" in
  *.ts | *.tsx)
    output=$(npx oxlint --deny-warnings "$file" 2>&1) || fail "oxlint failed for $file:" "$output"
    ;;
  */tokens/*.json)
    output=$(npm run --silent tokens:build 2>&1 && npm run --silent tokens:check 2>&1) ||
      fail "Design token checks failed after editing $file:" "$output"
    ;;
esac
