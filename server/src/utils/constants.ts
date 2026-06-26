import path from "node:path";
import { fileURLToPath } from "node:url";

const DB_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  ".data",
);

const PROFILES_PATH = path.join(DB_PATH, "profiles");

const MANIFEST_PATH = path.join(DB_PATH, "manifest.json");

export { PROFILES_PATH, MANIFEST_PATH };
