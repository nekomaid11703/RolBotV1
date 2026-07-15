# ADR-001: Eliminación de la capa de IA interna

**Fecha**: 2026-07-14
**Contexto**: El bot contenía un orquestador de IA (AiOrchestrator, DeepSeekProvider, AiDispatcher) que añadía latencia, costos de API y complejidad innecesaria. El 100% de los comandos eran deterministas (reglas fijas), no generativos.
**Decisión**: Eliminar toda la capa de IA interna, incluyendo DeepSeekProvider, AiOrchestrator, AiDispatcher y archivos auxiliares (classifyUtils.js). El bot opera solo con lógica de reglas.
**Consecuencias**: Positivas: 0 dependencias de API externas, 0 costos, código más simple, sin latencia de LLM. Negativas: no hay capacidad de generar contenido dinámico (no necesaria para los comandos actuales).
**Alternativas consideradas**: Mantener la IA para comandos de NPCs o narración. Se descartó porque ningún comando actual lo requiere.
