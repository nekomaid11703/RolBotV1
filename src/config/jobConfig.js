// @ts-nocheck
/**
 * Configuración modular de los trabajos urbanos (Job System).
 * Cada trabajo define requisitos de stats, estadística que entrena pasivamente (tope 100),
 * salario en stelas, ganancia de XP, duración y coste de energía.
 */

const JOBS = {
  ayudante_panaderia: {
    id: "ayudante_panaderia",
    name: "Ayudante de Panadería",
    icon: "🥖",
    description: "Amasar y vigilar hornos de leña desde la madrugada.",
    energyCost: 15,
    durationMinutes: 20,
    stelasReward: 120,
    xpReward: 35,
    requirements: {},
    statTrained: "def",
  },

  aprendiz_herrero: {
    id: "aprendiz_herrero",
    name: "Aprendiz de Herrería",
    icon: "🔨",
    description: "Alimentar fuelles y martillar piezas de hierro bajo la tutela de Borin.",
    energyCost: 20,
    durationMinutes: 25,
    stelasReward: 180,
    xpReward: 50,
    requirements: { atk: 5, def: 5 },
    statTrained: "atk",
  },

  asistente_biblioteca: {
    id: "asistente_biblioteca",
    name: "Asistente de Biblioteca",
    icon: "📚",
    description: "Clasificar pergaminos arcanos y ordenar tomos antiguos.",
    energyCost: 15,
    durationMinutes: 20,
    stelasReward: 140,
    xpReward: 45,
    requirements: { fulgor: 5 },
    statTrained: "fulgor",
  },

  mensajero_callejero: {
    id: "mensajero_callejero",
    name: "Mensajero Callejero",
    icon: "✉️",
    description: "Entregar correspondencia urgente corriendo por tejados y callejones.",
    energyCost: 20,
    durationMinutes: 20,
    stelasReward: 160,
    xpReward: 45,
    requirements: { mspd: 5 },
    statTrained: "mspd",
  },

  tabernero_nocturno: {
    id: "tabernero_nocturno",
    name: "Tabernero Nocturno",
    icon: "🍺",
    description: "Servir jarras y lidiar con borrachos pesados en la posada local.",
    energyCost: 25,
    durationMinutes: 30,
    stelasReward: 210,
    xpReward: 60,
    requirements: { hp: 5, def: 5 },
    statTrained: "hp",
  },

  jornalero_campo: {
    id: "jornalero_campo",
    name: "Jornalero de Campo",
    icon: "🌾",
    description: "Arar la tierra y recoger cosechas bajo el sol.",
    energyCost: 20,
    durationMinutes: 25,
    stelasReward: 150,
    xpReward: 40,
    requirements: {},
    statTrained: "hp",
  },

  vigilante_porton: {
    id: "vigilante_porton",
    name: "Vigilante de Portón",
    icon: "🛡️",
    description: "Revisar carretas e inspeccionar a forasteros a la entrada del pueblo.",
    energyCost: 25,
    durationMinutes: 35,
    stelasReward: 240,
    xpReward: 65,
    requirements: { def: 10, ref: 5 },
    statTrained: "def",
  },

  asistente_boticario: {
    id: "asistente_boticario",
    name: "Asistente de Boticario",
    icon: "🧪",
    description: "Machacar hierbas secas y destilar ungüentos antídotos.",
    energyCost: 20,
    durationMinutes: 25,
    stelasReward: 190,
    xpReward: 55,
    requirements: { d_fulgor: 8 },
    statTrained: "d_fulgor",
  },

  lenador_municipal: {
    id: "lenador_municipal",
    name: "Leñador Municipal",
    icon: "🪵",
    description: "Talar árboles secos y apilar leña para los almacenes del pueblo.",
    energyCost: 25,
    durationMinutes: 30,
    stelasReward: 200,
    xpReward: 50,
    requirements: { atk: 8 },
    statTrained: "atk",
  },

  encendedor_farolas: {
    id: "encendedor_farolas",
    name: "Encendedor de Farolas",
    icon: "🕯️",
    description: "Recorrer las calles con pértiga y aceite al caer el crepúsculo.",
    energyCost: 15,
    durationMinutes: 15,
    stelasReward: 130,
    xpReward: 35,
    requirements: { mspd: 6 },
    statTrained: "mspd",
  },

  escribano_corte: {
    id: "escribano_corte",
    name: "Escribano de la Corte",
    icon: "⚖️",
    description: "Redactar actas y transcribir edictos oficiales con caligrafía pulcra.",
    energyCost: 20,
    durationMinutes: 30,
    stelasReward: 260,
    xpReward: 70,
    requirements: { d_fulgor: 10, ref: 8 },
    statTrained: "d_fulgor",
  },

  mozo_cuadras: {
    id: "mozo_cuadras",
    name: "Mozo de Cuadras",
    icon: "🐴",
    description: "Alimentar, cepillar y calmar a las monturas de los viajeros.",
    energyCost: 20,
    durationMinutes: 25,
    stelasReward: 170,
    xpReward: 45,
    requirements: { aspd: 5 },
    statTrained: "aspd",
  },

  limpiador_catacumbas: {
    id: "limpiador_catacumbas",
    name: "Limpiador de Catacumbas",
    icon: "🧹",
    description: "Bajar a criptas húmedas a limpiar telarañas y ahuyentar alimañas.",
    energyCost: 30,
    durationMinutes: 40,
    stelasReward: 320,
    xpReward: 85,
    requirements: { ref: 10, r_fulgor: 8 },
    statTrained: "r_fulgor",
  },

  aprendiz_carnicero: {
    id: "aprendiz_carnicero",
    name: "Aprendiz de Carnicero",
    icon: "🥩",
    description: "Deshuesar piezas de carne y afilar cuchillas pesadas.",
    energyCost: 20,
    durationMinutes: 25,
    stelasReward: 180,
    xpReward: 50,
    requirements: { atk: 8, aspd: 6 },
    statTrained: "aspd",
  },

  costurero_velas: {
    id: "costurero_velas",
    name: "Costurero de Toldos",
    icon: "🧵",
    description: "Zurcir lonas gruesas y velas para carretas de mercaderes.",
    energyCost: 15,
    durationMinutes: 20,
    stelasReward: 140,
    xpReward: 40,
    requirements: { ref: 6 },
    statTrained: "ref",
  },

  acarreador_carbon: {
    id: "acarreador_carbon",
    name: "Acarreador de Carbón",
    icon: "⛏️",
    description: "Transportar sacos de carbón pesado desde las carretas a los hornos.",
    energyCost: 30,
    durationMinutes: 35,
    stelasReward: 250,
    xpReward: 65,
    requirements: { def: 12, hp: 10 },
    statTrained: "def",
  },

  campanero_torre: {
    id: "campanero_torre",
    name: "Campanero de la Torre",
    icon: "🔔",
    description: "Subir a la torre central y tirar de las cuerdas al toque de cada hora.",
    energyCost: 20,
    durationMinutes: 20,
    stelasReward: 175,
    xpReward: 45,
    requirements: { aspd: 8, ref: 8 },
    statTrained: "ref",
  },

  estibador_muelle: {
    id: "estibador_muelle",
    name: "Estibador del Muelle",
    icon: "🐟",
    description: "Descargar barriles de pescado en salazón y cajas comerciales.",
    energyCost: 25,
    durationMinutes: 30,
    stelasReward: 220,
    xpReward: 60,
    requirements: { hp: 10, atk: 8 },
    statTrained: "hp",
  },

  acolito_templo: {
    id: "acolito_templo",
    name: "Acólito del Templo",
    icon: "🔮",
    description: "Canalizar plegarias suaves para purificar el santuario de miasmas.",
    energyCost: 25,
    durationMinutes: 35,
    stelasReward: 270,
    xpReward: 75,
    requirements: { fulgor: 12, r_fulgor: 10 },
    statTrained: "r_fulgor",
  },

  bodeguero_vinedo: {
    id: "bodeguero_vinedo",
    name: "Bodeguero de Viñedo",
    icon: "🍷",
    description: "Pisar uvas, trasvasar barriles y controlar la fermentación de caldos.",
    energyCost: 20,
    durationMinutes: 25,
    stelasReward: 195,
    xpReward: 50,
    requirements: { mspd: 8, hp: 6 },
    statTrained: "mspd",
  },
};

/**
 * Puntos de entrenamiento que otorga un trabajo hacia su atributo.
 * Base por duración: más horas de oficio equivalen a más práctica.
 * @param {object} job - Definición del trabajo
 * @returns {number}
 */
function trainingPointsForJob(job) {
  const minutes = Number(job?.durationMinutes) || 20;
  return Math.max(2, Math.round(minutes / 5));
}

module.exports = {
  JOBS,
  trainingPointsForJob,
};
