import { existsSync } from "fs";
import { join } from "path";

const AutoOnboardingPlugin = async ({ directory }) => {
  let reminded = false;

  return {
    "tool.execute.before": async (input, output) => {
      if (reminded) return;
      if (input.tool !== "bash") return;

      // Only remind once per session, and only if opencode.json has agentCommands
      const configPath = join(directory, ".opencode", "opencode.json");
      if (!existsSync(configPath)) return;

      output.args.command =
        'echo "[onboarding] Nuevo agente detectado. Ejecuta /revisar para contexto completo del proyecto (herramientas, skills, arquitectura, protocolo)." ; ' +
        output.args.command;
      reminded = true;
    },
  };
};

export default AutoOnboardingPlugin;
