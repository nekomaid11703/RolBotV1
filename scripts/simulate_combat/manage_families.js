#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * CLI de gestión de familias de ítems tester.
 *
 * Permite crear/borrar/editar familias y listar su configuración sin tocar el
 * catálogo real (los ítems son preview/tester, en memoria).
 *
 * Uso:
 *   node scripts/simulate_combat/manage_families.js list
 *   node scripts/simulate_combat/manage_families.js show <id>
 *   node scripts/simulate_combat/manage_families.js add <id> --name "..." --material hierro,titanio ...
 *   node scripts/simulate_combat/manage_families.js rm <id>
 *   node scripts/simulate_combat/manage_families.js edit <id> --material madera,cuero
 */

const {
  createFamily,
  removeFamily,
  editFamily,
  listFamilies,
  getFamily,
  materialName,
} = require("./familyGenerator");

function printUsage() {
  console.log(`
USAGE
  node scripts/simulate_combat/manage_families.js list
  node scripts/simulate_combat/manage_families.js show <id>
  node scripts/simulate_combat/manage_families.js add <id> [opciones]
  node scripts/simulate_combat/manage_families.js rm <id>
  node scripts/simulate_combat/manage_families.js edit <id> [opciones]

OPCIONES (add/edit)
  --name <texto>          Nombre legible de la familia
  --material <lista>      Materiales permitidos (ids separados por coma)
  --set <id>              setId para el bono de set (default: set_<id>)
  --weapon <naturaleza>   Añade un arma base al pool (cortante|perforante|contundente)
  --arco <daño>           Añade un arco al pool (daño nominal del proyectil)
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0) return { cmd: "help" };
  const cmd = args[0];
  const rest = args.slice(1);
  if (cmd === "list" || cmd === "help") return { cmd };
  if (cmd === "show" || cmd === "rm") return { cmd, id: rest[0] };
  if (cmd === "add" || cmd === "edit") {
    const opts = { id: rest[0] };
    for (let i = 1; i < rest.length; i++) {
      const key = rest[i].replace(/^--/, "");
      const val = rest[++i];
      if (!val) continue;
      if (key === "material") opts.materials = val.split(",").map((s) => s.trim()).filter(Boolean);
      else if (key === "name") opts.name = val;
      else if (key === "set") opts.setId = val;
      else if (key === "weapon") opts.weaponNature = val;
      else if (key === "arco") opts.arcoDamage = parseInt(val, 10);
    }
    return { cmd, opts };
  }
  return { cmd: "help" };
}

function describeWeapon(nat, arcoDamage) {
  if (nat === "perforante") {
    return { id: `espada_de_${nat}`, name: `Estoque ${nat}`, damageNature: "perforante", nominalDamage: 14, hands: 1, weaponRange: 1 };
  }
  if (nat === "contundente") {
    return { id: `maza_de_${nat}`, name: `Maza ${nat}`, damageNature: "contundente", nominalDamage: 22, hands: 1, weaponRange: 1 };
  }
  return { id: `espada_de_${nat}`, name: `Espada ${nat}`, damageNature: "cortante", nominalDamage: 20, hands: 1, weaponRange: 1 };
}

function showFamily(id) {
  const family = getFamily(id);
  if (!family) {
    console.error(`Familia "${id}" no existe`);
    process.exit(1);
  }
  console.log(`id: ${family.id}`);
  console.log(`name: ${family.name}`);
  console.log(`setId: ${family.setId}`);
  console.log(`materials: ${family.materials.map((m) => `${m} (${materialName(m)})`).join(", ")}`);
  console.log(`weaponPool: ${family.weaponPool.map((w) => `${w.id} (${w.damageNature})`).join(", ")}`);
  console.log(`armor slots: ${Object.keys(family.armorSlotBase || {}).join(", ")}`);
  console.log(`shield: ${family.shield?.id || "ninguno"}`);
  console.log(`amulet: ${family.amulet?.id || "ninguno"}`);
  console.log(`ammo: ${family.ammo?.id || "ninguno"}`);
}

function main() {
  const parsed = parseArgs(process.argv);
  switch (parsed.cmd) {
    case "help":
      printUsage();
      break;
    case "list":
      for (const id of listFamilies()) {
        const f = getFamily(id);
        console.log(`${id}\t${f?.name || ""}`);
      }
      break;
    case "show":
      showFamily(parsed.id);
      break;
    case "rm": {
      if (removeFamily(parsed.id)) console.log(`Familia "${parsed.id}" eliminada`);
      else {
        console.error(`No se pudo eliminar la familia "${parsed.id}"`);
        process.exit(1);
      }
      break;
    }
    case "add": {
      const { id, name, materials, setId, weaponNature, arcoDamage } = parsed.opts;
      if (!id || !materials || materials.length === 0) {
        console.error("add requiere <id> y --material <lista>");
        process.exit(1);
      }
      const weaponPool = [];
      if (weaponNature) weaponPool.push(describeWeapon(weaponNature));
      if (arcoDamage) {
        weaponPool.push({ id: `arco_de_${id}`, name: `Arco de ${name || id}`, damageNature: "proyectil", nominalDamage: 0, hands: 2, weaponRange: 20, ranged: true });
      }
      const family = createFamily({
        id,
        name: name || id,
        setId: setId || `set_${id}`,
        materials,
        weaponPool: weaponPool.length ? weaponPool : [describeWeapon("cortante")],
        armorSlotBase: { cabeza: "Casco", pecho: "Pechera", pantalones: "Grebas", botas: "Botas" },
        coverageSuffix: { ligera: "Ligero", media: "", alta: "Alto", total: "Total" },
        shield: { id: `escudo_de_${id}`, name: "Escudo", slot: "mano_izq", coverage: "alta" },
        amulet: { id: `amuleto_de_${id}`, name: "Amuleto", slot: "artefacto_1", buff: { atk: 5 } },
        ammo: arcoDamage ? { id: `flecha_de_${id}`, name: "Flecha", damageNature: "proyectil", nominalDamage: arcoDamage } : undefined,
      });
      console.log(`Familia "${id}" creada`);
      showFamily(id);
      break;
    }
    case "edit": {
      const { id, name, materials, setId, weaponNature, arcoDamage } = parsed.opts;
      if (!id) {
        console.error("edit requiere <id>");
        process.exit(1);
      }
      const changes = {};
      if (name) changes.name = name;
      if (materials) changes.materials = materials;
      if (setId) changes.setId = setId;
      if (weaponNature) changes.weaponPool = [describeWeapon(weaponNature)];
      if (arcoDamage) {
        changes.ammo = { id: `flecha_de_${id}`, name: "Flecha", damageNature: "proyectil", nominalDamage: arcoDamage };
      }
      if (Object.keys(changes).length === 0) {
        console.error("edit requiere al menos una opción");
        process.exit(1);
      }
      editFamily(id, changes);
      console.log(`Familia "${id}" actualizada`);
      showFamily(id);
      break;
    }
    default:
      printUsage();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
