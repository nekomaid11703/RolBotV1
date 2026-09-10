import { describe, it, expect, vi } from "vitest";
const characterService = require("../src/services/characterService");
const usarCmd = require("../src/commands/rpg/inventory/usar");

describe("Comando /usar", () => {
  it("debe estar registrado correctamente con su nombre y aliases", () => {
    expect(usarCmd.name).toBe("usar");
    expect(usarCmd.aliases).toContain("consumir");
    expect(usarCmd.category).toBe("rpg");
  });

  it("debe solicitar item si no se pasa argumento", async () => {
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValueOnce({
      id: 1,
      name: "Heroe",
      creator_id: "user_123",
    });
    const replyMock = vi.fn();
    const ctx = {
      sender: "user_123",
      args: [],
      reply: replyMock,
    };
    await usarCmd.execute(ctx);
    expect(replyMock).toHaveBeenCalled();
    expect(replyMock.mock.calls[0][0]).toContain("Usar ítem");
  });
});
