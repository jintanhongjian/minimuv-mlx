#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON="$PROJECT_DIR/.venv/bin/python"
STATE_DIR="$HOME/Library/Application Support/MiniMuv"
PID_FILE="$STATE_DIR/server.pid"

if [[ ! -f "$PID_FILE" ]]; then
  echo "No MiniMuv PID file was found. The app may not have been started with start.command."
  read -r -p "Press Enter to close..."
  exit 0
fi

pid="$(<"$PID_FILE")"
if [[ ! "$pid" =~ ^[0-9]+$ ]]; then
  echo "Invalid PID in $PID_FILE; refusing to stop an unverified process."
  read -r -p "Press Enter to close..."
  exit 1
fi

command="$(ps -p "$pid" -o command= 2>/dev/null || true)"
process_dir="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n 1)"
if [[ "$command" != *" -m webapp.server" || "$process_dir" != "$PROJECT_DIR" ]]; then
  if [[ -z "$command" ]]; then
    rm -f "$PID_FILE"
    echo "Removed a stale MiniMuv PID file."
    exit 0
  fi
  echo "PID $pid does not match this project's MiniMuv server; refusing to stop it."
  read -r -p "Press Enter to close..."
  exit 1
fi

kill -TERM "$pid"
for _ in {1..15}; do
  if ! kill -0 "$pid" 2>/dev/null; then
    rm -f "$PID_FILE"
    echo "MiniMuv and its managed H3 service have stopped."
    exit 0
  fi
  sleep 1
done

echo "MiniMuv has not exited yet. Check its log before trying again:"
echo "$STATE_DIR/server.log"
read -r -p "Press Enter to close..."
exit 1
