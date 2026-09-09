// @ts-nocheck
/**
 * Configuración central del sistema de tiendas y definición de NPCs comerciantes.
 */

const SHOPS = {
  bazar_nixia: {
    id: "bazar_nixia",
    name: "El Bazar Andante de Nixia",
    type: "npc",
    ownerId: "npc_nixia",
    npcName: "Nixia",
    npcTitle: "Andariega del Vacío · Deidad Primordial Menor",
    greeting: "¡Miau! Llegaste en buen momento, tengo la mochila recién reorganizada. ¿Ves algo que te guste?",
    items: [
      // ── Consumibles ──
      { itemId: "venda", basePrice: 100, baseStock: 15, variance: 0.1 },
      { itemId: "pocion", basePrice: 180, baseStock: 10, variance: 0.15 },
      { itemId: "tonico", basePrice: 280, baseStock: 5, variance: 0.2 },
      { itemId: "antidoto", basePrice: 200, baseStock: 8, variance: 0.1 },

      // ── Materiales Básicos de Forja (Tier E) ──
      { itemId: "trozo_de_madera", basePrice: 60, baseStock: 25, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "trozo_de_cuero", basePrice: 70, baseStock: 20, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "trozo_de_acero", basePrice: 120, baseStock: 15, variance: 0.15, metadata: { tier: "E" } },
      { itemId: "trozo_de_piedra", basePrice: 50, baseStock: 30, variance: 0.1, metadata: { tier: "E" } },

      // ── Contenedores de Magia ──
      { itemId: "pergamino", basePrice: 100, baseStock: 10, variance: 0.1 },
      { itemId: "libreta_desgastada", basePrice: 150, baseStock: 4, variance: 0.15 },
    ],
    // Artículos exóticos que Nixia encuentra en sus viajes y ofrece en días particulares:
    rotatingPool: [
      { itemId: "trozo_de_acero", basePrice: 320, baseStock: 3, variance: 0.2, metadata: { tier: "D" } },
      { itemId: "trozo_de_plata", basePrice: 360, baseStock: 2, variance: 0.2, metadata: { tier: "D" } },
      { itemId: "amuleto_de_acero", basePrice: 850, baseStock: 1, variance: 0.15, metadata: { tier: "E" } },
      { itemId: "trozo_de_cuarzo", basePrice: 290, baseStock: 3, variance: 0.2, metadata: { tier: "D" } },
    ],
    dialogues: {
      saludos: [
        "¡Ah, hola! Casi no te veo entre todo el polvo del camino. ¿Necesitas algo de mi mochila?",
        "*Bosteza estirando las orejas lentamente.* Oye, llevas aquí un rato parado. ¿Vas a mirar o prefieres que te cuente lo que tengo?",
        "¡Miau! Llegaste justo cuando estaba reorganizando mis cosas. Eso pasa siempre, ¿sabes? Alguien aparece justo en el momento más inconveniente. *Se ríe suavemente.* Aunque tampoco me molesta.",
        "No me mires así, que la mochila es más grande por dentro. Lo prometo. ¿Qué andas buscando?",
        "Hace tiempo que no veía a alguien por este camino. O a lo mejor sí y simplemente me quedé dormida. Igual, ¡bienvenido!",
        "Tengo cosas buenas hoy. Bueno, siempre tengo cosas buenas, pero hoy en particular me parece que está bien surtida.",
      ],
      lore: [
        "Las stelas... ¿sabes que cuando las sacudo en la palma suenan como campanitas? Y proyectan pequeños arcoíris si las pones al sol. Me gustan mucho. No sé quién las inventó pero fue una idea muy bonita.",
        "Los Primigenios eran... complicados. No los conocí, claro, yo soy hija de lo que quedó de ellos. Fragmentos, básicamente. Aunque eso no lo veo como algo malo. Los mosaicos también son bonitos.",
        "El Fulgor que canalizan ustedes cuando usan magia es lo que sobró de la Gran Purga. Es como... el eco de algo muy grande que se rompió. Yo también lo siento a veces, aunque de forma distinta. Me zumba en la cola cuando hay mucho acumulado cerca.",
        "¿El Árbol Élfico? Sí, lo conozco. Hablamos poco, pero nos reconocemos. Los dos somos hijos del mismo desastre, por decirlo de alguna manera. Él es más reservado que yo. Y más quieto, claro.",
        "Las prisiones arcanas de los Primigenios no duran para siempre. Nada dura para siempre. Eso lo aprendí hace tanto tiempo que no recuerdo cuándo. Aunque supongo que yo tampoco duraré para siempre, así que no es tan triste.",
        "Alguien me preguntó una vez si extrañaba a los que existieron antes que yo. La verdad... no sé si extrañar algo que nunca conocí. Es raro pensar en eso. *Se queda callada un momento.* ¿Tú extrañas cosas que no viviste?",
        "Hay lugares en el mundo donde el suelo todavía brilla de noche, restos de cuando los Primigenios cayeron aquí. Si alguna vez los encuentras, no los toques con las manos descubiertas. No porque sea peligroso necesariamente, sino porque mancha mucho y cuesta quitar.",
      ],
      consejos: [
        "Lleva vendas. Siempre. No importa cuánto confíes en tu resistencia, porque los colmillos venenosos no se fijan en eso.",
        "El cuero y la madera son más útiles de lo que parecen. El hierro quiebra bajo presión extrema; el cuero se dobla. A veces doblarse es mejor.",
        "Si tu cuerpo empieza a sentirse pesado en combate, para. En serio. Conozco a gente que pensó que podía aguantar un poco más y... bueno, ya no están para contarlo.",
        "Los antídotos son para antes de que duela mucho, no para después. Eso lo descubrí de la manera difícil hace... mucho. Mucho tiempo.",
        "Un pergamino de hechizo bien usado vale más que tres espadas. Aunque una espada también sirve de palo si se te rompe la hoja.",
        "Cuando cruces zonas desconocidas, busca primero agua dulce y sombra. El resto se improvisa. Lo que no se improvisa fácil es la deshidratación.",
        "La fatiga en combate acumula más rápido de lo que crees. Si puedes descansar, descansa. No es cobardía, es que mañana también hay pelea.",
        "¿Sabes qué es lo que más falla en la gente que entra sola a sitios peligrosos? No es la fuerza ni la magia. Es que no llevan a nadie que les avise cuando están cometiendo un error.",
      ],
    },
  },

  tienda_magia: {
    id: "tienda_magia",
    name: "El Santuario del Fulgor",
    type: "npc",
    ownerId: "npc_elidyr",
    npcName: "Maestro Elidyr",
    npcTitle: "Archivero de la Torre Silente",
    greeting:
      "Bienvenido al Santuario. Aquí tratamos la magia como ciencia y devoción. ¿Buscas dónde albergar tu Fulgor?",
    items: [
      // ── Contenedores de Hechizos ──
      { itemId: "pergamino", basePrice: 110, baseStock: 15, variance: 0.08 },
      { itemId: "libreta_desgastada", basePrice: 180, baseStock: 6, variance: 0.1 },
      // Grimorio (Tier Medio/Raro, precio elevado y stock muy escaso: máximo 1 por día)
      { itemId: "grimorio", basePrice: 2800, baseStock: 1, variance: 0.05 },

      // ── Focos Canalizadores Básicos (Tier E) ──
      { itemId: "varita_de_madera", basePrice: 220, baseStock: 5, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "baculo_de_madera", basePrice: 260, baseStock: 3, variance: 0.1, metadata: { tier: "E" } },

      // ── Materiales Mágicos Brutos para Alquimia/Forja ──
      { itemId: "trozo_de_madera", basePrice: 65, baseStock: 20, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "antidoto", basePrice: 190, baseStock: 6, variance: 0.1 },
    ],
    // Artículos arcanos rotativos de alta conducción:
    rotatingPool: [
      { itemId: "varita_de_plata", basePrice: 750, baseStock: 1, variance: 0.15, metadata: { tier: "D" } },
      { itemId: "baculo_de_plata", basePrice: 900, baseStock: 1, variance: 0.15, metadata: { tier: "D" } },
      { itemId: "trozo_de_plata", basePrice: 380, baseStock: 2, variance: 0.15, metadata: { tier: "D" } },
    ],
    dialogues: {
      saludos: [
        "Pasa con cuidado, los pergaminos no toleran la humedad ni las prisas.",
        "El Fulgor fluye en todo lo que respira. Saber contenerlo es la diferencia entre un sabio y una ceniza.",
        "¿Vienes a transcribir o a estudiar? El conocimiento tiene un precio, pero la ignorancia cuesta vidas.",
        "Silencio en las estanterías superiores, por favor. Algunos sellos arcanos son más sensibles de lo que aparentan.",
      ],
      lore: [
        "Un pergamino no es más que piel y tinta imbuida, pero alberga la voluntad de quien lo talló.",
        "Los grimorios antiguos se encuadernan con resinas alquímicas para soportar la presión del Fulgor concentrado. No son fáciles de fabricar.",
        "El Fulgor diluido ocurre cuando la voluntad del mago exige más energía de la que sus reservas corporales pueden generar sin descanso.",
        "Las deidades menores vagan sin rumbo aparente, pero hasta sus pasos erráticos siguen corrientes invisibles de éter.",
      ],
      consejos: [
        "Nunca entres a un combate contra bestias elementales sin un pergamino de respaldo de naturaleza opuesta.",
        "Una varita te permite maniobrar con un escudo en la mano libre; un báculo exige ambas manos pero su alcance es insuperable.",
        "Si notas que tu fulgor se agota, cambiar a un arma física de reserva es más sabio que insistir con hechizos diluidos.",
      ],
    },
  },

  herreria: {
    id: "herreria",
    name: "La Forja del Yunque Negro",
    type: "npc",
    ownerId: "npc_borin",
    npcName: "Borin Martillo-Férreo",
    npcTitle: "Maestro Forjador de la Cuenca",
    greeting:
      "¡Cierra esa puerta que entra corriente! Si vienes buscando chatarra barata, vete al bazar. Aquí se forja metal de verdad.",
    items: [
      // ── Armas Básicas de Hierro (Tier E) ──
      { itemId: "espada_de_acero", basePrice: 380, baseStock: 4, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "daga_de_acero", basePrice: 220, baseStock: 5, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "kunai_de_acero", basePrice: 65, baseStock: 25, variance: 0.1, metadata: { tier: "E" } },

      // ── Piezas de Armadura de Hierro (Tier E) ──
      { itemId: "casco_de_acero", basePrice: 210, baseStock: 3, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "pechera_de_acero", basePrice: 360, baseStock: 2, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "grebas_de_acero", basePrice: 230, baseStock: 3, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "botas_de_acero", basePrice: 170, baseStock: 4, variance: 0.1, metadata: { tier: "E" } },

      // ── Lingotes y Materiales Brutos ──
      { itemId: "trozo_de_acero", basePrice: 110, baseStock: 30, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "trozo_de_cuero", basePrice: 75, baseStock: 15, variance: 0.1, metadata: { tier: "E" } },
      { itemId: "trozo_de_piedra", basePrice: 45, baseStock: 35, variance: 0.08, metadata: { tier: "E" } },
    ],
    // Piezas especiales en lotes limitados que Borin saca según el día:
    rotatingPool: [
      { itemId: "espada_de_plata", basePrice: 850, baseStock: 1, variance: 0.15, metadata: { tier: "D" } },
      { itemId: "espada_de_oro", basePrice: 720, baseStock: 2, variance: 0.15, metadata: { tier: "D" } },
      { itemId: "pechera_de_plata", basePrice: 980, baseStock: 1, variance: 0.15, metadata: { tier: "D" } },
      { itemId: "trozo_de_plata", basePrice: 340, baseStock: 3, variance: 0.2, metadata: { tier: "D" } },
    ],
    dialogues: {
      saludos: [
        "*El martillo golpea con estruendo sobre el yunque incandescente.* ¿Qué quieres? El fuego no espera a nadie.",
        "Si buscas armas que no se doblen al primer mandoble, estás en el taller indicado.",
        "Mírame las manos: cicatrices de carbón y escoria. Eso es lo que garantiza que mi acero no te fallará.",
        "El peso de una buena coraza no es una carga, muchacho: es la diferencia entre respirar mañana o alimentar cuervos.",
      ],
      lore: [
        "El hierro común sirve para empezar, pero el acero templado y los minerales raros como el titanio o la obsidiana... eso es arte mayor.",
        "Dicen que en las montañas profundas aún quedan vetas de mineral pálido. Quien encuentre eso forjará leyendas.",
        "El metal tiene memoria. Si lo golpeas con ira se quiebra; si lo golpeas con pulso firme, se endurece.",
        "Nixia suele pasar por aquí a cambiarme clavos viejos por chucherías brillantes. Esa gata tiene más años que estas montañas, aunque actúe como una chiquilla.",
      ],
      consejos: [
        "Una pechera pesada te salvará la vida contra tajos, pero si no tienes la constitución para llevarla, la fatiga te ahogará en tres turnos.",
        "Cuida el filo de tu arma. Un golpe mellado hace la mitad de daño contra armaduras duras.",
        "Lleva siempre un par de kunais en el cinto. Cuando el enemigo intente retroceder, el hierro volador le recordará dónde está.",
      ],
    },
  },
};

module.exports = {
  SHOPS,
};
