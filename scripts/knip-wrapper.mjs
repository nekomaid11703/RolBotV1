import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

process.env.KNIP_DISABLE_RAW_TRANSFER = "1";

const __dirname = dirname(fileURLToPath(import.meta.url));
await import(pathToFileURL(resolve(__dirname, "../node_modules/knip/dist/cli.js")));
