# Roadmap — Deploy Oracle Cloud 24/7

> **Proyecto:** RolBotV1
> **Objetivo:** Bot WhatsApp operando 24/7 sin costo mensual en Oracle Cloud Always Free
> **Baseline:** Node.js 22+ · Supabase (ya cloud) · Sesión WhatsApp en Supabase (stateless-ready)
> **Creado:** 2026-07-16

---

## ¿Por qué Oracle Cloud?

| Recurso | Free Tier Oracle | Costo |
|---------|-----------------|-------|
| CPU | 2 OCPUs ARM (Ampere A1) | $0 |
| RAM | 12 GB | $0 |
| Storage | 200 GB bloque | $0 |
| Tráfico | 10 TB/mes | $0 |
| Disponibilidad | 24/7 real (nunca duerme) | $0 |
| Alternativa paga mínima (Railway) | 512 MB RAM, $5/mes | $60/año |

**Única plataforma que da una VM real gratuita 24/7 sin límite de tiempo.**

---

## Requisitos Previos

### Cuentas y Credenciales
- [ ] Cuenta Oracle Cloud (cloud.oracle.com) — tarjeta solo para verificación
- [ ] Supabase URL + Service Role Key (ya existentes)
- [ ] GitHub token (opcional, para CI/CD)
- [ ] Nombre de dominio (opcional, para Cloudflare Tunnel)
- [ ] Cloudflare account (opcional, para tunnel gratuito)

### Conocimientos
- [ ] SSH básico (conexión, scp, comandos Linux)
- [ ] Git (clone, pull, push)
- [ ] Conceptos de systemd/PM2
- [ ] Navegación en OCI Console

### Hardware Objetivo
- **VM Shape:** VM.Standard.A1.Flex (ARM64)
- **OS:** Ubuntu 24.04 LTS
- **Recursos:** 2 OCPU · 12 GB RAM · 50 GB boot volume
- **Región:** Elegir la más cercana (ver disponibilidad A1)

---

## Fase 0 — Fundación (Preparación Local)

| ID | Tarea | Rol | Depende | Estimado |
|----|-------|-----|---------|----------|
| F0.1 | Auditar que el bot funcione sin estado local (verificar sesión en Supabase) | @Arquitecto | — | 30 min |
| F0.2 | Verificar compatibilidad ARM64 de todas las dependencias | @Arquitecto | F0.1 | 15 min |
| F0.3 | Crear Dockerfile multi-propósito (Node.js 22 slim) | @Coder | F0.1 | 30 min |
| F0.4 | Crear ecosystem.config.js para PM2 | @Coder | F0.1 | 15 min |
| F0.5 | Crear scripts/deploy.sh con setup automatizado | @Coder | F0.3 | 30 min |
| F0.6 | Crear .env.production.template sin valores sensibles | @Coder | F0.1 | 10 min |
| F0.7 | Validar lint, typecheck y tests post-cambios | @Validador | F0.3–F0.6 | 20 min |

**Entregables:** Dockerfile, ecosystem.config.js, deploy.sh, .env.production.template

---

## Fase 1 — Provisionamiento Oracle Cloud

| ID | Tarea | Rol | Depende | Estimado |
|----|-------|-----|---------|----------|
| F1.1 | Crear cuenta Oracle Cloud (cloud.oracle.com) | @Arquitecto | — | 15 min |
| F1.2 | Configurar presupuesto y alerta de $0 (evitar cargos sorpresa) | @Arquitecto | F1.1 | 10 min |
| F1.3 | Generar par de llaves SSH (ed25519) | @Arquitecto | — | 5 min |
| F1.4 | Lanzar instancia VM.Standard.A1.Flex con Ubuntu 24.04 | @Arquitecto | F1.1–F1.3 | 20 min |
| F1.5 | Configurar security list (ingress solo SSH puerto 22 desde IP fija) | @Coder | F1.4 | 10 min |
| F1.6 | Verificar conexión SSH y hardening inicial | @Validador | F1.4–F1.5 | 10 min |

**Entregables:** VM operativa con SSH, security groups mínimos

---

## Fase 2 — Setup del Servidor

| ID | Tarea | Rol | Depende | Estimado |
|----|-------|-----|---------|----------|
| F2.1 | Hardening: cambiar puerto SSH, fail2ban, UFW, auto-updates | @Arquitecto | F1.6 | 30 min |
| F2.2 | Instalar Node.js 22+ (vía NodeSource o nvm) | @Coder | F1.6 | 10 min |
| F2.3 | Instalar PM2 globalmente | @Coder | F2.2 | 5 min |
| F2.4 | Configurar PM2 startup (systemd) | @Coder | F2.3 | 10 min |
| F2.5 | Clonar repositorio en /opt/rolbot | @Coder | F2.2 | 5 min |
| F2.6 | Crear usuario no-root 'rolbot' para ejecutar el bot | @Coder | F1.6 | 10 min |
| F2.7 | npm ci (instalación limpia de dependencias) | @Coder | F2.5 | 10 min |
| F2.8 | Copiar .env.production con credenciales reales | @Coder | F2.7 | 5 min |
| F2.9 | Verificar que el bot inicia correctamente (dry-run) | @Validador | F2.8 | 15 min |

**Entregables:** Servidor listo con Node.js 22+, PM2, bot clonado y configurado

---

## Fase 3 — Vinculación WhatsApp

| ID | Tarea | Rol | Depende | Estimado |
|----|-------|-----|---------|----------|
| F3.1 | Iniciar bot con pairing code (npm start code) en sesión SSH | @Coder | F2.9 | 10 min |
| F3.2 | Vincular número de WhatsApp con código de 8 dígitos | @Coder | F3.1 | 5 min |
| F3.3 | Verificar que la sesión persiste en Supabase | @Validador | F3.2 | 5 min |
| F3.4 | Detener bot manual, iniciar con PM2 | @Coder | F3.3 | 5 min |
| F3.5 | Verificar reconexión automática tras desconexión | @Validador | F3.4 | 10 min |
| F3.6 | Verificar watchdog (reintentos, loggedOut, restartRequired) | @Validador | F3.5 | 10 min |

**Entregables:** Bot vinculado a WhatsApp operando 24/7 con PM2

---

## Fase 4 — Seguridad y Monitoreo

| ID | Tarea | Rol | Depende | Estimado |
|----|-------|-----|---------|----------|
| F4.1 | Configurar Cloudflare Tunnel (sin puertos abiertos) | @Arquitecto | F3.4 | 30 min |
| F4.2 | Configurar rotación de logs (logrotate para PM2 y journald) | @Arquitecto | F3.4 | 15 min |
| F4.3 | Configurar backup automático de bot_auth_state (Supabase ya lo hace) | @Arquitecto | — | 10 min |
| F4.4 | Configurar alertas de salud (uptime monitor tipo ping de CF) | @Coder | F4.1 | 20 min |
| F4.5 | Configurar alerta de CPU/memoria en OCI | @Arquitecto | F1.2 | 10 min |
| F4.6 | Certificar cumplimiento idle reclaim (p95 usage > 20%) | @Validador | F4.5 | 10 min |

**Entregables:** Bot seguro, monitoreado, sin puertos expuestos

---

## Fase 5 — CI/CD y Automatización

| ID | Tarea | Rol | Depende | Estimado |
|----|-------|-----|---------|----------|
| F5.1 | Configurar GitHub Actions deploy step a Oracle VM via SSH | @Arquitecto | F4.4 | 30 min |
| F5.2 | Configurar PM2 reload automático tras git pull | @Coder | F5.1 | 15 min |
| F5.3 | Crear script de rollback (git revert + pm2 restart) | @Coder | F5.2 | 15 min |
| F5.4 | Test completo: deploy —> rollback —> redeploy | @Validador | F5.3 | 30 min |
| F5.5 | Actualizar design board con estado final | @Validador | F5.4 | 10 min |

**Entregables:** Pipeline CI/CD con deploy automático y rollback

---

## Fase 6 — Documentación y Cierre

| ID | Tarea | Rol | Depende | Estimado |
|----|-------|-----|---------|----------|
| F6.1 | Documentar arquitectura final en memory/architecture.md | @Arquitecto | F5.4 | 20 min |
| F6.2 | Documentar procedimiento de recuperación en DISASTER_RECOVERY.md | @Arquitecto | F5.4 | 20 min |
| F6.3 | Resumir en nekomemori_record_memory la decisión y resultado | @Validador | F6.1–F6.2 | 10 min |
| F6.4 | Marcar ticket en design board como completado | @Validador | F6.3 | 5 min |

**Entregables:** Docs actualizadas, memoria registrada, ticket cerrado

---

## Estimación Total

| Fase | Tiempo | Rol Principal | Dependencia Externa |
|------|--------|---------------|-------------------|
| F0: Fundación | ~2.5h | @Coder | No |
| F1: Oracle Cloud | ~1h | @Arquitecto | Sí (cuenta Oracle) |
| F2: Server Setup | ~1.5h | @Coder | No |
| F3: WhatsApp Link | ~45min | @Coder | Sí (WhatsApp) |
| F4: Seguridad | ~1.5h | @Arquitecto | No |
| F5: CI/CD | ~1.5h | @Coder | No |
| F6: Docs | ~1h | @Arquitecto | No |
| **Total** | **~10h** | — | — |

---

## Arquitectura Final

```
┌─────────────────────────────────────────────────────┐
│                   WhatsApp Cloud                     │
└──────────────────────┬──────────────────────────────┘
                       │ WebSocket (Baileys)
┌──────────────────────▼──────────────────────────────┐
│           Oracle VM (2 OCPU / 12 GB RAM)             │
│  ┌───────────────────────────────────────────────┐  │
│  │  PM2 (proceso manager)                        │  │
│  │  └─ rolbot (index.js)                         │  │
│  │     ├─ Baileys WebSocket (WhatsApp)           │  │
│  │     ├─ Watchdog (reconexión)                  │  │
│  │     ├─ Dashboard (status local)               │  │
│  │     └─ Midnight Review (daily scheduler)      │  │
│  └───────────────────────────────────────────────┘  │
│                        │                             │
│              ┌─────────▼─────────┐                   │
│              │  Cloudflare Tunnel │ (opcional, sin    │
│              │  (cloudflared)    │  puertos abiertos) │
│              └─────────┬─────────┘                   │
└────────────────────────┼─────────────────────────────┘
                         │ HTTPS
              ┌──────────▼──────────┐
              │   Supabase Cloud    │
              │  ┌──────────────┐   │
              │  │ bot_auth_state│   │ ← Sesión WhatsApp
              │  │ users        │   │
              │  │ characters   │   │
              │  │ economy      │   │
              │  │ groups       │   │
              │  └──────────────┘   │
              └─────────────────────┘
```

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Out of capacity A1 al crear VM | Alta | Retraso | Intentar en otro AD, usar script retry, pedir 2 OCPU primero |
| Oracle reduce free tier | Media | Migrar | Tener Railway como plan B (cuesta $5/mes) |
| Idle reclaim (7 días <20%) | Baja | VM detenida | El bot tiene WebSocket activo 24/7 → CPU usa >20% |
| Cuenta Oracle suspendida | Baja | Caída total | Backup de sesión en Supabase, restaurar en 5 min |
| WhatsApp ban (Baileys) | Baja | Bot muerto | Rate limiting nativo, no enviar spam |
| ARM64 incompatibilidad | Muy baja | Build fails | Verificar en F0.2, todas las deps son compatibles |

---

## Criterios de Éxito

- [ ] Bot responde mensajes 24/7 sin interrupción
- [ ] Reconexión automática tras caída de internet
- [ ] Sesión WhatsApp sobrevive a reboot de VM
- [ ] Sin puertos SSH/HTTP expuestos a internet (solo Cloudflare Tunnel)
- [ ] Costo mensual: $0
- [ ] Rollback completo desde git en < 5 minutos
