# Checklist — Deploy Oracle Cloud 24/7

> **Regla de oro:** No avanzar al punto N+1 hasta que N esté implementado, verificado y marcado [X].
> **Estados:** `[ ]` Pendiente · `[X]` Completado · `[-]` Saltado · `[!]` Bloqueado
> **Roles:** @Arquitecto · @Coder · @Validador

---

## Fase 0 — Fundación (Preparación Local)

### F0.1 — Auditar stateless readiness @Arquitecto
- [ ] Verificar que `supabaseAuthState.js` persiste sesión sin archivos locales
- [ ] Verificar que `bot.js` no tiene rutas absolutas ni dependencias de filesystem local
- [ ] Verificar que `loadCommands()` funciona desde cualquier CWD
- [ ] Confirmar que `pino` logs van a stdout (no archivos locales) en producción
- [ ] Verificar dashboard no depende de interfaz gráfica
- [ ] Registrar hallazgos en nekomemori

### F0.2 — Verificar compatibilidad ARM64 @Arquitecto
- [ ] `@whiskeysockets/baileys` — pure JS, compatible
- [ ] `@supabase/supabase-js` — pure JS, compatible
- [ ] `pino` — pure JS, compatible
- [ ] `qrcode-terminal` — pure JS, compatible
- [ ] `dotenv` — pure JS, compatible
- [ ] `pm2` — tiene binario ARM64
- [ ] `sharp` (si se usa) — requiere rebuild para ARM64

### F0.3 — Crear Dockerfile @Coder
- [ ] Base: `node:22-slim` (ARM64 compatible)
- [ ] WORKDIR /app
- [ ] COPY package*.json + npm ci
- [ ] COPY src/ + index.js + .env.production
- [ ] CMD ["node", "index.js"]
- [ ] HEALTHCHECK opcional
- [ ] .dockerignore (node_modules, .git, tests, graphify-out)

### F0.4 — Crear ecosystem.config.js @Coder
- [ ] name: "rolbot"
- [ ] script: "index.js"
- [ ] instances: 1 (no cluster, Baileys no soporta multi-instancia)
- [ ] autorestart: true
- [ ] max_memory_restart: "500M"
- [ ] restart_delay: 5000
- [ ] env: NODE_ENV=production

### F0.5 — Crear scripts/deploy.sh @Coder
- [ ] Validar pre-requisitos (ssh, rsync, node -v)
- [ ] rsync del código a VM (excluyendo node_modules, .env, tests)
- [ ] npm ci en remoto
- [ ] Copiar .env.production
- [ ] pm2 restart rolbot (o start si primera vez)
- [ ] pm2 save
- [ ] Verificar status post-deploy

### F0.6 — Crear .env.production.template @Coder
- [ ] SUPABASE_URL=
- [ ] SUPABASE_KEY=
- [ ] OWNER_PHONE=
- [ ] OWNER_ALIASES=
- [ ] NODE_ENV=production
- [ ] CONNECT_TIMEOUT_MS=120000
- [ ] QUERY_TIMEOUT_MS=90000
- [ ] MAX_RECONNECT_ATTEMPTS=50

### F0.7 — Validar cambios @Validador
- [ ] `npm run lint` — 0 errores
- [ ] `npm run typecheck` — 0 errores
- [ ] `npm run test:vite` — Todos verdes
- [ ] `node scripts/force_sync.js --verify-only` — OK
- [ ] Registrar en nekomemori

---

## Fase 1 — Provisionamiento Oracle Cloud

### F1.1 — Crear cuenta Oracle Cloud @Arquitecto
- [ ] Ir a cloud.oracle.com
- [ ] Registrarse con email válido
- [ ] Verificar identidad con tarjeta de crédito (no cobra)
- [ ] Confirmar home region (no se puede cambiar después)
- [ ] Verificar Always Free resources disponibles

### F1.2 — Configurar presupuesto y alertas @Arquitecto
- [ ] Ir a Billing > Cost Management > Budgets
- [ ] Crear budget de $0 para Always Free
- [ ] Configurar alerta de email si supera $0
- [ ] Revisar Usage Reports semanalmente (opcional)

### F1.3 — Generar par de llaves SSH @Arquitecto
- [ ] `ssh-keygen -t ed25519 -f ~/.ssh/oracle_rolbot`
- [ ] Guardar pública (oracle_rolbot.pub) para launch VM
- [ ] Guardar privada en lugar seguro (~/.ssh/oracle_rolbot)

### F1.4 — Lanzar instancia VM @Arquitecto
- [ ] Compute > Instances > Create Instance
- [ ] Name: rolbot-v1
- [ ] Image: Ubuntu 24.04 (ARM64)
- [ ] Shape: VM.Standard.A1.Flex
- [ ] OCPUs: 2, Memory: 12 GB
- [ ] Boot volume: 50 GB
- [ ] SSH key: pegar oracle_rolbot.pub
- [ ] Si sale "Out of capacity":
  - [ ] Intentar otro Availability Domain
  - [ ] Reducir a 1 OCPU / 6 GB primero
  - [ ] Usar script de retry automático
  - [ ] Probar región diferente (singapore, hyderabad, tokio)

### F1.5 — Configurar security list @Coder
- [ ] VCN > Security List > Add Ingress Rules
- [ ] Solo puerto 22 desde tu IP fixa (CIDR: /32)
- [ ] Eliminar regla 0.0.0.0/0 para puerto 22
- [ ] NO abrir puertos HTTP/HTTPS (se usará Cloudflare Tunnel)

### F1.6 — Verificar conexión SSH @Validador
- [ ] `ssh -i ~/.ssh/oracle_rolbot ubuntu@<IP_PUBLICA>`
- [ ] `uname -m` → debe mostrar `aarch64`
- [ ] `cat /etc/os-release` → Ubuntu 24.04
- [ ] `free -h` → ~12 GB RAM
- [ ] `df -h` → ~50 GB boot volume
- [ Registrar en nekomemori

---

## Fase 2 — Setup del Servidor

### F2.1 — Hardening básico @Arquitecto
- [ ] Cambiar puerto SSH a >1024 no estándar (ej: 2222)
- [ ] Configurar UFW:
  - [ ] ufw allow <PUERTO_SSH>/tcp
  - [ ] ufw default deny incoming
  - [ ] ufw default allow outgoing
  - [ ] ufw enable
- [ ] Instalar fail2ban: `apt install fail2ban`
  - [ ] Configurar jail.local para puerto SSH custom
- [ ] Configurar auto-updates: `apt install unattended-upgrades`
- [ ] `dpkg-reconfigure unattended-upgrades` → habilitar
- [ ] Configurar Hostname: `hostnamectl set-hostname rolbot-v1`
- [ ] Crear usuario 'rolbot': `adduser rolbot`
- [ ] Dar sudo al usuario: `usermod -aG sudo rolbot`
- [ ] Configurar SSH key para usuario rolbot
- [ ] Deshabilitar login root via SSH
- [ ] Verificar `journalctl` logs funcionando

### F2.2 — Instalar Node.js 22+ @Coder
- [ ] `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -`
- [ ] `sudo apt install -y nodejs`
- [ ] `node -v` → v22.x.x
- [ ] `npm -v` → 10.x.x

### F2.3 — Instalar PM2 global @Coder
- [ ] `sudo npm install -g pm2`
- [ ] `pm2 -v` → versión correcta

### F2.4 — Configurar PM2 startup @Coder
- [ ] `pm2 startup` → seguir instrucciones (genera systemd unit)
- [ ] Verificar con `systemctl status pm2-rolbot` (o similar)

### F2.5 — Clonar repositorio @Coder
- [ ] `sudo mkdir -p /opt/rolbot`
- [ ] `sudo chown rolbot:rolbot /opt/rolbot`
- [ ] `su - rolbot`
- [ ] `git clone https://github.com/nekomaid11703/RolBotV1.git /opt/rolbot`

### F2.6 — Crear usuario no-root rolbot @Coder
- [ ] Verificado en F2.1
- [ ] Asegurar que puede ejecutar pm2 sin sudo

### F2.7 — Instalación limpia de dependencias @Coder
- [ ] `cd /opt/rolbot`
- [ ] `npm ci` (no npm install, usa package-lock.json)
- [ ] Verificar que node_modules tiene todas las dependencias

### F2.8 — Configurar .env.production @Coder
- [ ] Copiar `.env.production.template` a `.env.production`
- [ ] Rellenar SUPABASE_URL, SUPABASE_KEY reales
- [ ] Rellenar OWNER_PHONE
- [ ] `chmod 600 .env.production`
- [ ] Verificar que `.env.production` está en `.gitignore`

### F2.9 — Dry-run de inicio @Validador
- [ ] `cd /opt/rolbot && node index.js --dry-run` (si existe flag)
- [ ] O iniciar manualmente y matar tras ver QR/pairing code
- [ ] Verificar que logs no tienen errores de importación
- [ ] Verificar conexión a Supabase exitosa
- [ ] Registrar en nekomemori

---

## Fase 3 — Vinculación WhatsApp

### F3.1 — Iniciar con pairing code @Coder
- [ ] `cd /opt/rolbot && node index.js code`
- [ ] Esperar a que aparezca "Pairing code: XXX-XXX"
- [ ] Si no aparece en 30s, verificar logs

### F3.2 — Vincular número WhatsApp @Coder
- [ ] Abrir WhatsApp > 3 puntos > Dispositivos vinculados
- [ ] Seleccionar "Vincular un dispositivo"
- [ ] Ingresar pairing code de 8 dígitos
- [ ] Confirmar vinculación exitosa en teléfono

### F3.3 — Verificar persistencia de sesión @Validador
- [ ] Detener bot con Ctrl+C
- [ ] Iniciar de nuevo: `node index.js`
- [ ] Debe conectar SIN escanear QR (usa sesión guardada en Supabase)
- [ ] Verificar tabla `bot_auth_state` en Supabase tiene datos

### F3.4 — Iniciar con PM2 @Coder
- [ ] `cd /opt/rolbot`
- [ ] `pm2 start ecosystem.config.js`
- [ ] `pm2 save`
- [ ] `pm2 status` → online

### F3.5 — Verificar reconexión automática @Validador
- [ ] Matar proceso: `pm2 kill`
- [ ] Esperar restart automático (PM2 con autorestart)
- [ ] Verificar que vuelve a online sin intervención
- [ ] Desconectar internet de VM: `sudo ufw reject out`
- [ ] Reconectar: `sudo ufw default allow outgoing`
- [ ] Verificar reconexión a WhatsApp

### F3.6 — Verificar watchdog interno @Validador
- [ ] Revisar código de watchdog en bot.js:
  - [ ] Reconexión exponencial hasta 50 intentos
  - [ ] Delay máximo 60s
  - [ ] Detección de loggedOut → limpia sesión
  - [ ] Detección de restartRequired → reconecta
- [ ] Verificar logs de watchdog funcionando
- [ ] Registrar en nekomemori

---

## Fase 4 — Seguridad y Monitoreo

### F4.1 — Cloudflare Tunnel @Arquitecto
- [ ] Crear cuenta Cloudflare (free)
- [ ] Agregar dominio (o usar subdominio .cf)
- [ ] Instalar cloudflared en VM
- [ ] `cloudflared tunnel create rolbot`
- [ ] Configurar tunnel para dashboard (puerto interno dashboard)
- [ ] Configurar DNS CNAME apuntando al tunnel
- [ ] Verificar tunnel funcionando: `cloudflared tunnel list`
- [ ] Configurar tunnel como systemd service
- [ ] **No abrir puertos HTTP en security list de Oracle**

### F4.2 — Rotación de logs @Arquitecto
- [ ] Configurar logrotate para PM2:
- [ ] `/etc/logrotate.d/pm2-rolbot` con rotación semanal
- [ ] Configurar journald: `SystemMaxUse=500M` en `/etc/systemd/journald.conf`
- [ ] Verificar logs no llenan disco

### F4.3 — Backup de sesión WhatsApp @Arquitecto
- [ ] Confirmar que bot_auth_state está en Supabase (ya cloud)
- [ ] Supabase Point-in-Time Recovery no disponible en free tier
- [ ] Alternativa: snapshot periódico de tabla via script
- [ ] Documentar cómo restaurar sesión desde Supabase

### F4.4 — Uptime monitoring @Coder
- [ ] Configurar Cloudflare Notifications > uptime alerts
- [ ] Configurar healthcheck en el dashboard interno del bot
- [ ] Crear script `scripts/healthcheck.sh` que verifique:
  - [ ] PM2 online
  - [ ] WebSocket conectado
  - [ ] Supabase reachable
- [ ] Agregar cron: `*/5 * * * * /opt/rolbot/scripts/healthcheck.sh`

### F4.5 — Alerta OCI @Arquitecto
- [ ] Monitoring > Service Metrics
- [ ] Configurar alarmas para:
  - [ ] CPU > 80% por 10 min
  - [ ] Memory > 80% por 10 min
  - [ ] Instance stopped inesperadamente

### F4.6 — Certificar idle reclaim @Validador
- [ ] Monitorear CPU usage del bot tras 24h de operación
- [ ] Confirmar usage > 20% p95 (WebSocket activo cuenta como actividad)
- [ ] Registrar métricas en nekomemori
- [ ] Registrar en nekomemori

---

## Fase 5 — CI/CD y Automatización

### F5.1 — GitHub Actions deploy @Arquitecto
- [ ] Crear secretos en GitHub:
  - [ ] `SSH_PRIVATE_KEY` — llave privada para conexión
  - [ ] `SSH_HOST` — IP pública de la VM
  - [ ] `SSH_PORT` — puerto SSH personalizado
  - [ ] `SSH_USER` — usuario rolbot
- [ ] Crear `.github/workflows/deploy.yml`:
  - [ ] Trigger en push a branch main
  - [ ] Lint + typecheck + test primero
  - [ ] rsync a VM
  - [ ] npm ci en remoto
  - [ ] pm2 restart rolbot

### F5.2 — PM2 reload automático @Coder
- [ ] Configurar en deploy.sh: `pm2 restart rolbot --update-env`
- [ ] Verificar que reload no mata conexiones activas (graceful)
- [ ] Configurar `kill_timeout` en ecosystem.config.js si es necesario

### F5.3 — Script de rollback @Coder
- [ ] `scripts/rollback.sh`:
  ```bash
  #!/bin/bash
  cd /opt/rolbot
  git revert HEAD --no-edit
  pm2 restart rolbot
  pm2 status
  ```
- [ ] Probar rollback en staging

### F5.4 — Test deploy/rollback @Validador
- [ ] Simular deploy: `git commit --allow-empty -m "test deploy"`
- [ ] Verificar el workflow corre correctamente
- [ ] Verificar que el bot responde tras deploy
- [ ] Probar rollback: ejecutar scripts/rollback.sh
- [ ] Verificar que el bot funciona tras rollback
- [ ] Documentar tiempo total de deploy y rollback

### F5.5 — Actualizar design board @Validador
- [ ] Marcar ticket de deploy como completado
- [ ] Registrar en nekomemori

---

## Fase 6 — Documentación y Cierre

### F6.1 — Documentar arquitectura @Arquitecto
- [ ] Actualizar `memory/architecture.md` con:
  - [ ] Diagrama de arquitectura Oracle + Supabase
  - [ ] Puertos, protocolos, flujo de datos
  - [ ] URLs, endpoints, secrets usados
- [ ] Actualizar `AGENTS.md` con instrucciones de deploy

### F6.2 — Documentar disaster recovery @Arquitecto
- [ ] Crear `DISASTER_RECOVERY.md` con:
  - [ ] Cómo restaurar desde backup de Supabase
  - [ ] Cómo migrar a Railway si Oracle falla
  - [ ] Procedimiento de reconexión WhatsApp
  - [ ] Cómo regenerar QR/pairing code
  - [ ] Contactos de emergencia

### F6.3 — Registrar en memoria @Validador
- [ ] `nekomemori_record_memory` con:
  - [ ] Type: architecture
  - [ ] Tags: ['oracle-cloud', 'deploy', 'infra', '24-7']
  - [ ] Summary: "Bot desplegado en Oracle Cloud Always Free 24/7"
  - [ ] Details con IP, región, URLs
  - [ ] relatedFiles: todos los archivos nuevos

### F6.4 — Cerrar ticket @Validador
- [ ] Actualizar design board con ticket completado
- [ ] Verificar que todo commit está pusheado

---

## Resumen de Archivos Creados/Modificados

| Archivo | Acción | Propósito |
|---------|--------|-----------|
| `ORACLE_CLOUD_ROADMAP.md` | NEW | Roadmap completo del proyecto |
| `ORACLE_DEPLOY_CHECKLIST.md` | NEW | Checklist detallado con tareas por rol |
| `Dockerfile` | NEW | Contenedor para despliegue |
| `ecosystem.config.js` | NEW | Configuración PM2 |
| `scripts/deploy.sh` | NEW | Script automatizado de deploy |
| `scripts/rollback.sh` | NEW | Script de rollback |
| `.env.production.template` | NEW | Template de variables de entorno |
| `.github/workflows/deploy.yml` | NEW | CI/CD pipeline con deploy |
| `memory/architecture.md` | MODIFY | Documentación de arquitectura |
| `AGENTS.md` | MODIFY | Instrucciones de deploy |
| `DISASTER_RECOVERY.md` | NEW | Procedimiento de recuperación |

---

## Criterios de Aprobación Final

- [ ] Bot operativo 24/7 respondiendo mensajes en < 2s
- [ ] Reconexión automática verificada (caída de red, reboot, crash)
- [ ] Sin puertos SSH/HTTP expuestos (solo Cloudflare Tunnel)
- [ ] Sesión WhatsApp sobrevive a reinicio completo de VM
- [ ] CI/CD pipeline: push → test → deploy automático
- [ ] Rollback desde git en < 2 minutos
- [ ] Costo mensual: $0
- [ ] Documentación completa y actualizada
- [ ] Memoria registrada en nekomemori
