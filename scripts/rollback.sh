#!/bin/bash
# ============================================================
# rollback.sh — Rollback del último deploy de RolBotV1
# ============================================================
# Uso: ./scripts/rollback.sh [--hard]
#   --hard: revierte al commit anterior (git revert HEAD)
#   sin flags: solo reinicia PM2 con la versión actual
# ============================================================
set -euo pipefail

REMOTE_DIR="${REMOTE_DIR:-/opt/rolbot}"
SSH_USER="${SSH_USER:-rolbot}"
SSH_HOST="${SSH_HOST:?Error: SSH_HOST no definido}"
SSH_PORT="${SSH_PORT:-22}"

echo "=== Rollback RolBotV1 ==="

if [ "${1:-}" = "--hard" ]; then
    echo "--- Revirtiendo al commit anterior (git revert HEAD) ---"
    ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "cd $REMOTE_DIR && git revert HEAD --no-edit"
    echo "--- Reinstalando dependencias ---"
    ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "cd $REMOTE_DIR && npm ci"
fi

echo "--- Reiniciando PM2 ---"
ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "cd $REMOTE_DIR && pm2 restart rolbot && pm2 save"

echo "--- Verificando estado ---"
sleep 3
ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "pm2 status"

echo ""
echo "=== Rollback completado ==="
echo "Logs: ssh -p $SSH_PORT $SSH_USER@$SSH_HOST 'pm2 logs rolbot --lines 20'"
