import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Profile } from "../types/index.ts";

const DB_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", ".data");

// initDb
const initDb = async () => {

  const tempPath = `${DB_PATH}.tmp`;

  try {
    await fs.mkdir(DB_PATH, { recursive: true });
    await fs.rename(tempPath, DB_PATH);
  } catch (err) {
    await fs.unlink(tempPath).catch(() => {});
    console.error("Failed to create a directory at:", DB_PATH);
  }
}

// read
// create
// delete