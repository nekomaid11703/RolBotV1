# Graphify — Knowledge Graph Workflow

## Carga automática
Cargar este skill al inicio de cada sesión cuando se vaya a trabajar sobre la arquitectura del código.

## Consulta pre-acción
Antes de refactorizar o modificar archivos con múltiples dependencias:
1. `graphify path "<archivo_origen>" "<archivo_destino>"` — trazar cadena de dependencias
2. `graphify query "<pregunta_sobre_arquitectura>"` — buscar nodos específicos
3. `graphify explain "<nombre_funcion>"` — explicar un nodo god

## Actualización post-modificación
Después de modificar código:
```bash
graphify --update .
```

Para cambios mayores (nuevos archivos o reestructuración):
```bash
graphify extract . --code-only --out .
```

## Cuándo usarlo
- Antes de refactorizar combatEngine.js o cualquier archivo con alta centralidad
- Para entender flujos completos (ej: "cómo se procesa un comando de ataque")
- Para detectar dependencias circulares antes de que depcruise las marque
- Para identificar orphans o god nodes

## Verificación
- `ls graphify-out/graph.json` debe existir
- El hook post-commit lo actualiza automáticamente
