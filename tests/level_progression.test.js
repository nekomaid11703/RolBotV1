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

  it("debe estar calibrado para ~450 victorias equivalentes hasta Nivel 500 (≈360 combate + ~20% actividades)", () => {
    let totalBattles = 0;
    for (let lvl = LEVEL_INITIAL; lvl < LEVEL_MAX; lvl++) {
      const needed = xpForNextLevel(lvl);
      const reward = calculateXpReward(lvl, true);
      totalBattles += needed / reward;
    }
    const roundedBattles = Math.round(totalBattles);
    expect(roundedBattles).toBeGreaterThanOrEqual(430);
    expect(roundedBattles).toBeLessThanOrEqual(470);
  });

  it("normalizeStatKey debe mapear alias de stats a claves canónicas", () => {
    expect(experienceService.normalizeStatKey("str")).toBe("atk");
    expect(experienceService.normalizeStatKey("fue")).toBe("atk");
    expect(experienceService.normalizeStatKey("fuerza")).toBe("atk");
    expect(experienceService.normalizeStatKey("agi")).toBe("aspd");
    expect(experienceService.normalizeStatKey("vitalidad")).toBe("hp");
    expect(experienceService.normalizeStatKey("resistencia")).toBe("def");
    expect(experienceService.normalizeStatKey("fulgor")).toBe("fulgor");
    expect(experienceService.normalizeStatKey("dominio")).toBe("d_fulgor");
    expect(experienceService.normalizeStatKey("invalid")).toBeNull();
  });

  it("eleva el umbral de XP por cada nivel obtenido en una misma recompensa", async () => {
    const initialLevel = 100;
    const reward = xpForNextLevel(initialLevel) + xpForNextLevel(initialLevel + 1) + 1;
    const character = {
      id: 1,
      player_phone: "123456789",
      nivel: initialLevel,
      xp: 0,
      xp_total: 0,
      stats: { puntos_disponibles: 0 },
    };
    const updatePayloads = [];
    const selectCharacter = {
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: character, error: null }),
    };
    const updateCharacter = {
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: character, error: null }) }),
      }),
    };

    vi.spyOn(supabase, "from").mockImplementation((table) => {
      expect(table).toBe("characters");
      return {
        select: vi.fn().mockReturnValue(selectCharacter),
        update: vi.fn((payload) => {
          updatePayloads.push(payload);
          return updateCharacter;
        }),
      };
    });

    const result = await experienceService.addXpToCharacter(character.id, reward);

    expect(result).toMatchObject({ currentLevel: 102, newXp: 1, pointsGained: 2, totalPointsAvailable: 2 });
    expect(updatePayloads[0]).toMatchObject({ nivel: 102, xp: 1, xp_total: reward });
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
