const combatParser = require('./combatParser');

const MANO_BLANCA_PATTERNS = [
  { pattern: /(lo?|le?)\s*(m[ae]t[oó]|derr[ée]t[oó]|venc[eo]|remat[eo])/, severity: 'alta', desc: 'declarar KO sin resolver' },
  { pattern: /(c[ae]e\s+(muerto|fulminado|inconsciente)|queda\s+(KO|k\s?o|inconsciente))/, severity: 'alta', desc: 'declarar estado del oponente' },
  { pattern: /(le\s+?)?cort[oó]\s+(el|la|su)\s+(brazo|pierna|cabeza|mano|dedo|cuello|garganta)/, severity: 'alta', desc: 'declarar amputación sin resolución' },
  { pattern: /(lo|la|le)\s*(desarm[oó]|tir[oó]\s+(el|su|la)\s+arma|hiz[oó]\s+soltar)/, severity: 'media', desc: 'declarar desarme sin resolución' },
  { pattern: /\b\w+[óo]\b.*,.*\b\w+[óo]\b/i, severity: 'baja', desc: 'múltiples acciones separadas por coma (posible secuencia forzada)' },
  { pattern: /(atac[oó].+defiend[eo]|golpe[oó].+bloqu[eo]|cort[oó].+esquiv[ao])/i, severity: 'media', desc: 'acción compuesta (ataque+defensa simultánea)' },
  { pattern: /(le|lo|la)\s*(part[eo]|raja[o]|abro[o]|destroz[ao])/, severity: 'alta', desc: 'narrar daño severo como hecho consumado' },
];

const MANO_NEGRA_PATTERNS = [
  { pattern: /(no\s+puede|no\s+logra|no\s+alcanza|no\s+consigue)\s+(esquivar|bloquear|defender|responder|reaccionar)/, severity: 'critica', desc: 'decidir que el oponente falla su defensa' },
  { pattern: /(su\s+(golpe|ataque|espada|arma|habilidad)\s+(falla|fall[oó]|yerra|err[oó]|no\s+conecta))/, severity: 'critica', desc: 'decidir el resultado del ataque del oponente' },
  { pattern: /(queda\s+(aturdido|atontado|paralizado|ciego|sordo|inmovil))/i, severity: 'critica', desc: 'imponer estado al oponente' },
  { pattern: /(no\s+pudo|no\s+p[uo]d[oa]|jam[aá]s\s+podr[aá]|imposible\s+(que|de))/, severity: 'alta', desc: 'negar capacidad del oponente' },
  { pattern: /(suelta|suelta|tira|deja\s+caer)\s+(su|el|la)\s+(arma|espada|escudo|daga)/, severity: 'alta', desc: 'forzar al oponente a soltar objeto' },
  { pattern: /(le\s+)?(clav[oó]|hunde|entierr[ao]|incrust[ao])\s+(la|su)\s+(espada|daga|lanza)\s+en\s+(su|el)\s+(pecho|abdomen|cabeza|cuello)/, severity: 'critica', desc: 'describir impacto letal como hecho consumado' },
  { pattern: /(s[ea]nt[ii]o?\s*(c[oó]mo|que)\s*(su|el)\s*(golpe|ataque)\s*(conecta|impacta|atraviesa|penetra))/i, severity: 'alta', desc: 'narrar el impacto sobre el oponente sin verificar defensa' },
];

function checkPatterns(text, patterns) {
  for (const check of patterns) {
    if (check.pattern.test(text)) {
      return { detected: true, severity: check.severity, desc: check.desc, pattern: check.pattern };
    }
  }
  return { detected: false };
}

function validate(text, opts = {}) {
  if (!text || text.length > 2000) {
    return { valid: false, infractions: [{ type: 'validation', severity: 'alta', description: 'Texto demasiado largo (>2000 chars)' }], messages: ['Texto excede el límite permitido.'] };
  }

  const { parsed, room, participant } = opts;
  const result = {
    valid: true,
    infractions: [],
    messages: [],
  };

  const blancaCheck = checkPatterns(text, MANO_BLANCA_PATTERNS);
  if (blancaCheck.detected) {
    result.valid = false;
    result.infractions.push({ type: 'mano_blanca', severity: blancaCheck.severity, description: blancaCheck.desc });
    result.messages.push(`Mano Blanca: ${blancaCheck.desc}`);
  }

  const negraCheck = checkPatterns(text, MANO_NEGRA_PATTERNS);
  if (negraCheck.detected) {
    result.valid = false;
    result.infractions.push({ type: 'mano_negra', severity: negraCheck.severity, description: negraCheck.desc });
    result.messages.push(`Mano Negra: ${negraCheck.desc}`);
  }

  return result;
}

function getStrikes(room, participantId) {
  if (!room || !room.infractions) return { blanca: 0, negra: 0 };
  return room.infractions[participantId] || { blanca: 0, negra: 0 };
}

function resetStrikes(room, participantId) {
  if (!room || !room.infractions) return;
  room.infractions[participantId] = { blanca: 0, negra: 0 };
}

module.exports = {
  validate,
  getStrikes,
  resetStrikes,
  MANO_BLANCA_PATTERNS,
  MANO_NEGRA_PATTERNS,
};
