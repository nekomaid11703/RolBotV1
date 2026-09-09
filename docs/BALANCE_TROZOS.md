# Plan de Balanceo por Trozos

Aprobado el 2026-09-07 (descomposición). Restricciones de diseño P1-P5 aprobadas el mismo día.
Cada trozo toca archivos propios, valida contra `progression:report` y entrega test propio + `check:all`.

## Orden de ejecución (B3 movido al final)

| Trozo | Sistema | Estado |
|---|---|---|
| B2 | Entrenamiento acumulado de atributos en trabajos | Implementado (2026-09-07) |
| B5 | Curva de nivel y coste de atributos (política) | Implementado (2026-09-07) |
| B1 | XP por tramo de nivel (trabajos, expediciones, combate) | Implementado (2026-09-07) |
| B4 | Progresión de herramientas y ROI | Implementado (2026-09-07) |
| B4 | Progresión de herramientas y ROI | Pendiente |
| B6 | Hitos de equipo y poder por rango | Pendiente |
| B7 | Economía de forja/refinamiento (tiempo vs poder vs compra) | Implementado (2026-09-07) |
| B8 | Identidad de materiales (stats por rareza y arquetipo) | B8.2a implementado; B8.2b (ley R(L)) pendiente |
| B3 | Rutas jugables de materiales raros y endgame | Pendiente (último) |

## Restricciones de diseño (P1-P5)

Estas restricciones son criterio de aceptación transversal: todo trozo debe declarar cuáles
satisface y cómo las mide en `progression:report`. Objetivos cuantitativos en
`DESIGN_TARGETS` (config) y comprobaciones automáticas en el reporte.

- **P1 — El tiempo no debe ser la única moneda.** Toda recompensa debe poder justificarse por
  decisión, riesgo o maestría, no solo por espera. Objetivo: prima de riesgo ≥1.25× frente al
  resultado de menor esfuerzo.
- **P2 — La maestría se premia y se muestra.** Reacciones correctas, sets completos, primera
  forja de material, rachas PvP → reconocimiento visible. Objetivo: ≥2 momentos de logro/semana.
- **P3 — La sorpresa es recurso de retención.** Botín con cola de rareza, eventos, rotativas con
  historia. Objetivo: ≥3 momentos memorables/semana.
- **P4 — Cada vía tiene una firma.** Si dos vías pagan lo mismo por lo mismo, una es decorativa.
  Objetivo: solapamiento de recompensas entre vías ≤35%.
- **P5 — Identidad antes que eficiencia.** El balance nunca debe empujar a una única build o
  actividad óptima. Objetivo: ≥3 estilos viables por cohorte de nivel.

## Acta de conformidad (revisión de lo ya construido)

### B2 — Entrenamiento acumulado
- **P1:** cumple parcial. El progreso es determinista (sin regalar stats por espera) y exige
  jornadas repetidas, pero la vía sigue siendo temporal por naturaleza (es la vía de
  especialización). Las primas por riesgo/maestría deben vivir en B1/B5.
- **P2:** cumple. El avance es visible (`DEF 18/24`, `+1`, tope semanal) en cobro y estado.
- **P3:** no aplica (los trabajos deben ser estables; la sorpresa no es su firma).
- **P4:** cumple. El trabajo tiene firma propia (entrenamiento por atributo) y el reporte
  confirma que ningún empleo domina simultáneamente XP, stelas y entrenamiento
  (`jobSingleDominant = false`), por lo que existen decisiones entre recompensas.
- **P5:** cumple en diseño (especialización por atributo, sin build óptima forzada). El
  estimador de cohorte aún simplifica usando el mejor empleo de XP; se refinará en B1 para
  modelar la elección según la identidad del jugador.

### Fundación (control plane + reporte)
- Proporciona las métricas necesarias para medir P1-P5 (cohortes, tasas, dominancia).
- Pendiente de implementación en trozos posteriores: prima de riesgo (P1), logros (P2),
  sorpresa (P3), solapamiento entre vías (P4 en B1/B6), estilos viables (P5 en B6).

### Trabajo previo de auditoría/preparación
- No aplica P1-P5 retroactivamente (se aprobaron después); su conformidad es de integridad
  técnica, ya verificada. Ningún cambio previo contradice las restricciones.

## Contrato común

- Números nuevos en `src/config/progressionBalance.js` (incluye `DESIGN_TARGETS`).
- Reporte `npm run progression:report` como fuente de verdad.
- Límites de la política de balance se aprueban antes de tocar fórmulas en runtime.

## Métricas de aceptación por trozo

- **B1**: XP diaria de trabajo ≤15% de la de combate en el mismo nivel; ninguna cohorte
  dedicada se estanca >60 días; sin saltos >3× entre cohortes adyacentes. Además P1
  (prima de riesgo ≥1.25×) y P4 (firma por vía).
  - **Revisado**: el valor laboral incluye el equivalente XP del punto de entrenamiento
    (1 punto = `xpForNextLevel` según B5); `valor total = jobXp + statEquivalentXp` no debe
    superar la XP de combate diaria del mismo perfil (`jobMaxValueRatioOfCombat ≤ 1`).
    Verificado por el reporte en todas las cohortes.
- **B2**: ≤0.25 stats/día y ≤1 stat/semana por atributo (JOB_TRAINING); reporte sin la
  advertencia de stats de trabajo. Aplica P2/P4/P5.
- **B3**: `unreachableMaterials=[]` y `blockedRequirements=[]`. Aplica P3 (sorpresa por
  rareza escalonada) y P5 (varias rutas para el mismo material cuando aporte decisión).
- **B4**: días por nivel de herramienta y ROI ≥1 en ≤10 usos de zona.
  - Resultado: costes y bonus recalibrados (niveles 2-9 con retorno ≤10 en su zona de
    referencia; nivel 10 pendiente de las rutas de oro/titanio de B3).
  - Desviación conocida: Bolsa nivel 10 retorna en 13 expediciones; se revisará al añadir
    rutas de titanio en B3. Aplica P4 (la
  herramienta no debe ser la única vía óptima de materiales).
- **B5**: curva 100→500 con política explícita; invariante de calibración documentada;
  relación nivel/stats coherente hasta el tope (hoy stats pueden superar el nivel máximo).
  Aplica P1 (coste de atributo ligado a decisiones) y P2 (progreso reconocible).
- **B6**: poder relativo por build y cohorte en el reporte; ≥3 estilos viables por cohorte
  (P5) y brechas de equipo sanas entre niveles.
- **B7**: el reporte compara forja vs compra directa por material y tier (escalera 2:1,
  tiempo de recolección por zona, poder relativo por tier y días de compra). Objetivo:
  que refinar/forjar sea competitivo y divertido frente a "conseguir algo mejor directo".

## Hallazgos base (previos a B2)

- 14 materiales sin fuente jugable; oro/titanio bloquean herramientas 9-10.
- Trabajos otorgaban hasta 3 stats/día sin tope (corregido en B2).
- XP de actividades fija era marginal en niveles 300-500.
- Perfil casual de combate se estancaba.
- Inconsistencia B5: las stats pueden seguir subiendo cuando el nivel ya está en el tope 500.
