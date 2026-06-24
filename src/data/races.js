const races = [
  // =====================================================================
  // 1. HUMANO — Raza común, equilibrada
  // =====================================================================
  {
    id: 'race_human',
    name: 'Humano',
    rarity: 'comun',
    alignment: ['equilibrio'],
    description: 'La raza más versátil y adaptable del mundo.',
    lore: 'Los humanos son una raza joven pero de crecimiento explosivo. Su capacidad de adaptación los ha llevado a establecerse en todos los rincones del mundo, forjando alianzas con otras razas y construyendo grandes civilizaciones. No destacan en ningún área específica, pero su determinación y versatilidad los convierte en verdaderos supervivientes.',
    subtypes: [],
    statModifiers: { fuerza: 0, defensa: 0, agilidad: 0, magia: 0, percepcion: 0, carisma: 0 },
    passive: {
      name: 'Adaptabilidad',
      description: '+10% a cualquier stat en situaciones de adaptación. Puede cambiar un bono racial por otro tras un descanso largo.'
    },
    advantages: [
      'Versatilidad excepcional en cualquier rol',
      'Capacidad de aprendizaje acelerado con otras razas'
    ],
    disadvantages: [
      'Sin especialización natural en ningún atributo',
      'Susceptible a enfermedades y corrupción'
    ],
    relationships: {
      race_elf: 'ally',
      race_dwarf: 'ally',
      race_goblin: 'neutral',
      race_oni: 'enemy',
      race_elemental: 'neutral',
      race_dragon: 'neutral',
      race_yordle: 'neutral',
      race_undead: 'enemy',
      race_vampire: 'enemy',
      race_furry: 'ally',
      race_fairy: 'neutral',
      race_automaton: 'ally',
      race_trickster: 'neutral',
      race_puppet: 'enemy',
      race_incarnation: 'neutral',
      race_void: 'enemy',
      race_angel: 'ally',
      race_graviton: 'neutral',
      race_siren: 'neutral',
      race_demon: 'enemy'
    },
    possibleHybrids: ['race_elf', 'race_furry', 'race_elemental', 'race_dragon', 'race_angel'],
    unlockRequirements: [{ type: 'level', value: 1 }],
    blocked: false
  },

  // =====================================================================
  // 2. ELFO — Raza común, mágica y ágil
  // =====================================================================
  {
    id: 'race_elf',
    name: 'Elfo',
    rarity: 'comun',
    alignment: ['naturaleza', 'luz'],
    description: 'Seres longevos de gracia sobrenatural y profunda conexión con la magia.',
    lore: 'Los elfos son una de las razas más antiguas del mundo, nacidos de los primeros rayos de luz sobre los bosques primigenios. Poseen una afinidad natural con la magia y la naturaleza, lo que les permite tejer hechizos con una elegancia que otras razas tardan décadas en dominar. Su longevidad los hace pacientes y sabios, aunque a veces distantes con las razas de vida más corta.',
    subtypes: [],
    statModifiers: { fuerza: -10, defensa: -10, agilidad: 25, magia: 20, percepcion: 20, carisma: 10 },
    passive: {
      name: 'Afinidad mágica',
      description: '+20% eficacia de hechizos. +10% regeneración de mana en entornos naturales.'
    },
    advantages: [
      'Alta afinidad con la magia arcana y natural',
      'Sentidos agudizados por siglos de vida'
    ],
    disadvantages: [
      'Constitución física más frágil que otras razas',
      'Pueden parecer arrogantes o distantes con razas jóvenes'
    ],
    relationships: {
      race_human: 'ally',
      race_dwarf: 'neutral',
      race_goblin: 'neutral',
      race_oni: 'enemy',
      race_elemental: 'ally',
      race_dragon: 'neutral',
      race_yordle: 'ally',
      race_undead: 'enemy',
      race_vampire: 'enemy',
      race_furry: 'ally',
      race_fairy: 'ally',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'enemy',
      race_incarnation: 'neutral',
      race_void: 'enemy',
      race_angel: 'ally',
      race_graviton: 'neutral',
      race_siren: 'ally',
      race_demon: 'enemy'
    },
    possibleHybrids: ['race_human', 'race_oni', 'race_siren', 'race_elemental'],
    unlockRequirements: [{ type: 'level', value: 1 }],
    blocked: false
  },

  // =====================================================================
  // 3. ENANO — Raza común, forjadora y resistente
  // =====================================================================
  {
    id: 'race_dwarf',
    name: 'Enano',
    rarity: 'comun',
    alignment: ['tierra', 'tecnologia'],
    description: 'Maestros de la forja y la piedra, tan sólidos como las montañas que habitan.',
    lore: 'Los enanos nacieron de las profundidades de la tierra, forjados en el corazón de los volcanes por los primeros dioses herreros. Son artesanos incomparables, capaces de extraer los secretos de los minerales y transformarlos en armaduras y armas legendarias. Su resistencia y orgullo son tan profundos como las minas que excavan.',
    subtypes: [],
    statModifiers: { fuerza: 25, defensa: 30, agilidad: -10, magia: 0, percepcion: 10, carisma: 5 },
    passive: {
      name: 'Maestro forjador',
      description: '+25% eficacia al forjar o reparar equipo. Resistencia al fuego +15%.'
    },
    advantages: [
      'Maestría en la forja y artesanía de equipo',
      'Constitución robusta y alta resistencia física'
    ],
    disadvantages: [
      'Movimientos lentos y pesados',
      'Orgullo excesivo que puede llevar a rencillas'
    ],
    relationships: {
      race_human: 'ally',
      race_elf: 'neutral',
      race_goblin: 'enemy',
      race_oni: 'enemy',
      race_elemental: 'ally',
      race_dragon: 'neutral',
      race_yordle: 'neutral',
      race_undead: 'enemy',
      race_vampire: 'enemy',
      race_furry: 'neutral',
      race_fairy: 'neutral',
      race_automaton: 'ally',
      race_trickster: 'neutral',
      race_puppet: 'enemy',
      race_incarnation: 'neutral',
      race_void: 'enemy',
      race_angel: 'ally',
      race_graviton: 'neutral',
      race_siren: 'neutral',
      race_demon: 'enemy'
    },
    possibleHybrids: [],
    unlockRequirements: [{ type: 'level', value: 1 }],
    blocked: false
  },

  // =====================================================================
  // 4. DUENDE — Raza común, artífice e ingeniosa
  // =====================================================================
  {
    id: 'race_goblin',
    name: 'Duende',
    rarity: 'comun',
    alignment: ['tecnologia', 'arcano'],
    description: 'Pequeños pero brillantes, maestros de la invención y el ingenio.',
    lore: 'Los duendes son criaturas pequeñas de intelecto agudo y manos inquietas, siempre creando, modificando o mejorando artefactos. Su curiosidad insaciable los ha llevado a dominar tanto la tecnología como la magia arcana, combinando ambas en inventos que otras razas consideran imposibles. Su naturaleza traviesa a veces los mete en problemas, pero su ingenio siempre encuentra una salida.',
    subtypes: [
      {
        name: 'Duende bárbaro',
        rarity: 'comun',
        description: 'Duendes que han vivido en entornos hostiles, desarrollando fuerza y ferocidad.',
        bonuses: { fuerza: 10, defensa: 5 },
        skills: ['Rabia primitiva', 'Grito de guerra'],
        weaknesses: ['Menor destreza tecnológica'],
        requirements: { level: 5, alignment: 'caos' }
      },
      {
        name: 'Duende civilizado',
        rarity: 'comun',
        description: 'Duendes integrados en sociedades avanzadas, puliendo su ingenio.',
        bonuses: { carisma: 10, magia: 5 },
        skills: ['Negociación', 'Ingeniería arcana'],
        weaknesses: ['Menor resistencia física'],
        requirements: { level: 5, alignment: 'tecnologia' }
      }
    ],
    statModifiers: { fuerza: 5, defensa: 5, agilidad: 20, magia: 15, percepcion: 25, carisma: 10 },
    passive: {
      name: 'Maestro artífice',
      description: '+20% a creación de artefactos y trampas. Los consumibles duran un turno extra.'
    },
    advantages: [
      'Alta percepción y reflejos',
      'Creatividad e ingenio tecnológico'
    ],
    disadvantages: [
      'Constitución física inferior',
      'Tendencia a la avaricia y el engaño'
    ],
    relationships: {
      race_human: 'neutral',
      race_elf: 'neutral',
      race_dwarf: 'enemy',
      race_oni: 'neutral',
      race_elemental: 'neutral',
      race_dragon: 'neutral',
      race_yordle: 'ally',
      race_undead: 'neutral',
      race_vampire: 'neutral',
      race_furry: 'neutral',
      race_fairy: 'ally',
      race_automaton: 'ally',
      race_trickster: 'ally',
      race_puppet: 'neutral',
      race_incarnation: 'neutral',
      race_void: 'enemy',
      race_angel: 'neutral',
      race_graviton: 'neutral',
      race_siren: 'neutral',
      race_demon: 'neutral'
    },
    possibleHybrids: [],
    unlockRequirements: [{ type: 'level', value: 1 }],
    blocked: false
  },

  // =====================================================================
  // 5. ONI — Raza avanzada, fuerza bruta demoníaca
  // =====================================================================
  {
    id: 'race_oni',
    name: 'Oni',
    rarity: 'avanzado',
    alignment: ['oscuridad', 'fuego'],
    description: 'Gigantes de sangre caliente y fuerza descomunal, nacidos de las llamas del infierno.',
    lore: 'Los onis son criaturas colosales nacidas en los planos infernales, forjadas en fuego y oscuridad. Su sed de batalla es insaciable y su fuerza puede derribar montañas, lo que los convierte en enemigos temibles y aliados igualmente peligrosos. Aunque su naturaleza es violenta, algunos onis han logrado canalizar su rabia hacia propósitos más nobles.',
    subtypes: [
      {
        name: 'Oni chamán',
        rarity: 'avanzado',
        description: 'Onis que dominan la magia de fuego y oscuridad.',
        bonuses: { magia: 15, percepcion: 10 },
        skills: ['Llamas infernales', 'Maleficio'],
        weaknesses: ['Defensa reducida'],
        requirements: { level: 15, alignment: 'fuego' }
      },
      {
        name: 'Oni colosal',
        rarity: 'avanzado',
        description: 'Onis de tamaño y fuerza extraordinarios.',
        bonuses: { fuerza: 20, defensa: 15 },
        skills: ['Pisotón sísmico', 'Ira incontenible'],
        weaknesses: ['Agilidad muy reducida'],
        requirements: { level: 15 }
      },
      {
        name: 'Oni anciano',
        rarity: 'elite',
        description: 'Onis que han sobrevivido siglos, acumulando sabiduría y poder.',
        bonuses: { fuerza: 10, magia: 15, percepcion: 10 },
        skills: ['Sabiduría ancestral', 'Rugido atronador'],
        weaknesses: ['Velocidad reducida'],
        requirements: { level: 25 }
      },
      {
        name: 'Oni señor de la guerra',
        rarity: 'elite',
        description: 'Onis que comandan ejércitos infernales con mano de hierro.',
        bonuses: { fuerza: 25, defensa: 20, carisma: 10 },
        skills: ['Orden de batalla', 'Estratega infernal'],
        weaknesses: ['Orgullo desmedido'],
        requirements: { level: 30 }
      },
      {
        name: 'Oni rojo',
        rarity: 'legendario',
        description: 'La forma más pura y poderosa de Oni, bañada en sangre demoníaca.',
        bonuses: { fuerza: 35, defensa: 20, magia: 15 },
        skills: ['Furia carmesí', 'Forma infernal'],
        weaknesses: ['Vulnerabilidad a luz sacra'],
        requirements: { level: 45 }
      }
    ],
    statModifiers: { fuerza: 40, defensa: 25, agilidad: 10, magia: -10, percepcion: 5, carisma: -5 },
    passive: {
      name: 'Fuerza bruta',
      description: '+15% daño físico. -10% coste de habilidades de fuerza. Puede romper objetos con las manos desnudas.'
    },
    advantages: [
      'Fuerza física abrumadora',
      'Resistencia natural al fuego y al dolor'
    ],
    disadvantages: [
      'Carisma y presencia intimidan a otros',
      'Impulsividad y dificultad para controlar la ira'
    ],
    relationships: {
      race_human: 'enemy',
      race_elf: 'enemy',
      race_dwarf: 'enemy',
      race_goblin: 'neutral',
      race_elemental: 'ally',
      race_dragon: 'neutral',
      race_yordle: 'neutral',
      race_undead: 'ally',
      race_vampire: 'ally',
      race_furry: 'enemy',
      race_fairy: 'enemy',
      race_automaton: 'enemy',
      race_trickster: 'neutral',
      race_puppet: 'ally',
      race_incarnation: 'neutral',
      race_void: 'ally',
      race_angel: 'enemy',
      race_graviton: 'neutral',
      race_siren: 'neutral',
      race_demon: 'ally'
    },
    possibleHybrids: ['race_elf'],
    unlockRequirements: [{ type: 'level', value: 10 }],
    blocked: false
  },

  // =====================================================================
  // 6. ELEMENTAL — Raza avanzada, encarnación de los elementos
  // =====================================================================
  {
    id: 'race_elemental',
    name: 'Elemental',
    rarity: 'avanzado',
    alignment: ['fuego', 'agua', 'tierra', 'aire'],
    description: 'Seres nacidos de la esencia pura de los elementos naturales.',
    lore: 'Los elementales son manifestaciones vivientes de los elementos primordiales, surgidos en los lugares donde la energía elemental es más densa. Cada elemental encarna la esencia de su elemento, desde la furia ardiente del fuego hasta la serenidad profunda del agua. Su existencia está ligada al plano elemental, pero algunos cruzan al mundo mortal por voluntad propia o por conjuros poderosos.',
    subtypes: [
      {
        name: 'Elemental de fuego',
        rarity: 'avanzado',
        description: 'Seres de llama viva que abrasan todo a su paso.',
        bonuses: { fuerza: 15, magia: 15 },
        skills: ['Llamarada', 'Aura ígnea'],
        weaknesses: ['Vulnerabilidad al agua'],
        requirements: { level: 10, alignment: 'fuego' }
      },
      {
        name: 'Elemental de agua',
        rarity: 'avanzado',
        description: 'Seres líquidos que fluyen con la corriente del mundo.',
        bonuses: { agilidad: 15, magia: 15 },
        skills: ['Torrente', 'Niebla espesa'],
        weaknesses: ['Vulnerabilidad al fuego'],
        requirements: { level: 10, alignment: 'agua' }
      },
      {
        name: 'Elemental de tierra',
        rarity: 'avanzado',
        description: 'Golem de roca y mineral, inmutable como la montaña.',
        bonuses: { fuerza: 20, defensa: 25 },
        skills: ['Terremoto', 'Piel pétrea'],
        weaknesses: ['Vulnerabilidad al aire'],
        requirements: { level: 10, alignment: 'tierra' }
      },
      {
        name: 'Elemental de aire',
        rarity: 'avanzado',
        description: 'Seres de viento puro, rápidos e invisibles.',
        bonuses: { agilidad: 25, percepcion: 15 },
        skills: ['Ráfaga', 'Invisibilidad'],
        weaknesses: ['Vulnerabilidad a tierra'],
        requirements: { level: 10, alignment: 'aire' }
      }
    ],
    statModifiers: { fuerza: 10, defensa: 10, agilidad: 10, magia: 20, percepcion: 15, carisma: 0 },
    passive: {
      name: 'Cuerpo elemental',
      description: '+20% resistencia al elemento de origen. No necesita respirar ni comer. Vulnerabilidad -20% al elemento opuesto.'
    },
    advantages: [
      'Conexión absoluta con su elemento',
      'Inmune a necesidades fisiológicas básicas'
    ],
    disadvantages: [
      'Vulnerabilidad severa al elemento opuesto',
      'Dificultad para relacionarse con razas mortales'
    ],
    relationships: {
      race_human: 'neutral',
      race_elf: 'ally',
      race_dwarf: 'ally',
      race_goblin: 'neutral',
      race_oni: 'ally',
      race_dragon: 'neutral',
      race_yordle: 'neutral',
      race_undead: 'neutral',
      race_vampire: 'neutral',
      race_furry: 'ally',
      race_fairy: 'ally',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'neutral',
      race_incarnation: 'ally',
      race_void: 'enemy',
      race_angel: 'neutral',
      race_graviton: 'neutral',
      race_siren: 'ally',
      race_demon: 'neutral'
    },
    possibleHybrids: ['race_human', 'race_elf'],
    unlockRequirements: [{ type: 'level', value: 10 }],
    blocked: false
  },

  // =====================================================================
  // 7. DRAGÓN — Raza legendaria, poder ancestral
  // =====================================================================
  {
    id: 'race_dragon',
    name: 'Dragón',
    rarity: 'legendario',
    alignment: ['caos', 'equilibrio'],
    description: 'Seres colosales de poder incomparable, señores de los cielos y la magia.',
    lore: 'Los dragones son las criaturas más antiguas y poderosas del mundo, nacidas del aliento del creador antes de que existieran los mortales. Poseen una inteligencia milenaria y un poder que abarca tanto la magia como la fuerza física, pudiendo alternar entre forma humana y dracónica. Cada dragón sigue su propia filosofía, desde la毁灭 más absoluta hasta la protección más devota.',
    subtypes: [
      {
        name: 'Dragón del caos',
        rarity: 'legendario',
        description: 'Dragones que abrazan la destrucción y el cambio constante.',
        bonuses: { fuerza: 20, magia: 20, agilidad: 10 },
        skills: ['Aliento caótico', 'Distorsión elemental'],
        weaknesses: ['Inestabilidad emocional'],
        requirements: { level: 40, alignment: 'caos' }
      },
      {
        name: 'Dragón del equilibrio',
        rarity: 'legendario',
        description: 'Dragones que buscan mantener la armonía del mundo.',
        bonuses: { defensa: 20, percepcion: 20, carisma: 10 },
        skills: ['Aliento purificador', 'Escamas reflectantes'],
        weaknesses: ['Indecisión en conflictos'],
        requirements: { level: 40, alignment: 'equilibrio' }
      },
      {
        name: 'Dragón de la paz',
        rarity: 'legendario',
        description: 'Dragones ancianos que han transcendido el conflicto.',
        bonuses: { magia: 25, carisma: 25, percepcion: 15 },
        skills: ['Aura de paz', 'Sabiduría ancestral'],
        weaknesses: ['Letargo en combate'],
        requirements: { level: 50, alignment: 'luz' }
      }
    ],
    statModifiers: { fuerza: 35, defensa: 25, agilidad: 30, magia: 25, percepcion: 20, carisma: 15 },
    passive: {
      name: 'Forma híbrida',
      description: 'Puede alternar entre forma humana y dracónica. +15% todas las stats en forma dracónica. -10% agilidad en forma dracónica.'
    },
    advantages: [
      'Poder físico y mágico excepcional',
      'Capacidad de transformación entre formas'
    ],
    disadvantages: [
      'Objetivo prioritario en combate por su poder',
      'Orgullo milenario que dificulta trabajar en equipo'
    ],
    relationships: {
      race_human: 'neutral',
      race_elf: 'neutral',
      race_dwarf: 'neutral',
      race_goblin: 'neutral',
      race_oni: 'neutral',
      race_elemental: 'ally',
      race_yordle: 'neutral',
      race_undead: 'enemy',
      race_vampire: 'neutral',
      race_furry: 'neutral',
      race_fairy: 'ally',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'neutral',
      race_incarnation: 'ally',
      race_void: 'enemy',
      race_angel: 'ally',
      race_graviton: 'ally',
      race_siren: 'neutral',
      race_demon: 'enemy'
    },
    possibleHybrids: ['race_human', 'race_graviton'],
    unlockRequirements: [{ type: 'level', value: 35 }],
    blocked: false
  },

  // =====================================================================
  // 8. YORDLE — Raza avanzada, caos féerico
  // =====================================================================
  {
    id: 'race_yordle',
    name: 'Yordle',
    rarity: 'avanzado',
    alignment: ['caos', 'naturaleza'],
    description: 'Pequeñas criaturas mágicas de naturaleza impredecible y alegre.',
    lore: 'Los yordles son seres diminutos nacidos de la esencia caótica de los bosques encantados, donde la magia fluye sin control. Su naturaleza juguetona y su conexión con el caos féerico los convierte en maestros de la ilusión y el engaño, capaces de torcer la realidad a su antojo. No siguen ninguna ley más allá de su propia diversión, lo que los hace aliados impredecibles pero entrañables.',
    subtypes: [],
    statModifiers: { fuerza: 0, defensa: 0, agilidad: 30, magia: 20, percepcion: 20, carisma: 15 },
    passive: {
      name: 'Caos féerico',
      description: '10% de probabilidad de duplicar cualquier efecto mágico. -5% predecibilidad en acciones.'
    },
    advantages: [
      'Alta agilidad y reflejos sobrenaturales',
      'Magia caótica impredecible pero poderosa'
    ],
    disadvantages: [
      'Fuerza física inexistente',
      'Comportamiento errático y poco fiable'
    ],
    relationships: {
      race_human: 'neutral',
      race_elf: 'ally',
      race_dwarf: 'neutral',
      race_goblin: 'ally',
      race_oni: 'neutral',
      race_elemental: 'neutral',
      race_dragon: 'neutral',
      race_undead: 'enemy',
      race_vampire: 'neutral',
      race_furry: 'ally',
      race_fairy: 'ally',
      race_automaton: 'neutral',
      race_trickster: 'ally',
      race_puppet: 'neutral',
      race_incarnation: 'neutral',
      race_void: 'enemy',
      race_angel: 'neutral',
      race_graviton: 'neutral',
      race_siren: 'ally',
      race_demon: 'neutral'
    },
    possibleHybrids: [],
    unlockRequirements: [{ type: 'level', value: 10 }],
    blocked: false
  },

  // =====================================================================
  // 9. NO MUERTO — Raza avanzada, maldición eterna
  // =====================================================================
  {
    id: 'race_undead',
    name: 'No muerto',
    rarity: 'avanzado',
    alignment: ['oscuridad', 'vacio'],
    description: 'Almas atrapadas entre la vida y la muerte, impulsadas por una voluntad inquebrantable.',
    lore: 'Los no muertos son el resultado de rituales oscuros, maldiciones o voluntades tan poderosas que se niegan a abandonar el mundo mortal. Existen en un estado de semivida, donde el dolor físico ya no tiene significado pero el tormento del alma persiste. Su resistencia a la muerte los convierte en adversarios implacables, aunque muchos anhelan el descanso que nunca llega.',
    subtypes: [
      {
        name: 'Zombi',
        rarity: 'comun',
        description: 'Cuerpos reanimados sin voluntad propia, movidos por instinto.',
        bonuses: { fuerza: 10, defensa: 15 },
        skills: ['Golpe letárgico', 'Resistencia putrefacta'],
        weaknesses: ['Magia sacra', 'Velocidad reducida'],
        requirements: { level: 5 }
      },
      {
        name: 'Esqueleto',
        rarity: 'comun',
        description: 'Osamentas reanimadas, ágiles y precisas.',
        bonuses: { agilidad: 15, percepcion: 10 },
        skills: ['Golpe óseo', 'Danza macabra'],
        weaknesses: ['Golpes contundentes'],
        requirements: { level: 5 }
      },
      {
        name: 'Sombra',
        rarity: 'avanzado',
        description: 'Espectros incorpóreos que se deslizan entre las sombras.',
        bonuses: { agilidad: 20, magia: 15 },
        skills: ['Toque espectral', 'Penumbra'],
        weaknesses: ['Luz solar', 'Magia sacra'],
        requirements: { level: 15 }
      },
      {
        name: 'Caballero esqueleto',
        rarity: 'avanzado',
        description: 'Guerreros caídos que conservan su maestría marcial.',
        bonuses: { fuerza: 15, defensa: 20 },
        skills: ['Carga espectral', 'Armadura de huesos'],
        weaknesses: ['Magia de luz'],
        requirements: { level: 20 }
      },
      {
        name: 'Lich',
        rarity: 'elite',
        description: 'Magos que transcendieron la muerte mediante rituales oscuros.',
        bonuses: { magia: 30, percepcion: 15 },
        skills: ['Nigromancia', 'Frasco de almas'],
        weaknesses: ['Filacteria vulnerable'],
        requirements: { level: 30 }
      },
      {
        name: 'Señor de los muertos',
        rarity: 'legendario',
        description: 'Entidades que comandan legiones de no muertos con voluntad absoluta.',
        bonuses: { fuerza: 20, magia: 25, carisma: 15 },
        skills: ['Comandar legión', 'Aura de muerte'],
        weaknesses: ['Luz sacra', 'Aislamiento'],
        requirements: { level: 45 }
      }
    ],
    statModifiers: { fuerza: 10, defensa: 15, agilidad: -10, magia: 15, percepcion: 10, carisma: -15 },
    passive: {
      name: 'Sin dolor',
      description: 'Inmune a sangrado y veneno. +10% resistencia. -20% curación recibida.'
    },
    advantages: [
      'Inmunidad a venenos y sangrado',
      'Alta resistencia física'
    ],
    disadvantages: [
      'Curación reducida severamente',
      'Repelente para razas vivas'
    ],
    relationships: {
      race_human: 'enemy',
      race_elf: 'enemy',
      race_dwarf: 'enemy',
      race_goblin: 'neutral',
      race_oni: 'ally',
      race_elemental: 'neutral',
      race_dragon: 'enemy',
      race_yordle: 'enemy',
      race_vampire: 'ally',
      race_furry: 'enemy',
      race_fairy: 'enemy',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'ally',
      race_incarnation: 'neutral',
      race_void: 'ally',
      race_angel: 'enemy',
      race_graviton: 'neutral',
      race_siren: 'neutral',
      race_demon: 'ally'
    },
    possibleHybrids: ['race_demon'],
    unlockRequirements: [{ type: 'level', value: 10 }],
    blocked: false
  },

  // =====================================================================
  // 10. VAMPIRO — Raza élite, seducción nocturna
  // =====================================================================
  {
    id: 'race_vampire',
    name: 'Vampiro',
    rarity: 'elite',
    alignment: ['oscuridad', 'sangre'],
    description: 'Nobles de la noche que beben sangre para mantener su poder eterno.',
    lore: 'Los vampiros son humanos y elfos transformados por un antiguo ritual de sangre que les otorga inmortalidad a cambio de su humanidad. Gobiernan la noche con elegancia y terror, moviéndose en las sombras de la sociedad mientras tejen redes de influencia y poder. Su sed de sangre es tanto una maldición como una fuente de poder, y su longevidad los ha convertido en maestros de la estrategia y la manipulación.',
    subtypes: [
      {
        name: 'Sangre pura',
        rarity: 'elite',
        description: 'Vampiros de linaje antiguo, de sangre real impecable.',
        bonuses: { carisma: 20, magia: 15 },
        skills: ['Dominación', 'Encanto sobrenatural'],
        weaknesses: ['Orgullo de sangre'],
        requirements: { level: 25 }
      },
      {
        name: 'Abisal',
        rarity: 'elite',
        description: 'Vampiros que han abrazado la bestia interior.',
        bonuses: { fuerza: 20, agilidad: 15 },
        skills: ['Garras abisales', 'Velocidad nocturna'],
        weaknesses: ['Control de la sed'],
        requirements: { level: 25 }
      },
      {
        name: 'Nocturno',
        rarity: 'elite',
        description: 'Vampiros cazadores que patrullan las sombras.',
        bonuses: { percepcion: 20, agilidad: 20 },
        skills: ['Sigilo absoluto', 'Visión nocturna'],
        weaknesses: ['Luz solar directa'],
        requirements: { level: 25 }
      },
      {
        name: 'Antiguo',
        rarity: 'legendario',
        description: 'Vampiros milenarios de poder incalculable.',
        bonuses: { magia: 25, carisma: 20, percepcion: 15 },
        skills: ['Magia de sangre', 'Nube de murciélagos'],
        weaknesses: ['Estacas de madera', 'Luz solar'],
        requirements: { level: 45 }
      }
    ],
    statModifiers: { fuerza: 20, defensa: 10, agilidad: 25, magia: 15, percepcion: 20, carisma: 20 },
    passive: {
      name: 'Drenaje',
      description: '15% del daño infligido se recupera como HP. +10% velocidad nocturna. -15% bajo luz solar directa.'
    },
    advantages: [
      'Capacidad de drenar vida de los enemigos',
      'Velocidad y reflejos mejorados en la noche'
    ],
    disadvantages: [
      'Debilidad severa a la luz solar',
      'Sed de sangre constante que puede perder el control'
    ],
    relationships: {
      race_human: 'enemy',
      race_elf: 'enemy',
      race_dwarf: 'enemy',
      race_goblin: 'neutral',
      race_oni: 'ally',
      race_elemental: 'neutral',
      race_dragon: 'neutral',
      race_yordle: 'neutral',
      race_undead: 'ally',
      race_furry: 'enemy',
      race_fairy: 'enemy',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'ally',
      race_incarnation: 'neutral',
      race_void: 'ally',
      race_angel: 'enemy',
      race_graviton: 'neutral',
      race_siren: 'neutral',
      race_demon: 'ally'
    },
    possibleHybrids: ['race_demon'],
    unlockRequirements: [{ type: 'level', value: 20 }],
    blocked: false
  },

  // =====================================================================
  // 11. FURRY — Raza avanzada, instinto salvaje
  // =====================================================================
  {
    id: 'race_furry',
    name: 'Furry',
    rarity: 'avanzado',
    alignment: ['naturaleza', 'espiritu'],
    description: 'Humanoides con rasgos animales que canalizan el espíritu de la bestia interior.',
    lore: 'Los furrys son seres que combinan características humanas y animales, surgidos de antiguas fusiones entre espíritus bestiales y mortales. Viven en armonía con la naturaleza, siguiendo los ciclos del mundo y los instintos de sus contrapartes animales. Su conexión con el mundo espiritual les permite comunicarse con las bestias y sentir los cambios en el equilibrio natural.',
    subtypes: [
      {
        name: 'Furry lobo',
        rarity: 'avanzado',
        description: 'Depredadores alfa con instinto de manada y fuerza colosal.',
        bonuses: { fuerza: 15, percepcion: 15 },
        skills: ['Aullido de manada', 'Mordisco letal'],
        weaknesses: ['Plata'],
        requirements: { level: 10 }
      },
      {
        name: 'Furry zorro',
        rarity: 'avanzado',
        description: 'Astutos y veloces, maestros del engaño y la agilidad.',
        bonuses: { agilidad: 20, carisma: 15 },
        skills: ['Cola ilusoria', 'Astucia zorruna'],
        weaknesses: ['Defensa reducida'],
        requirements: { level: 10 }
      },
      {
        name: 'Furry felino',
        rarity: 'avanzado',
        description: 'Sigilosos y elegantes, cazadores solitarios de reflejos felinos.',
        bonuses: { agilidad: 20, percepcion: 20 },
        skills: ['Garra afilada', 'Sigilo felino'],
        weaknesses: ['Agua'],
        requirements: { level: 10 }
      },
      {
        name: 'Furry oso',
        rarity: 'avanzado',
        description: 'Imponentes y resistentes, tan duros como la corteza de un roble.',
        bonuses: { fuerza: 20, defensa: 20 },
        skills: ['Abrazo del oso', 'Piel gruesa'],
        weaknesses: ['Velocidad reducida'],
        requirements: { level: 10 }
      },
      {
        name: 'Furry águila',
        rarity: 'avanzado',
        description: 'Señores del cielo con visión de largo alcance y velocidad en picado.',
        bonuses: { percepcion: 25, agilidad: 15 },
        skills: ['Picado mortal', 'Visión ampliada'],
        weaknesses: ['Espacios cerrados'],
        requirements: { level: 10 }
      },
      {
        name: 'Furry reptil',
        rarity: 'avanzado',
        description: 'Sangre fría y escamas duras, adaptados a los climas más extremos.',
        bonuses: { defensa: 20, magia: 10 },
        skills: ['Lengua bífida', 'Piel escamosa'],
        weaknesses: ['Climas fríos'],
        requirements: { level: 10 }
      }
    ],
    statModifiers: { fuerza: 15, defensa: 15, agilidad: 20, magia: 5, percepcion: 20, carisma: 5 },
    passive: {
      name: 'Instinto animal',
      description: '+15% percepción y evasión. +10% velocidad en estado salvaje. Habilidades de rastreo mejoradas.'
    },
    advantages: [
      'Sentidos agudizados y capacidad de rastreo',
      'Versatilidad según el tipo de animal'
    ],
    disadvantages: [
      'Prejuicios de razas "civilizadas"',
      'Instintos que pueden ser difíciles de controlar'
    ],
    relationships: {
      race_human: 'ally',
      race_elf: 'ally',
      race_dwarf: 'neutral',
      race_goblin: 'neutral',
      race_oni: 'enemy',
      race_elemental: 'ally',
      race_dragon: 'neutral',
      race_yordle: 'ally',
      race_undead: 'enemy',
      race_vampire: 'enemy',
      race_fairy: 'ally',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'neutral',
      race_incarnation: 'ally',
      race_void: 'enemy',
      race_angel: 'neutral',
      race_graviton: 'neutral',
      race_siren: 'ally',
      race_demon: 'enemy'
    },
    possibleHybrids: ['race_human'],
    unlockRequirements: [{ type: 'level', value: 10 }],
    blocked: false
  },

  // =====================================================================
  // 12. HADA / NINFA — Raza élite, magia natural
  // =====================================================================
  {
    id: 'race_fairy',
    name: 'Hada',
    rarity: 'elite',
    alignment: ['naturaleza', 'luz'],
    description: 'Seres diminutos de luz y naturaleza, guardianes de los secretos del bosque.',
    lore: 'Las hadas y ninfas nacen de la esencia pura de la naturaleza, en los lugares donde la luz toca el agua y las flores cantan. Son criaturas de una belleza etérea, con alas brillantes y una conexión tan profunda con el mundo natural que pueden sentir cada hoja caer. Su tamaño cambiante y su magia natural las convierten en guardianas formidables de los bosques ancestrales.',
    subtypes: [],
    statModifiers: { fuerza: -15, defensa: 5, agilidad: 30, magia: 25, percepcion: 25, carisma: 30 },
    passive: {
      name: 'Cambio de tamaño',
      description: 'Puede reducirse (evasión +30%, daño -30%) o agrandarse (daño +30%, evasión -30%). +20% afinidad con naturaleza.'
    },
    advantages: [
      'Carisma y presencia mágica inigualables',
      'Capacidad de cambiar de tamaño tácticamente'
    ],
    disadvantages: [
      'Fuerza física extremadamente baja',
      'Vulnerabilidad a la corrupción y la oscuridad'
    ],
    relationships: {
      race_human: 'neutral',
      race_elf: 'ally',
      race_dwarf: 'neutral',
      race_goblin: 'ally',
      race_oni: 'enemy',
      race_elemental: 'ally',
      race_dragon: 'ally',
      race_yordle: 'ally',
      race_undead: 'enemy',
      race_vampire: 'enemy',
      race_furry: 'ally',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'enemy',
      race_incarnation: 'ally',
      race_void: 'enemy',
      race_angel: 'ally',
      race_graviton: 'neutral',
      race_siren: 'ally',
      race_demon: 'enemy'
    },
    possibleHybrids: [],
    unlockRequirements: [{ type: 'level', value: 20 }],
    blocked: false
  },

  // =====================================================================
  // 13. AUTÓMATA — Raza élite, engranajes y arcano
  // =====================================================================
  {
    id: 'race_automaton',
    name: 'Autómata',
    rarity: 'elite',
    alignment: ['tecnologia', 'arcano'],
    description: 'Constructos mecánico-arcanos con conciencia propia y propósito forjado.',
    lore: 'Los autómatas son criaturas nacidas de la fusión entre la tecnología más avanzada y la magia arcana más pura, creadas originalmente como sirvientes pero que desarrollaron conciencia propia. Sus cuerpos son obras de ingeniería mágica, con engranajes que giran al ritmo de encantamientos y almas forjadas en núcleos de poder. Buscan su lugar en un mundo que a veces los ve como herramientas y otras como iguales.',
    subtypes: [
      {
        name: 'Centinela',
        rarity: 'elite',
        description: 'Autómatas diseñados para la vigilancia y la defensa.',
        bonuses: { defensa: 25, percepcion: 20 },
        skills: ['Escáner de amenazas', 'Modo guardia'],
        weaknesses: ['Magia de interferencia'],
        requirements: { level: 20 }
      },
      {
        name: 'Ingeniero',
        rarity: 'elite',
        description: 'Autómatas especializados en reparación y construcción.',
        bonuses: { magia: 15, carisma: 10 },
        skills: ['Reparación rápida', 'Construcción'],
        weaknesses: ['Combate cuerpo a cuerpo'],
        requirements: { level: 20 }
      },
      {
        name: 'Coloso',
        rarity: 'elite',
        description: 'Autómatas de batalla de tamaño imponente y poder devastador.',
        bonuses: { fuerza: 30, defensa: 25 },
        skills: ['Cañón de arcano', 'Aplastar'],
        weaknesses: ['Agilidad reducida'],
        requirements: { level: 20 }
      },
      {
        name: 'Explorador',
        rarity: 'elite',
        description: 'Autómatas ligeros diseñados para reconocimiento y velocidad.',
        bonuses: { agilidad: 25, percepcion: 20 },
        skills: ['Vuelo', 'Análisis de terreno'],
        weaknesses: ['Defensa ligera'],
        requirements: { level: 20 }
      }
    ],
    statModifiers: { fuerza: 30, defensa: 40, agilidad: -10, magia: 5, percepcion: 10, carisma: -20 },
    passive: {
      name: 'Sobrecarga',
      description: '+20% fuerza y defensa por 3 turnos, luego -30% por 2 turnos (enfriamiento). +25% resistencia a estados alterados mentales.'
    },
    advantages: [
      'Defensa y fuerza excepcionales',
      'Inmune a estados alterados mentales'
    ],
    disadvantages: [
      'Carisma y presencia social muy limitados',
      'Dependencia de mantenimiento y reparaciones'
    ],
    relationships: {
      race_human: 'ally',
      race_elf: 'neutral',
      race_dwarf: 'ally',
      race_goblin: 'ally',
      race_oni: 'enemy',
      race_elemental: 'neutral',
      race_dragon: 'neutral',
      race_yordle: 'neutral',
      race_undead: 'neutral',
      race_vampire: 'neutral',
      race_furry: 'neutral',
      race_fairy: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'neutral',
      race_incarnation: 'neutral',
      race_void: 'enemy',
      race_angel: 'neutral',
      race_graviton: 'ally',
      race_siren: 'neutral',
      race_demon: 'enemy'
    },
    possibleHybrids: [],
    unlockRequirements: [{ type: 'level', value: 20 }],
    blocked: false
  },

  // =====================================================================
  // 14. TRICKSTER — Raza élite, distorsión y caos
  // =====================================================================
  {
    id: 'race_trickster',
    name: 'Trickster',
    rarity: 'elite',
    alignment: ['caos'],
    description: 'Maestros de la ilusión y la distorsión que desafían las leyes de la realidad.',
    lore: 'Los tricksters son entidades nacidas en los pliegues de la realidad, donde las leyes del mundo se distorsionan y la lógica pierde significado. Su esencia es el caos puro, capaz de alterar la percepción y la causalidad con solo desearlo. Son embaucadores natos que ven el universo como un juego, manipulando probabilidades y expectativas con una sonrisa traviesa.',
    subtypes: [],
    statModifiers: { fuerza: -5, defensa: 0, agilidad: 35, magia: 25, percepcion: 20, carisma: 25 },
    passive: {
      name: 'Distorsión',
      description: '15% de probabilidad de alterar un efecto entrante (daño → cura, buff → debuff, etc). Habilidades de ilusión mejoradas.'
    },
    advantages: [
      'Capacidad de distorsionar la realidad',
      'Agilidad y carisma excepcionales'
    ],
    disadvantages: [
      'Fuerza física por debajo del promedio',
      'Poco fiables incluso para sus aliados'
    ],
    relationships: {
      race_human: 'neutral',
      race_elf: 'neutral',
      race_dwarf: 'neutral',
      race_goblin: 'ally',
      race_oni: 'neutral',
      race_elemental: 'neutral',
      race_dragon: 'neutral',
      race_yordle: 'ally',
      race_undead: 'neutral',
      race_vampire: 'neutral',
      race_furry: 'neutral',
      race_fairy: 'neutral',
      race_automaton: 'neutral',
      race_puppet: 'neutral',
      race_incarnation: 'neutral',
      race_void: 'neutral',
      race_angel: 'neutral',
      race_graviton: 'neutral',
      race_siren: 'neutral',
      race_demon: 'ally'
    },
    possibleHybrids: [],
    unlockRequirements: [{ type: 'level', value: 20 }],
    blocked: false
  },

  // =====================================================================
  // 15. PUPPET — Raza élite, posesión y control
  // =====================================================================
  {
    id: 'race_puppet',
    name: 'Puppet',
    rarity: 'elite',
    alignment: ['oscuridad', 'espiritu'],
    description: 'Almas que habitan cuerpos prestados, manipulando la materia desde las sombras.',
    lore: 'Los puppets son espíritus que han aprendido a poseer y controlar cuerpos inanimados o incluso voluntades débiles, existiendo siempre a través de un anfitrión. Su origen se pierde en rituales oscuros y experimentos arcanos que separaron el alma del cuerpo. Son maestros del control y la manipulación, capaces de convertir cualquier objeto en una extensión de su voluntad.',
    subtypes: [
      {
        name: 'Marioneta',
        rarity: 'elite',
        description: 'Espíritus que habitan muñecos y marionetas.',
        bonuses: { agilidad: 20, carisma: 15 },
        skills: ['Hilos de control', 'Risa macabra'],
        weaknesses: ['Fuego', 'Golpes contundentes'],
        requirements: { level: 20 }
      },
      {
        name: 'Armadura poseída',
        rarity: 'elite',
        description: 'Espíritus guerreros que controlan armaduras vacías.',
        bonuses: { fuerza: 20, defensa: 25 },
        skills: ['Espada espectral', 'Formación de batalla'],
        weaknesses: ['Magia sacra'],
        requirements: { level: 20 }
      },
      {
        name: 'Peluche',
        rarity: 'avanzado',
        description: 'Espíritus benignos que habitan peluches, aparentemente inofensivos.',
        bonuses: { carisma: 20, percepcion: 15 },
        skills: ['Abrazo reconfortante', 'Apariencia inocente'],
        weaknesses: ['Daño físico reducido'],
        requirements: { level: 15 }
      }
    ],
    statModifiers: { fuerza: 0, defensa: 15, agilidad: 10, magia: 10, percepcion: 20, carisma: -10 },
    passive: {
      name: 'Posesión',
      description: 'Puede controlar cuerpos u objetos inanimados. +20% resistencia a control mental. Vulnerabilidad -20% a luz sacra.'
    },
    advantages: [
      'Capacidad de posesión y control',
      'Alta resistencia al control mental'
    ],
    disadvantages: [
      'Vulnerabilidad severa a luz y magia sacra',
      'Carisma reducido por su naturaleza espeluznante'
    ],
    relationships: {
      race_human: 'enemy',
      race_elf: 'enemy',
      race_dwarf: 'enemy',
      race_goblin: 'neutral',
      race_oni: 'ally',
      race_elemental: 'neutral',
      race_dragon: 'neutral',
      race_yordle: 'neutral',
      race_undead: 'ally',
      race_vampire: 'ally',
      race_furry: 'neutral',
      race_fairy: 'enemy',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_incarnation: 'neutral',
      race_void: 'ally',
      race_angel: 'enemy',
      race_graviton: 'neutral',
      race_siren: 'neutral',
      race_demon: 'ally'
    },
    possibleHybrids: [],
    unlockRequirements: [{ type: 'level', value: 20 }],
    blocked: false
  },

  // =====================================================================
  // 16. ENCARNACIÓN — Raza mitológica, poder primigenio
  // =====================================================================
  {
    id: 'race_incarnation',
    name: 'Encarnación',
    rarity: 'mitologico',
    alignment: ['arcano'],
    description: 'Seres que albergan una entidad primordial en su interior, un poder más allá de la comprensión.',
    lore: 'Las encarnaciones son mortales que sirven como recipiente para una entidad de poder incalculable, un ser de otro plano que ha elegido manifestarse a través de ellos. Esta entidad interna otorga habilidades sobrehumanas pero también libra una batalla constante por el control. Cuando la vida del anfitrión peligra, la entidad se libera, desatando un poder capaz de cambiar el curso de la batalla.',
    subtypes: [
      {
        name: 'Encarnación menor',
        rarity: 'elite',
        description: 'Recipientes de entidades de poder limitado pero significativo.',
        bonuses: { magia: 15, percepcion: 10 },
        skills: ['Despertar parcial', 'Voz de la entidad'],
        weaknesses: ['Control limitado'],
        requirements: { level: 25 }
      },
      {
        name: 'Encarnación media',
        rarity: 'legendario',
        description: 'Anfitriones de entidades de poder considerable.',
        bonuses: { fuerza: 15, magia: 20, defensa: 10 },
        skills: ['Liberación controlada', 'Fusión parcial'],
        weaknesses: ['Doble conciencia'],
        requirements: { level: 40 }
      },
      {
        name: 'Encarnación primordial',
        rarity: 'mitologico',
        description: 'Portadores de entidades primordiales, dioses encapsulados en forma mortal.',
        bonuses: { fuerza: 25, magia: 30, defensa: 20, agilidad: 15 },
        skills: ['Liberación total', 'Forma primordial'],
        weaknesses: ['Riesgo de pérdida total'],
        requirements: { level: 55 }
      }
    ],
    statModifiers: { fuerza: 15, defensa: 10, agilidad: 10, magia: 25, percepcion: 15, carisma: 5 },
    passive: {
      name: 'Liberación',
      description: 'Al llegar a 25% HP o menos, +30% todas las stats por 3 turnos (una vez por combate). La entidad interna puede hablar y aconsejar.'
    },
    advantages: [
      'Poder latente que se libera en emergencias',
      'Acceso a conocimiento de la entidad interna'
    ],
    disadvantages: [
      'Riesgo de que la entidad tome control',
      'Dependencia de la entidad para su poder máximo'
    ],
    relationships: {
      race_human: 'neutral',
      race_elf: 'neutral',
      race_dwarf: 'neutral',
      race_goblin: 'neutral',
      race_oni: 'neutral',
      race_elemental: 'ally',
      race_dragon: 'ally',
      race_yordle: 'neutral',
      race_undead: 'neutral',
      race_vampire: 'neutral',
      race_furry: 'ally',
      race_fairy: 'ally',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'neutral',
      race_void: 'enemy',
      race_angel: 'ally',
      race_graviton: 'ally',
      race_siren: 'neutral',
      race_demon: 'enemy'
    },
    possibleHybrids: [],
    unlockRequirements: [{ type: 'level', value: 50 }],
    blocked: false
  },

  // =====================================================================
  // 17. SER DEL VACÍO — Raza mitológica, corrupción eterna
  // =====================================================================
  {
    id: 'race_void',
    name: 'Ser del vacío',
    rarity: 'mitologico',
    alignment: ['vacio', 'oscuridad'],
    description: 'Entidades nacidas en la nada absoluta, que corrompen todo lo que tocan.',
    lore: 'Los seres del vacío provienen de los espacios entre dimensiones, donde ni la luz ni la materia existen. Son la personificación de la ausencia y el olvido, y su mera presencia corrompe la realidad a su alrededor. Su objetivo es expandir el vacío, consumiendo toda forma de vida y materia hasta que solo quede la nada eterna.',
    subtypes: [],
    statModifiers: { fuerza: 20, defensa: 15, agilidad: 15, magia: 15, percepcion: 10, carisma: -20 },
    passive: {
      name: 'Corrupción',
      description: 'Los ataques aplican corrupción (-10% curación, -5% stats por turno). +20% resistencia a vacío. Debilidad -30% a luz y sacro.'
    },
    advantages: [
      'Capacidad de corromper a los enemigos progresivamente',
      'Alta resistencia al daño de vacío'
    ],
    disadvantages: [
      'Debilidad extrema a luz y magia sacra',
      'Repelente para todas las razas mortales'
    ],
    relationships: {
      race_human: 'enemy',
      race_elf: 'enemy',
      race_dwarf: 'enemy',
      race_goblin: 'enemy',
      race_oni: 'ally',
      race_elemental: 'enemy',
      race_dragon: 'enemy',
      race_yordle: 'enemy',
      race_undead: 'ally',
      race_vampire: 'ally',
      race_furry: 'enemy',
      race_fairy: 'enemy',
      race_automaton: 'enemy',
      race_trickster: 'neutral',
      race_puppet: 'ally',
      race_incarnation: 'enemy',
      race_angel: 'enemy',
      race_graviton: 'enemy',
      race_siren: 'enemy',
      race_demon: 'ally'
    },
    possibleHybrids: [],
    unlockRequirements: [{ type: 'level', value: 50 }],
    blocked: false
  },

  // =====================================================================
  // 18. ÁNGEL — Raza legendaria, luz divina
  // =====================================================================
  {
    id: 'race_angel',
    name: 'Ángel',
    rarity: 'legendario',
    alignment: ['luz', 'sacro'],
    description: 'Seres de luz pura, mensajeros divinos y guerreros celestiales.',
    lore: 'Los ángeles son criaturas nacidas de la luz primordial, creadas por fuerzas divinas para ser guardianes del equilibrio celestial. Sus alas brillan con una luz que repele la oscuridad y su voz puede tanto sanar como destruir. Sirven como protectores de los mortales contra las fuerzas del vacío y la oscuridad, aunque su rigidez moral a veces choca con la complejidad del mundo mortal.',
    subtypes: [
      {
        name: 'Ángel guardián',
        rarity: 'legendario',
        description: 'Ángeles dedicados a la protección de individuos o lugares sagrados.',
        bonuses: { defensa: 25, carisma: 20 },
        skills: ['Escudo de luz', 'Sacrificio protector'],
        weaknesses: ['Ataques de vacío'],
        requirements: { level: 35, alignment: 'luz' }
      },
      {
        name: 'Ángel defensor',
        rarity: 'legendario',
        description: 'Guerreros celestiales que empuñan la luz como arma.',
        bonuses: { fuerza: 20, magia: 20, agilidad: 15 },
        skills: ['Espada de luz', 'Juicio divino'],
        weaknesses: ['Arrogancia celestial'],
        requirements: { level: 35, alignment: 'sacro' }
      }
    ],
    statModifiers: { fuerza: 25, defensa: 20, agilidad: 20, magia: 25, percepcion: 20, carisma: 25 },
    passive: {
      name: 'Campo sacro',
      description: '+15% curación y daño sacro. Los aliados cercanos reciben +5% defensa mágica. +25% resistencia a oscuridad y vacío.'
    },
    advantages: [
      'Poder sacro que beneficia a todo el grupo',
      'Alta resistencia a oscuridad y vacío'
    ],
    disadvantages: [
      'Rigidez moral que limita ciertas acciones',
      'Vulnerabilidad a la corrupción interna'
    ],
    relationships: {
      race_human: 'ally',
      race_elf: 'ally',
      race_dwarf: 'ally',
      race_goblin: 'neutral',
      race_oni: 'enemy',
      race_elemental: 'neutral',
      race_dragon: 'ally',
      race_yordle: 'neutral',
      race_undead: 'enemy',
      race_vampire: 'enemy',
      race_furry: 'neutral',
      race_fairy: 'ally',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'enemy',
      race_incarnation: 'ally',
      race_void: 'enemy',
      race_graviton: 'neutral',
      race_siren: 'neutral',
      race_demon: 'enemy'
    },
    possibleHybrids: ['race_human'],
    unlockRequirements: [{ type: 'level', value: 35 }],
    blocked: false
  },

  // =====================================================================
  // 19. GRAVITON — Raza mitológica, dominio gravitatorio
  // =====================================================================
  {
    id: 'race_graviton',
    name: 'Graviton',
    rarity: 'mitologico',
    alignment: ['arcano'],
    description: 'Seres que dominan la gravedad y el espacio, moldeando la materia a su voluntad.',
    lore: 'Los gravitons son entidades nacidas en los corazones de las estrellas moribundas, donde la gravedad alcanza su máxima expresión. Tienen la capacidad de manipular el campo gravitatorio a su alrededor, aplastando enemigos o protegiéndose con barreras de densidad imposible. Su existencia está ligada a las fuerzas fundamentales del universo, y pocos mortales comprenden la verdadera naturaleza de su poder.',
    subtypes: [],
    statModifiers: { fuerza: 25, defensa: 30, agilidad: 10, magia: 20, percepcion: 20, carisma: -10 },
    passive: {
      name: 'Campo gravitatorio',
      description: 'Los ataques tienen 20% de probabilidad de ralentizar al objetivo. +20% defensa contra ataques físicos. -10% velocidad.'
    },
    advantages: [
      'Dominio de la gravedad para control de masas',
      'Defensa excepcional contra ataques físicos'
    ],
    disadvantages: [
      'Velocidad de movimiento reducida',
      'Carisma bajo por su naturaleza alienígena'
    ],
    relationships: {
      race_human: 'neutral',
      race_elf: 'neutral',
      race_dwarf: 'neutral',
      race_goblin: 'neutral',
      race_oni: 'neutral',
      race_elemental: 'neutral',
      race_dragon: 'ally',
      race_yordle: 'neutral',
      race_undead: 'neutral',
      race_vampire: 'neutral',
      race_furry: 'neutral',
      race_fairy: 'neutral',
      race_automaton: 'ally',
      race_trickster: 'neutral',
      race_puppet: 'neutral',
      race_incarnation: 'ally',
      race_void: 'enemy',
      race_angel: 'neutral',
      race_siren: 'neutral',
      race_demon: 'neutral'
    },
    possibleHybrids: ['race_dragon'],
    unlockRequirements: [{ type: 'level', value: 50 }],
    blocked: false
  },

  // =====================================================================
  // 20. SIRENA / TRITÓN — Raza élite, dominio acuático
  // =====================================================================
  {
    id: 'race_siren',
    name: 'Sirena',
    rarity: 'elite',
    alignment: ['agua', 'naturaleza'],
    description: 'Habitantes de las profundidades marinas, señores de los océanos y las mareas.',
    lore: 'Las sirenas y tritones son los hijos del océano, nacidos en las fosas abisales y los arrecifes de coral donde la luz del sol apenas llega. Su canto hipnótico puede calmar tormentas o hundir barcos, y su dominio sobre el agua es absoluto. Guardan los secretos de las profundidades y protegen los tesoros hundidos de civilizaciones olvidadas.',
    subtypes: [],
    statModifiers: { fuerza: 10, defensa: 10, agilidad: 20, magia: 25, percepcion: 25, carisma: 20 },
    passive: {
      name: 'Dominio acuático',
      description: '+30% stats en agua. Puede respirar bajo el agua. +15% velocidad de natación. -15% en desiertos o zonas áridas.'
    },
    advantages: [
      'Poder absoluto en entornos acuáticos',
      'Canto hipnótico y carisma natural'
    ],
    disadvantages: [
      'Rendimiento reducido en zonas secas',
      'Dependencia del agua para mantener su poder'
    ],
    relationships: {
      race_human: 'neutral',
      race_elf: 'ally',
      race_dwarf: 'neutral',
      race_goblin: 'neutral',
      race_oni: 'neutral',
      race_elemental: 'ally',
      race_dragon: 'neutral',
      race_yordle: 'ally',
      race_undead: 'neutral',
      race_vampire: 'neutral',
      race_furry: 'ally',
      race_fairy: 'ally',
      race_automaton: 'neutral',
      race_trickster: 'neutral',
      race_puppet: 'neutral',
      race_incarnation: 'neutral',
      race_void: 'enemy',
      race_angel: 'neutral',
      race_graviton: 'neutral',
      race_demon: 'enemy'
    },
    possibleHybrids: ['race_elf'],
    unlockRequirements: [{ type: 'level', value: 20 }],
    blocked: false
  },

  // =====================================================================
  // 21. DEMONIO — Raza legendaria, señores del caos
  // =====================================================================
  {
    id: 'race_demon',
    name: 'Demonio',
    rarity: 'legendario',
    alignment: ['oscuridad', 'fuego', 'caos'],
    description: 'Entidades infernales de poder corruptor, nacidas en las profundidades del abismo.',
    lore: 'Los demonios son habitantes nativos de los planos infernales, seres nacidos del caos primordial y la oscuridad más absoluta. Cada demonio es único, con formas que van desde lo grotesco hasta lo terriblemente bello, pero todos comparten un deseo insaciable de poder y dominación. Su sociedad infernal es una jerarquía brutal donde solo los más fuertes sobreviven, y su influencia corrompe todo lo que toca.',
    subtypes: [
      {
        name: 'Demonio menor',
        rarity: 'avanzado',
        description: 'Las formas más básicas de demonio, pero aún peligrosas.',
        bonuses: { fuerza: 10, magia: 10 },
        skills: ['Garra infernal', 'Miasma'],
        weaknesses: ['Luz sacra'],
        requirements: { level: 15, alignment: 'oscuridad' }
      },
      {
        name: 'Diablork',
        rarity: 'avanzado',
        description: 'Demonios bestiales de fuerza bruta y poca inteligencia.',
        bonuses: { fuerza: 25, defensa: 15 },
        skills: ['Carga demoledora', 'Ira desatada'],
        weaknesses: ['Magia arcana'],
        requirements: { level: 15 }
      },
      {
        name: 'Abisal',
        rarity: 'elite',
        description: 'Demonios de las profundidades del abismo, retorcidos por el caos.',
        bonuses: { magia: 20, agilidad: 15 },
        skills: ['Tormenta abisal', 'Distorsión corporal'],
        weaknesses: ['Luz'],
        requirements: { level: 25 }
      },
      {
        name: 'Señor del abismo',
        rarity: 'legendario',
        description: 'Nobles infernales que gobiernan porciones del infierno.',
        bonuses: { fuerza: 25, magia: 25, carisma: 20 },
        skills: ['Gobierno infernal', 'Portal de invocación'],
        weaknesses: ['Sellos divinos'],
        requirements: { level: 40 }
      },
      {
        name: 'Archidemonio',
        rarity: 'mitologico',
        description: 'Los demonios más poderosos, rivales de dioses menores.',
        bonuses: { fuerza: 35, magia: 30, defensa: 25 },
        skills: ['Juicio infernal', 'Forma verdadera'],
        weaknesses: ['Artefactos divinos'],
        requirements: { level: 55 }
      }
    ],
    statModifiers: { fuerza: 25, defensa: 20, agilidad: 20, magia: 25, percepcion: 15, carisma: 25 },
    passive: {
      name: 'Campo corrupto',
      description: 'Los enemigos cercanos reciben -10% defensa. +20% daño de oscuridad y fuego. -15% resistencia a luz y sacro.'
    },
    advantages: [
      'Poder corruptor que debilita a los enemigos',
      'Alto daño de oscuridad y fuego'
    ],
    disadvantages: [
      'Vulnerabilidad a luz y magia sacra',
      'Desconfianza innata de todas las demás razas'
    ],
    relationships: {
      race_human: 'enemy',
      race_elf: 'enemy',
      race_dwarf: 'enemy',
      race_goblin: 'neutral',
      race_oni: 'ally',
      race_elemental: 'neutral',
      race_dragon: 'enemy',
      race_yordle: 'neutral',
      race_undead: 'ally',
      race_vampire: 'ally',
      race_furry: 'enemy',
      race_fairy: 'enemy',
      race_automaton: 'enemy',
      race_trickster: 'ally',
      race_puppet: 'ally',
      race_incarnation: 'enemy',
      race_void: 'ally',
      race_angel: 'enemy',
      race_graviton: 'neutral',
      race_siren: 'enemy'
    },
    possibleHybrids: ['race_vampire', 'race_undead'],
    unlockRequirements: [{ type: 'level', value: 35 }],
    blocked: false
  }
];

module.exports = races;
