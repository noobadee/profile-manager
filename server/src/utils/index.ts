import fs from "fs/promises";
import { PROFILES_PATH, MANIFEST_PATH } from "./constants.ts";

async function initDB(): Promise<void> {
  await fs.mkdir(PROFILES_PATH, { recursive: true });

  try {
    await fs.access(MANIFEST_PATH);
  } catch {
    await fs.writeFile(
      MANIFEST_PATH,
      JSON.stringify({ profiles: [] }, null, 2),
    );
  }
}

export { initDB };
