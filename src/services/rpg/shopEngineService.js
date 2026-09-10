// @ts-nocheck
const { SHOPS } = require("../../config/shopConfig");
const { getItem } = require("../../data/items");
const characterService = require("../characterService");
const inventoryService = require("./inventoryService");
const economyService = require("../economyService");
const pricingService = require("./pricingService");

/**
 * Registro en memoria de compras diarias por usuario para limitar el stock personal.
 * Clave: `${dateStr}:${userId}:${shopId}:${itemId}` -> cantidad comprada hoy.
 * @type {Map<string, number>}
 */
const dailyUserPurchases = new Map();

/**
 * Genera un número pseudoaleatorio determinista entre 0 y 1 a partir de una semilla string.
 * Algoritmo cyrb53 + SplitMix32 para variación estable sin dependencias externas.
 * @param {string} seedStr
 * @returns {number} Float en rango [0, 1)
 */
function pseudoRandomFromSeed(seedStr) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c64e6d;
  for (let i = 0; i < seedStr.length; i++) {
    const ch = seedStr.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const val = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return (val % 1000000) / 1000000;
}

/**
 * Obtiene la fecha actual en formato ISO YYYY-MM-DD.
 * @param {Date} [d=new Date()]
 * @returns {string}
 */
function getTodayString(d = new Date()) {
  return d.toISOString().split("T")[0];
}

/**
 * Mapeo de alias amigables para seleccionar tiendas por palabra clave o número.
 */
const SHOP_ALIASES = {
  nixia: "bazar_nixia",
  bazar: "bazar_nixia",
  general: "bazar_nixia",
  1: "bazar_nixia",
  magia: "tienda_magia",
  arcano: "tienda_magia",
  santuario: "tienda_magia",
  elidyr: "tienda_magia",
  2: "tienda_magia",
  herreria: "herreria",
  forja: "herreria",
  armas: "herreria",
  borin: "herreria",
  3: "herreria",
};

/**
 * Normaliza y resuelve un identificador de tienda a partir de su ID o alias.
 * @param {string} [query]
 * @returns {string}
 */
function resolveShopId(query) {
  if (!query) return "bazar_nixia";
  const clean = String(query).trim().toLowerCase();
  if (SHOPS[clean]) return clean;
  if (SHOP_ALIASES[clean]) return SHOP_ALIASES[clean];
  return clean;
}

/**
 * Recupera la configuración base de una tienda.
 * @param {string} shopId
 * @returns {object|null}
 */
function getShopDefinition(shopId = "bazar_nixia") {
  const resolved = resolveShopId(shopId);
  return SHOPS[resolved] || null;
}

/**
 * Devuelve la lista de todas las tiendas disponibles.
 * @returns {Array<{id: string, name: string, npcName: string, npcTitle: string, type: string}>}
 */
function listShops() {
  return Object.values(SHOPS).map((shop, i) => ({
    index: i + 1,
    id: shop.id,
    name: shop.name,
    npcName: shop.npcName,
    npcTitle: shop.npcTitle,
    type: shop.type,
  }));
}

/**
 * Calcula el catálogo dinámico de una tienda para una fecha específica.
 * Varía levemente el precio y el stock diario de forma determinista.
 * @param {string} shopId
 * @param {string} [dateStr]
 * @returns {Array<object>}
 */
function getDailyCatalog(shopId = "bazar_nixia", dateStr = getTodayString()) {
  const shop = getShopDefinition(shopId);
  if (!shop) return [];

  const catalog = [];
  const baseItems = shop.items || [];
  const rotatingPool = shop.rotatingPool || [];

  // 1. Procesar catálogo base permanente (con soporte opcional de chance diario)
  for (const itemCfg of baseItems) {
    const seed = `${dateStr}:${shopId}:${itemCfg.itemId}`;
    const randRoll = pseudoRandomFromSeed(`${seed}:roll`);

    // Si tiene chance configurado (ej: 0.5) y no sale el roll, no aparece hoy
    if (typeof itemCfg.chance === "number" && randRoll > itemCfg.chance) {
      continue;
    }

    const randPrice = pseudoRandomFromSeed(`${seed}:price`);
    const randStock = pseudoRandomFromSeed(`${seed}:stock`);
    const itemDef = getItem(itemCfg.itemId);

    const variance = itemCfg.variance || 0.1;
    const priceDeltaMult = 1 + (randPrice * 2 - 1) * variance;
    const basePrice = pricingService.itemBasePrice(itemCfg.itemId, itemCfg.metadata?.tier || "E") ?? itemCfg.basePrice;
    const dailyPrice = Math.max(1, Math.round(basePrice * priceDeltaMult));

    const stockSpread = Math.round((randStock * 2 - 1) * (itemCfg.baseStock * 0.25));
    const dailyStock = Math.max(1, itemCfg.baseStock + stockSpread);

    catalog.push({
      itemId: itemCfg.itemId,
      name: itemDef?.name || itemCfg.itemId,
      description: itemDef?.description || "",
      categories: itemDef?.categories || [],
      price: dailyPrice,
      maxDailyStock: dailyStock,
      metadata: itemCfg.metadata || null,
      isSpecial: itemCfg.isSpecial || false,
    });
  }

  // 2. Procesar artículos rotativos raros/especiales (1 o 2 por día elegidos deterministamente)
  if (rotatingPool.length > 0) {
    const rotSeed = `${dateStr}:${shopId}:rotating`;
    const randChoice = pseudoRandomFromSeed(`${rotSeed}:choice`);
    const pickedIndex = Math.floor(randChoice * rotatingPool.length);
    const specialCfg = rotatingPool[pickedIndex];

    if (specialCfg && !catalog.some((c) => c.itemId === specialCfg.itemId)) {
      const itemDef = getItem(specialCfg.itemId);
      const randPrice = pseudoRandomFromSeed(`${rotSeed}:price`);
      const randStock = pseudoRandomFromSeed(`${rotSeed}:stock`);

      const variance = specialCfg.variance || 0.15;
      const priceDeltaMult = 1 + (randPrice * 2 - 1) * variance;
      const basePrice =
        pricingService.itemBasePrice(specialCfg.itemId, specialCfg.metadata?.tier || "E") ?? specialCfg.basePrice;
      const dailyPrice = Math.max(1, Math.round(basePrice * priceDeltaMult));

      const stockSpread = Math.round((randStock * 2 - 1) * (specialCfg.baseStock * 0.2));
      const dailyStock = Math.max(1, specialCfg.baseStock + stockSpread);

      catalog.push({
        itemId: specialCfg.itemId,
        name: itemDef?.name || specialCfg.itemId,
        description: itemDef?.description || "",
        categories: itemDef?.categories || [],
        price: dailyPrice,
        maxDailyStock: dailyStock,
        metadata: specialCfg.metadata || null,
        isSpecial: true,
      });
    }
  }

  // Asignar índices correlativos 1..N para interacción de compra sencilla
  return catalog.map((item, index) => ({
    index: index + 1,
    ...item,
  }));
}

/**
 * Obtiene el stock restante que le queda a un usuario para un ítem en una tienda y fecha.
 * @param {string} userId
 * @param {string} shopId
 * @param {string} itemId
 * @param {number} maxStock
 * @param {string} [dateStr]
 * @returns {number}
 */
function getRemainingStock(userId, shopId, itemId, maxStock, dateStr = getTodayString()) {
  const key = `${dateStr}:${userId}:${shopId}:${itemId}`;
  const bought = dailyUserPurchases.get(key) || 0;
  return Math.max(0, maxStock - bought);
}

/**
 * Registra unidades compradas por el usuario en el almacén de stock diario.
 * @param {string} userId
 * @param {string} shopId
 * @param {string} itemId
 * @param {number} quantity
 * @param {string} [dateStr]
 */
function recordDailyPurchase(userId, shopId, itemId, quantity, dateStr = getTodayString()) {
  const key = `${dateStr}:${userId}:${shopId}:${itemId}`;
  const current = dailyUserPurchases.get(key) || 0;
  dailyUserPurchases.set(key, current + quantity);
}

/**
 * Obtiene una línea de diálogo del NPC de la tienda.
 * @param {string} shopId
 * @param {'saludos'|'lore'|'consejos'} [category='saludos']
 * @returns {string}
 */
function getNpcDialogue(shopId = "bazar_nixia", category = "saludos") {
  const shop = getShopDefinition(shopId);
  if (!shop || !shop.dialogues) {
    return "El encargado asiente en silencio.";
  }
  const pool = shop.dialogues[category] || shop.dialogues.saludos || [];
  if (pool.length === 0) return shop.greeting || "...";
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Ejecuta la compra atómica de un ítem en la tienda para el personaje activo del usuario.
 * @param {object} params
 * @param {string} params.userId
 * @param {string} [params.shopId='bazar_nixia']
 * @param {string|number} params.itemKey - Índice numérico (1-based) o itemId
 * @param {number} [params.quantity=1]
 * @returns {Promise<{success: boolean, message?: string, error?: string, item?: object, quantity?: number, totalCost?: number, newBalance?: number, characterName?: string}>}
 */
async function executePurchase({ userId, shopId = "bazar_nixia", itemKey, quantity = 1 }) {
  const safeQty = Math.floor(Number(quantity) || 1);
  if (safeQty <= 0) {
    return { success: false, error: "❌ La cantidad a comprar debe ser al menos 1." };
  }

  // 1. Validar Personaje Activo
  const activeChar = await characterService.getActiveCharacter({ creatorId: userId });
  if (!activeChar) {
    return {
      success: false,
      error: "❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj` antes de comprar.",
    };
  }

  if (activeChar.slots?.activity) {
    const act = activeChar.slots.activity;
    return {
      success: false,
      error: `❌ Tu personaje está ocupado en: ${act.name || act.type}. No puedes visitar comercios hasta que regrese o canceles con /expedicion cancelar o /trabajar cancelar.`,
    };
  }

  // 2. Resolver catálogo y artículo solicitado
  const dateStr = getTodayString();
  const catalog = getDailyCatalog(shopId, dateStr);
  if (!catalog || catalog.length === 0) {
    return { success: false, error: "❌ La tienda no está disponible hoy." };
  }

  let catalogEntry = null;
  const numKey = Number(itemKey);
  if (!Number.isNaN(numKey) && numKey >= 1 && numKey <= catalog.length) {
    catalogEntry = catalog[numKey - 1];
  } else {
    const searchId = String(itemKey || "")
      .toLowerCase()
      .trim();
    catalogEntry = catalog.find((e) => e.itemId.toLowerCase() === searchId);
  }

  if (!catalogEntry) {
    return {
      success: false,
      error: `❌ No se encontró el artículo "${itemKey}" en la tienda. Revisa el catálogo con \`/tienda\`.`,
    };
  }

  // 3. Validar stock diario restante para el usuario
  const availableStock = getRemainingStock(userId, shopId, catalogEntry.itemId, catalogEntry.maxDailyStock, dateStr);
  if (availableStock < safeQty) {
    return {
      success: false,
      error: `❌ Stock insuficiente. Solo quedan **${availableStock}** unidades disponibles de **${catalogEntry.name}** hoy.`,
    };
  }

  const totalCost = catalogEntry.price * safeQty;

  // 4. Validar saldo del usuario
  const currentMoney = await economyService.getBalance(userId);
  if (currentMoney < totalCost) {
    return {
      success: false,
      error: `❌ No tienes suficientes stelas. Necesitas **✧ ${totalCost.toLocaleString()}** stelas pero solo tienes **✧ ${currentMoney.toLocaleString()}**.`,
    };
  }

  // 5. Validar capacidad del inventario del personaje
  const currentInv = await inventoryService.getInventory(activeChar.id);
  const itemDef = getItem(catalogEntry.itemId);
  const variantKey = inventoryService.getVariantKey(itemDef, catalogEntry.metadata);
  const existingSlot = currentInv.find(
    (slot) => slot.item_id === catalogEntry.itemId && (slot.variant_key || "legacy") === variantKey,
  );
  const maxSlots = await inventoryService.getMaxInventoryCapacity(activeChar.id);
  if (!existingSlot && currentInv.length >= maxSlots) {
    return {
      success: false,
      error: `❌ La mochila de **${activeChar.name}** está llena (${currentInv.length}/${maxSlots} slots). Desocupa espacio antes de comprar.`,
    };
  }

  // 6. Transacción atómica: removeMoney ya maneja withUserLock internamente (evita deadlock reentrante).
  // Cobrar stelas
  const newBalance = await economyService.removeMoney(userId, totalCost);

  // Otorgar ítem al personaje activo
  try {
    await inventoryService.addItem(activeChar.id, userId, catalogEntry.itemId, safeQty, catalogEntry.metadata);
  } catch (error) {
    try {
      await economyService.addMoney(userId, totalCost);
    } catch (refundError) {
      return {
        success: false,
        error: `❌ No se pudo entregar el ítem ni reembolsar las stelas. Contacta a un administrador: ${refundError.message}`,
      };
    }
    return { success: false, error: `❌ No se pudo entregar el ítem. Tus ${totalCost} stelas fueron reembolsadas.` };
  }

  // Registrar deducción de stock
  recordDailyPurchase(userId, shopId, catalogEntry.itemId, safeQty, dateStr);

  return {
    success: true,
    item: catalogEntry,
    quantity: safeQty,
    totalCost,
    newBalance,
    characterName: activeChar.name,
  };
}

module.exports = {
  getShopDefinition,
  resolveShopId,
  listShops,
  getDailyCatalog,
  getRemainingStock,
  getNpcDialogue,
  executePurchase,
  getTodayString,
  _internal: {
    dailyUserPurchases,
    pseudoRandomFromSeed,
  },
};
