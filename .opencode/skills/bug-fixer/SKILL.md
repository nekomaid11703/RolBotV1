# Bug Fixer Skill

Te permite procesar y resolver bugs reportados en RolBotV1.

## Comandos disponibles

### Listar bugs abiertos
```
node scripts/process_bugs.js --list
```

### Ver detalle de un bug
```
node scripts/process_bugs.js --view <id>
```

### Resolver un bug
```
node scripts/process_bugs.js --resolve <id> --summary "descripción del fix" --commit <hash>
```

Opcional: `--commit` puede omitirse si no aplica.

### Ver estadísticas
```
node scripts/process_bugs.js --stats
```

## Flujo de trabajo

1. El usuario pide "procesa bugs"
2. Ejecuta `--list` para ver bugs abiertos
3. Examina bugs con `--view <id>`
4. Lee el código relacionado, aplica el fix
5. Commit con `git add . && git commit -m "fix: #<id> <descripción>" && git push`
6. Ejecuta `--resolve <id> --summary "<fix>" --commit <hash>`
7. El bot notificará al usuario cuando reinicie

## Almacenamiento

Los bugs se almacenan en Supabase, tabla `bot_auth_state` con `session_id='bug_report'`.
Cada fila tiene `id = UUID` y `data = { id, userId, description, priority, status, ... }`.
