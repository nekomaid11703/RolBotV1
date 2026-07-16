#!/bin/bash
# ============================================================
# healthcheck.sh — Verifica salud del bot en producción
# ============================================================
# Uso: ./scripts/healthcheck.sh
# Exit code: 0 = OK, 1 = ERROR
# ============================================================
set -euo pipefail

REMOTE_DIR="${REMOTE_DIR:-/opt/rolbot}"
BOT_NAME="${BOT_NAME:-rolbot}"

# 1. Verificar PM2 online
if ! pm2 list 2>/dev/null | grep -q "$BOT_NAME.*online"; then
    echo "ERROR: PM2 $BOT_NAME no está online"
    exit 1
fi

# 2. Verificar proceso Node.js vivo
if ! pgrep -f "node index.js" > /dev/null; then
    echo "ERROR: Proceso node index.js no encontrado"
    exit 1
fi

# 3. Verificar memoria (no debe exceder 500 MB)
MEM=$(ps -o rss= -p "$(pgrep -f 'node index.js' | head -1)" 2>/dev/null || echo 0)
if [ "$MEM" -gt 512000 ]; then
    echo "WARNING: Memoria alta: $((MEM / 1024)) MB"
fi

# 4. Verificar uptime
UPTIME=$(pm2 show "$BOT_NAME" 2>/dev/null | grep -i 'uptime' | awk '{print $2,$3,$4,$5}' || echo "desconocido")
echo "OK: $BOT_NAME online, uptime: $UPTIME, memoria: $((MEM / 1024)) MB"

exit 0
