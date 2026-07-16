#!/bin/bash
# ============================================================
# deploy.sh — Deploy RolBotV1 a Oracle Cloud VM
# ============================================================
# Uso: ./scripts/deploy.sh [--dry-run]
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_USER="${SSH_USER:-rolbot}"
SSH_HOST="${SSH_HOST:?Error: SSH_HOST no definido}"
SSH_PORT="${SSH_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/opt/rolbot}"

echo "=== Deploy RolBotV1 ==="
echo "Target: $SSH_USER@$SSH_HOST:$SSH_PORT"

# 1. Validar pre-requisitos
command -v rsync >/dev/null 2>&1 || { echo "Error: rsync no instalado"; exit 1; }
command -v ssh >/dev/null 2>&1 || { echo "Error: ssh no instalado"; exit 1; }

# 2. Ejecutar validaciones locales
echo "--- Validando calidad local ---"
cd "$SCRIPT_DIR"
npm run lint || { echo "Error: lint falló"; exit 1; }
npm run typecheck || { echo "Error: typecheck falló"; exit 1; }
npm run test:vite || { echo "Error: tests fallaron"; exit 1; }

if [ "${1:-}" = "--dry-run" ]; then
    echo "Dry-run: validaciones locales pasadas. Deploy omitido."
    exit 0
fi

# 3. Rsync del código (excluyendo lo innecesario)
echo "--- Sincronizando código ---"
rsync -avz --delete \
    -e "ssh -p $SSH_PORT" \
    --exclude 'node_modules' \
    --exclude '.env' \
    --exclude '.env.local' \
    --exclude '.env.production' \
    --exclude '.git' \
    --exclude 'graphify-out' \
    --exclude 'tests' \
    --exclude 'logs' \
    --exclude 'bugs' \
    --exclude 'temp' \
    --exclude '*.log' \
    "$SCRIPT_DIR"/ "$SSH_USER@$SSH_HOST:$REMOTE_DIR"/

# 4. Instalar dependencias en remoto
echo "--- Instalando dependencias ---"
ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "cd $REMOTE_DIR && npm ci"

# 5. Asegurar que .env.production existe
echo "--- Verificando .env.production ---"
if ! ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "test -f $REMOTE_DIR/.env.production"; then
    echo "Error: .env.production no existe en remoto. Créalo primero."
    exit 1
fi

# 6. Reiniciar bot con PM2
echo "--- Reiniciando bot ---"
ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "cd $REMOTE_DIR && pm2 start ecosystem.config.js --update-env || pm2 restart rolbot --update-env && pm2 save"

# 7. Verificar status
echo "--- Verificando estado ---"
sleep 3
ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "pm2 status"

echo ""
echo "=== Deploy completado ==="
echo "Logs: ssh -p $SSH_PORT $SSH_USER@$SSH_HOST 'pm2 logs rolbot --lines 20'"
