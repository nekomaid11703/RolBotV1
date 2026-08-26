import { describe, it, expect, vi, beforeEach } from "vitest";
const { xpForNextLevel, LEVEL_MAX, LEVEL_INITIAL } = require("../src/config/characterConfig");
const { calculateXpReward } = require("../src/services/rpg/combatEngine");
const experienceService = require("../src/services/rpg/experienceService");
const levelCommand = require("../src/commands/rpg/characters/level");
const subirStatCommand = require("../src/commands/rpg/characters/subir_stat");
const characterService = require("../src/services/characterService");
const { supabase } = require("../src/database/supabase");

describe("Pilar 1 — Progresión por Nivel, XP y Asignación de Atributos", () => {
  it("debe tener LEVEL_MAX fijado en 500", () => {
    expect(LEVEL_MAX).toBe(500);
  });

  it("debe estar calibrado exactamente para requerir ~1,000 batallas iguales hasta Nivel 500", () => {
    let totalBattles = 0;
    for (let lvl = LEVEL_INITIAL; lvl < LEVEL_MAX; lvl++) {
      const needed = xpForNextLevel(lvl);
      const reward = calculateXpReward(lvl, true);
      totalBattles += needed / reward;
    }
    const roundedBattles = Math.round(totalBattles);
    expect(roundedBattles).toBeGreaterThanOrEqual(980);
    expect(roundedBattles).toBeLessThanOrEqual(1020);
  });

  it("normalizeStatKey debe mapear alias de stats a claves canónicas", () => {
    expect(experienceService.normalizeStatKey("str")).toBe("fuerza");
    expect(experienceService.normalizeStatKey("fue")).toBe("fuerza");
    expect(experienceService.normalizeStatKey("agi")).toBe("agilidad");
    expect(experienceService.normalizeStatKey("fulgor")).toBe("fulgor");
    expect(experienceService.normalizeStatKey("dominio")).toBe("d_fulgor");
    expect(experienceService.normalizeStatKey("invalid")).toBeNull();
  });
});

describe("Comando /level y /subir_stat", () => {
  let mockCtx;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockCtx = {
      sender: "123456789",
      args: [],
      reply: vi.fn(),
    };
  });

  it("devuelve error en /level si no hay personaje activo", async () => {
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(null);
    await levelCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("No tienes un personaje activo"));
  });

  it("muestra la barra de progreso de XP y nivel en /level", async () => {
    const mockChar = {
      id: 1,
      name: "Guerrero",
      clase: "guerrero",
      nivel: 50,
      stats: { puntos_disponibles: 2 },
    };
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
    vi.spyOn(characterService, "getXpInfo").mockResolvedValue({
      nivel: 50,
      xp: 500,
      xp_total: 25000,
      xp_para_siguiente: 1000,
      progreso: 0.5,
    });

    await levelCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("PROGRESO Y EXPERIENCIA"));
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("50 / 500"));
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("PUNTOS DISPONIBLES"));
  });

  it("devuelve ayuda en /subir_stat si no se pasan argumentos", async () => {
    const mockChar = { id: 1, name: "Guerrero", stats: { puntos_disponibles: 3 } };
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);

    await subirStatCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("ASIGNAR PUNTOS DE ATRIBUTO"));
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("Puntos Disponibles"));
  });

  it("asigna puntos correctamente en /subir_stat", async () => {
    const mockChar = { id: 1, name: "Guerrero", stats: { puntos_disponibles: 3 } };
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
    vi.spyOn(experienceService, "allocateStatPoints").mockResolvedValue({
      character: mockChar,
      stat: "fuerza",
      statName: "Fuerza",
      pointsAssigned: 1,
      newValue: 15,
      newLevel: 51,
      remainingPoints: 2,
    });

    mockCtx.args = ["fuerza", "1"];
    await subirStatCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("ATRIBUTO INCREMENTADO"));
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("Valor actual: 15"));
  });
});
