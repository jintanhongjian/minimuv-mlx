#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON="$PROJECT_DIR/.venv/bin/python"
APP_URL="http://127.0.0.1:8765"
STATE_DIR="$HOME/Library/Application Support/MiniMuv"
PID_FILE="$STATE_DIR/server.pid"
LOG_FILE="$STATE_DIR/server.log"

mkdir -p "$STATE_DIR"

if [[ ! -x "$PYTHON" ]]; then
  echo "MiniMuv's virtual environment was not found: $PYTHON"
  echo "Set up the project environment before starting the app."
  read -r -p "Press Enter to close..."
  exit 1
fi

if curl --silent --fail --max-time 2 "$APP_URL/api/settings" | grep -q '"settings"'; then
  echo "MiniMuv is already running at $APP_URL"
  open "$APP_URL"
  exit 0
fi

is_running() {
  local pid="$1"
  [[ "$pid" =~ ^[0-9]+$ ]] || return 1
  local command
  command="$(ps -p "$pid" -o command= 2>/dev/null || true)"
  [[ "$command" == *" -m webapp.server" ]] || return 1
  local process_dir
  process_dir="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n 1)"
  [[ "$process_dir" == "$PROJECT_DIR" ]]
}

if [[ -f "$PID_FILE" ]]; then
  saved_pid="$(<"$PID_FILE")"
  if is_running "$saved_pid"; then
    echo "MiniMuv process $saved_pid exists but the web service is not responding."
    echo "Check the log: $LOG_FILE"
    read -r -p "Press Enter to close..."
    exit 1
  fi
  rm -f "$PID_FILE"
fi

cd "$PROJECT_DIR"
nohup "$PYTHON" -m webapp.server >>"$LOG_FILE" 2>&1 </dev/null &
server_pid=$!
printf '%s\n' "$server_pid" >"$PID_FILE"

for _ in {1..30}; do
  if curl --silent --fail --max-time 2 "$APP_URL/api/settings" | grep -q '"settings"'; then
    echo "MiniMuv is running at $APP_URL"
    echo "Log: $LOG_FILE"
    open "$APP_URL"
    exit 0
  fi
  if ! kill -0 "$server_pid" 2>/dev/null; then
    rm -f "$PID_FILE"
    echo "MiniMuv failed to start. Recent log output:"
    tail -n 30 "$LOG_FILE" 2>/dev/null || true
    read -r -p "Press Enter to close..."
    exit 1
  fi
  sleep 1
done

echo "MiniMuv did not become ready at $APP_URL within 30 seconds."
echo "Check the log: $LOG_FILE"
read -r -p "Press Enter to close..."
exit 1
