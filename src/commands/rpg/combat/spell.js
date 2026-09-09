// @ts-nocheck
const characterService = require("../../../services/characterService");
const { findSessionByCharacter, advanceTurn } = require("../../../services/rpg/combatState");
const spellContainerService = require("../../../services/rpg/spellContainerService");
const { composeMessage } = require("../../../ui/sectionBuilder");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const {
  spellSubmenuLines,
  spellActionMenuLines,
  spellDetailLines,
  spellContainerSectionLines,
} = require("../../../ui/sections/spellSections");
const { runDummyTurn } = require("../../../services/rpg/dummyTurnService");
const { formatCombatStatus } = require("../../../services/rpg/combatMessages");

/**
 * Resuelve una clave de ranura (spell_1..spell_4) o id a partir del target ("1", "2", "spell_1", "bola_de_fuego").
 * @param {string} target
 * @param {Array<{slot: string, spellId: string}>} activeSpells
 * @returns {{slot: string, spellId: string}|null}
 */
function resolveSpellTarget(target, activeSpells = []) {
  if (!target) return null;
  const t = String(target).toLowerCase();

  if (/^[1-4]$/.test(t)) {
    const slotKey = `spell_${t}`;
    return activeSpells.find((s) => s.slot === slotKey) || null;
  }
  if (t.startsWith("spell_")) {
    return activeSpells.find((s) => s.slot === t) || null;
  }
  return activeSpells.find((s) => s.spellId.toLowerCase() === t) || null;
}

module.exports = {
  name: "spell",
  aliases: ["hechizo", "habilidad", "castear", "spells"],
  description: "Gestión y lanzamiento de hechizos (sub-menú, casteo, pasivas, equipamiento y tomos).",
  /**
   * @param {*} ctx
   */
  async execute(ctx) {
    const activeChar = await characterService.getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const session = findSessionByCharacter(activeChar.id);
    const activeSpellsData = await spellContainerService.getActiveSpells(activeChar.id);
    const { activeSpells } = activeSpellsData;

    const [subCommand, arg1, arg2] = ctx.args;
    const sub = String(subCommand || "").toLowerCase();

    // ── SUBCOMANDO: info ──
    if (sub === "info") {
      const target = arg1;
      if (!target) {
        return ctx.reply("❌ Uso: `/spell info <1-4|spell_id>`");
      }
      const resolved = resolveSpellTarget(target, activeSpells);
      const spellId = resolved ? resolved.spellId : target;
      const details = spellContainerService.getSpellDetails(spellId);
      if (!details) {
        return ctx.reply(`❌ No existe el hechizo "${spellId}".`);
      }
      const sections = [spellDetailLines(details)];
      return ctx.reply(composeMessage({ title: "📜 DETALLE DE HECHIZO", sections }));
    }

    // ── SUBCOMANDO: contenedores ──
    if (sub === "contenedores" || sub === "grimorios" || sub === "tomos") {
      const containers = await spellContainerService.getSpellContainersInInventory(activeChar.id);
      const sections = [spellContainerSectionLines(containers)];
      return ctx.reply(composeMessage({ title: "🎒 CONTENEDORES DE MAGIA", sections }));
    }

    // ── SUBCOMANDO: equipar ──
    if (sub === "equipar" || sub === "equip") {
      const spellId = arg1;
      const slot = arg2;
      if (!spellId) {
        return ctx.reply("❌ Uso: `/spell equipar <spell_id> [slot]`");
      }
      try {
        const res = await spellContainerService.equipActiveSpell({
          characterId: activeChar.id,
          creatorId: ctx.sender,
          spellId,
          slot,
        });
        const lines = [`✅ *${activeChar.name}* equipó el hechizo *${spellId}* en [${res.slot}]`];
        if (res.autoUnequipped?.length > 0) {
          lines.push(`🔄 Sustituyó: ${res.autoUnequipped.join(", ")}`);
        }
        return ctx.reply(box("✨ HECHIZO EQUIPADO", lines));
      } catch (err) {
        return ctx.reply(formatError(err));
      }
    }

    // ── SUBCOMANDO: desequipar ──
    if (sub === "desequipar" || sub === "unequip") {
      const target = arg1;
      if (!target) {
        return ctx.reply("❌ Uso: `/spell desequipar <slot|spell_id>`");
      }
      try {
        const res = await spellContainerService.unequipActiveSpell({
          characterId: activeChar.id,
          creatorId: ctx.sender,
          target,
        });
        return ctx.reply(box("✨ HECHIZO RETIRADO", [`✅ Retirado *${res.unequipped}* de [${res.slot}]`]));
      } catch (err) {
        return ctx.reply(formatError(err));
      }
    }

    // ── SUBCOMANDO: toggle (Pasivas / Auras) ──
    if (sub === "toggle") {
      const target = arg1;
      if (!target) {
        return ctx.reply("❌ Uso: `/spell toggle <1-4|spell_id>`");
      }
      const resolved = resolveSpellTarget(target, activeSpells);
      if (!resolved) {
        return ctx.reply(`❌ No tienes ningún hechizo equipado en "${target}".`);
      }
      const details = spellContainerService.getSpellDetails(resolved.spellId);
      if (!details?.isPassive) {
        return ctx.reply(`❌ El hechizo "*${details?.name || resolved.spellId}*" no es una pasiva/aura de toggle.`);
      }

      if (session) {
        const side = String(session.challenger.characterId) === String(activeChar.id) ? "challenger" : "defender";
        session[side].activePassives = session[side].activePassives || {};
        const currentState = Boolean(session[side].activePassives[resolved.spellId]);
        session[side].activePassives[resolved.spellId] = !currentState;
        const newStateStr = !currentState ? "🟢 ACTIVADA [ON]" : "🔴 DESACTIVADA [OFF]";
        return ctx.reply(`✨ Pasiva *${details.name}* ${newStateStr} en el combate.`);
      } else {
        return ctx.reply(`✨ Pasiva *${details.name}* configurada para el próximo combate.`);
      }
    }

    // ── NINGÚN SUBCOMANDO ESPECÍFICO / INTENTO DE LANZAMIENTO DE HECHIZO ──
    const targetSpell = subCommand ? resolveSpellTarget(subCommand, activeSpells) : null;

    if (!targetSpell) {
      const containerInfo = await spellContainerService.getEquippedContainer(activeChar.id);
      const cooldowns = session
        ? (String(session.challenger.characterId) === String(activeChar.id)
            ? session.challenger.spellCooldowns
            : session.defender.spellCooldowns) || {}
        : {};
      const activePassives = session
        ? (String(session.challenger.characterId) === String(activeChar.id)
            ? session.challenger.activePassives
            : session.defender.activePassives) || {}
        : {};
      const spentFulgor = session
        ? (String(session.challenger.characterId) === String(activeChar.id)
            ? session.challenger.spentFulgor
            : session.defender.spentFulgor) || 0
        : 0;

      const sections = [
        spellSubmenuLines({
          character: activeChar,
          activeSpells,
          cooldowns,
          activePassives,
          spentFulgor,
          distance: session?.distance,
          containerInfo,
        }),
        spellActionMenuLines(),
      ];

      return ctx.reply(composeMessage({ title: "✨ MENU DE HECHIZOS", sections }));
    }

    // ── LANZAMIENTO DEL HECHIZO EN COMBATE O TOGGLE ──
    const spellDetails = spellContainerService.getSpellDetails(targetSpell.spellId);
    if (!spellDetails) {
      return ctx.reply(`❌ Error al cargar detalles del hechizo "${targetSpell.spellId}".`);
    }

    if (spellDetails.isPassive) {
      // Es pasiva: conmutar toggle
      if (session) {
        const side = String(session.challenger.characterId) === String(activeChar.id) ? "challenger" : "defender";
        session[side].activePassives = session[side].activePassives || {};
        const curr = Boolean(session[side].activePassives[targetSpell.spellId]);
        session[side].activePassives[targetSpell.spellId] = !curr;
        const st = !curr ? "🟢 [ON]" : "🔴 [OFF]";
        return ctx.reply(`✨ Pasiva *${spellDetails.name}* conmutada a ${st}.`);
      } else {
        return ctx.reply(`✨ Pasiva *${spellDetails.name}* (toggle disponible en combate).`);
      }
    }

    // Es un hechizo activo. Verificar si estamos en combate activo:
    if (!session) {
      return ctx.reply(
        `📜 Hechizo seleccionado: *${spellDetails.name}* (Costo: ✨${spellDetails.fulgorCost}, Rango: ${spellDetails.range}m).\nLos hechizos activos se lanzan durante un combate. ¡Retar a alguien con \`/retar\`!`,
      );
    }

    // Validar turno en combate
    const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
    const isDefender = String(session.defender.characterId) === String(activeChar.id);

    if (!isChallenger && !isDefender) {
      return ctx.reply("❌ No eres participante de este combate.");
    }

    if (String(session.currentTurnCharId) !== String(activeChar.id)) {
      return ctx.reply("⏳ No es tu turno.");
    }

    if (session.status === "waiting_reaction") {
      return ctx.reply("❌ Hay una reacción pendiente de resolución.");
    }

    const sideKey = isChallenger ? "challenger" : "defender";
    const oppSideKey = isChallenger ? "defender" : "challenger";
    const casterSlot = session[sideKey];
    const targetSlot = session[oppSideKey];

    const { isActionBlocked } = require("../../../services/rpg/combatState");
    if (isActionBlocked(casterSlot, "attack")) {
      return ctx.reply("🧊 Estás congelado y no puedes lanzar hechizos de ataque en este turno.");
    }

    // Verificar Cooldown
    casterSlot.spellCooldowns = casterSlot.spellCooldowns || {};
    const currentCd = casterSlot.spellCooldowns[targetSpell.spellId] || 0;
    if (currentCd > 0) {
      return ctx.reply(`⏳ El hechizo *${spellDetails.name}* está en cooldown (${currentCd} turnos restantes).`);
    }

    // Verificar Batería de Fulgor (dilución en vez de abort si se agota)
    const maxFulgor = Math.min(100, Math.max(10, (activeChar.stats?.fulgor || 1) * 2));
    casterSlot.spentFulgor = casterSlot.spentFulgor || 0;
    const availableFulgor = Math.max(0, maxFulgor - casterSlot.spentFulgor);
    const fulgorCost = spellDetails.fulgorCost || 0;

    // Si el fulgor disponible es menor al coste: entrar en modo diluido (eff = 0.1)
    // en lugar de abortar, consistente con la tubería de /atacar.
    const isDiluted = availableFulgor < fulgorCost;

    // Deducir Fulgor y aplicar Cooldown
    casterSlot.spentFulgor += fulgorCost;
    if (spellDetails.cooldown > 0) {
      casterSlot.spellCooldowns[targetSpell.spellId] = spellDetails.cooldown;
    }

    // Resolver foco equipado para obtener canalizeBase/canalizeScale
    const {
      resolveAttackerWeapon,
      resolveSpellPayload,
      resolveSpellDominante,
    } = require("../../../services/rpg/equipmentResolverService");
    const focusInfo = await resolveAttackerWeapon(activeChar).catch(() => null);
    const canalizeBase = focusInfo?.isFocus ? focusInfo.canalizeBase || 0 : 0;
    const canalizeScale = focusInfo?.isFocus ? focusInfo.canalizeScale || 1 : 1;

    // Construir weaponInfo sintético con datos del hechizo + amplificación del foco.
    // Este weaponInfo es la misma forma que usa /atacar → misma tubería matemática.
    const spellWeaponInfo = {
      damageNature: "mágico",
      baseDamage: Number(spellDetails.baseDamage) || 0,
      fulgorCost,
      spellNature: spellDetails.spellNature || "mágico",
      weaponRange: Number(spellDetails.range) || 1,
      canalizeBase,
      canalizeScale,
      element: resolveSpellDominante(spellDetails),
      spell: resolveSpellPayload(spellDetails),
      // Si el fulgor está diluido, marcar para que combatEngine aplique eff = 0.1
      fulgorDiluted: isDiluted,
    };

    const { executeAttack, getDamageMultiplier } = require("../../../services/rpg/combatEngine");
    const {
      applySpellHits,
      applySpellCastEffects,
      applyElementalAttack,
      applyBarrierDamage,
      applyPrisonDamage,
      endSession,
    } = require("../../../services/rpg/combatState");

    const isBarrierSelf =
      spellDetails.kind === "barrera" &&
      (spellDetails.application === "propia" || spellDetails.targetMode === "propio");
    const isPrison =
      spellDetails.kind === "barrera" &&
      (spellDetails.application === "externa" || spellDetails.targetMode === "enemigo");

    // ── RAMA A: BARRERA DEFENSIVA (PROPIA) ──
    if (isBarrierSelf) {
      const baseBarrierVal = Number(spellDetails.resolution?.barrierHp || spellDetails.baseDamage) || 20;
      const rawBarrierHp = Math.floor((baseBarrierVal + canalizeBase) * canalizeScale);
      const effectiveBarrierHp = Math.max(5, Math.floor(rawBarrierHp * (isDiluted ? 0.1 : 1)));

      casterSlot.barrierHp = (casterSlot.barrierHp || 0) + effectiveBarrierHp;

      if (spellWeaponInfo.spell?.effects?.length) {
        await applySpellCastEffects(session.id, casterSlot, targetSlot, spellWeaponInfo.spell.effects, "propia");
      }

      const dilutedNote = isDiluted ? "\n⚠️ *Fulgor agotado — barrera diluida al 10% de potencia.*" : "";
      const logLines = [
        `✨ *${activeChar.name}* lanza *${spellDetails.name}*!${dilutedNote}`,
        `🛡️ Se erige una **Barrera Defensiva** (+${effectiveBarrierHp} HP de absorción) [Total: ${casterSlot.barrierHp} HP].`,
      ];

      await advanceTurn(session.id, session.challenger.hp, session.defender.hp);
      const isTargetPvE = targetSlot.isDummy || targetSlot.isBot;
      if (isTargetPvE) {
        return runDummyTurn(ctx, session, isChallenger, logLines);
      }
      const currentStatus = formatCombatStatus(session);
      return ctx.reply(`${box("🛡️ BARRERA MÁGICA", logLines)}\n\n${currentStatus}`);
    }

    // ── RAMA B: PRISIÓN ROMPIBLE (EXTERNA) ──
    if (isPrison) {
      const baseBarrierVal = Number(spellDetails.resolution?.barrierHp || spellDetails.baseDamage) || 20;
      const rawBarrierHp = Math.floor((baseBarrierVal + canalizeBase) * canalizeScale);
      const effectiveBarrierHp = Math.max(5, Math.floor(rawBarrierHp * (isDiluted ? 0.1 : 1)));
      const spellElem = resolveSpellDominante(spellDetails);

      targetSlot.prison = {
        hp: effectiveBarrierHp,
        maxHp: effectiveBarrierHp,
        element: spellElem,
      };

      if (spellWeaponInfo.spell?.effects?.length) {
        await applySpellCastEffects(session.id, casterSlot, targetSlot, spellWeaponInfo.spell.effects, "externa");
      }

      const dilutedNote = isDiluted ? "\n⚠️ *Fulgor agotado — prisión diluida al 10% de resistencia.*" : "";
      const logLines = [
        `✨ *${activeChar.name}* lanza *${spellDetails.name}*!${dilutedNote}`,
        `🧱 *${targetSlot.character.name}* ha sido encerrado en una **Prisión Rompible** [🛡️ ${effectiveBarrierHp}/${effectiveBarrierHp} HP | Elemento: ${spellElem || "arcano"}].`,
        `⚠️ El objetivo no podrá desplazarse hasta destruirla golpeándola desde adentro.`,
      ];

      await advanceTurn(session.id, session.challenger.hp, session.defender.hp);
      const isTargetPvE = targetSlot.isDummy || targetSlot.isBot;
      if (isTargetPvE) {
        return runDummyTurn(ctx, session, isChallenger, logLines);
      }
      const currentStatus = formatCombatStatus(session);
      return ctx.reply(`${box("🧱 PRISIÓN MÁGICA", logLines)}\n\n${currentStatus}`);
    }

    // ── RAMA C: HECHIZO OFENSIVO ESTÁNDAR ──
    let attackInfo = executeAttack(
      casterSlot.character,
      targetSlot.character,
      targetSlot.hp,
      casterSlot.hp,
      casterSlot.fatigue,
      targetSlot.fatigue,
      spellWeaponInfo,
    );
    attackInfo.baseDamage = Math.max(1, Math.floor(attackInfo.baseDamage * getDamageMultiplier(casterSlot)));

    // Reacciones elementales — misma lógica que /atacar
    if (spellWeaponInfo.spell?.hits?.length) {
      const amp = await applySpellHits(
        session.id,
        targetSlot,
        spellWeaponInfo.spell.hits,
        attackInfo.baseDamage,
        attackInfo.materialDamage,
      );
      attackInfo.elementReaction = amp.reactions[amp.reactions.length - 1] || null;
      attackInfo.baseDamage = amp.baseDamage;
      attackInfo.materialDamage = amp.materialDamage;
    } else if (spellWeaponInfo.element) {
      const amp = await applyElementalAttack(
        session.id,
        targetSlot,
        spellWeaponInfo.element,
        attackInfo.baseDamage,
        attackInfo.materialDamage,
      );
      attackInfo.elementReaction = amp.reaction;
      attackInfo.baseDamage = amp.baseDamage;
      attackInfo.materialDamage = amp.materialDamage;
    }
    if (spellWeaponInfo.spell?.effects?.length) {
      attackInfo.effectEvents = await applySpellCastEffects(
        session.id,
        casterSlot,
        targetSlot,
        spellWeaponInfo.spell.effects,
        spellWeaponInfo.spell.application,
      );
    }

    const logLines = [];
    const dilutedNote = isDiluted ? "\n⚠️ *Fulgor agotado — hechizo diluido al 10% de eficiencia.*" : "";
    logLines.push(`✨ *${activeChar.name}* lanza *${spellDetails.name}*!${dilutedNote}`);

    // Si el objetivo está en una prisión, el ataque externo debe penetrarla primero
    let incomingDamage = attackInfo.baseDamage;
    if (targetSlot.prison && targetSlot.prison.hp > 0) {
      const prisonRes = applyPrisonDamage(targetSlot, incomingDamage);
      incomingDamage = prisonRes.netDamage;
      if (prisonRes.destroyed) {
        logLines.push(
          `💥 ¡El impacto destruyó la **Prisión Mágica** de *${targetSlot.character.name}*! (Absorbió ${prisonRes.absorbed} daño)`,
        );
      } else {
        logLines.push(
          `🧱 La **Prisión Mágica** absorbió el impacto (-${prisonRes.absorbed} HP, quedan ${targetSlot.prison.hp}/${targetSlot.prison.maxHp}).`,
        );
      }
    }

    // Absorción por barrera defensiva del objetivo y aplicar daño remanente al HP
    const netDmg = applyBarrierDamage(targetSlot, incomingDamage);
    const newTargetHp = Math.max(0, targetSlot.hp - netDmg);
    targetSlot.hp = newTargetHp;
    if (targetSlot.userId && targetSlot.character?.name) {
      await characterService
        .setHp({
          creatorId: targetSlot.userId,
          characterName: targetSlot.character.name,
          hp: newTargetHp,
        })
        .catch(() => null);
    }

    if (netDmg > 0 || (incomingDamage === 0 && !targetSlot.prison)) {
      logLines.push(
        `💥 Daño Mágico (${spellDetails.nature || spellDetails.spellNature || "mágico"}): -${netDmg} HP a *${targetSlot.character.name}*`,
      );
    }

    if (attackInfo.elementReaction) {
      const { formatElementReactionLine } = require("../../../services/rpg/combatMessages");
      logLines.push(formatElementReactionLine(attackInfo.elementReaction));
    }

    if (newTargetHp === 0) {
      logLines.push(`💀 *${targetSlot.character.name}* ha sido derrotado!`);
      await endSession(session.id, activeChar.id);
      return ctx.reply(box("✨ VICTORIA MÁGICA", logLines));
    }

    // Avanzar turno
    await advanceTurn(session.id, session.challenger.hp, session.defender.hp);

    // Si es PvE (Dummy Turn)
    const isTargetPvE = targetSlot.isDummy || targetSlot.isBot;
    if (isTargetPvE) {
      return runDummyTurn(ctx, session, isChallenger, logLines);
    }

    const currentStatus = formatCombatStatus(session);
    return ctx.reply(`${box("✨ HECHIZO LANZADO", logLines)}\n\n${currentStatus}`);
  },
};
