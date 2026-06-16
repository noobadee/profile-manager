import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chokidar from "chokidar";
import type { CreateProfileInput, Manifest, Profile } from "../types/index.ts";
import { randomUUID } from "node:crypto";

const DB_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  ".data",
);
const PROFILES_PATH = path.join(DB_PATH, "profiles");
const MANIFEST_PATH = path.join(DB_PATH, "manifest.json");

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
// async function initDb(): Promise<void> {
//   const tempPath = `${DB_PATH}.tmp`;

//   try {
//     await fs.mkdir(DB_PATH, { recursive: true });
//     await fs.rename(tempPath, DB_PATH);
//   } catch (err) {
//     await fs.unlink(tempPath).catch(() => {});
//     console.error(
//       `❌ Failed to create a directory at: "${DB_PATH}" because ${err}`,
//     );
//   }
// }

// read
async function readJsonFile(filePath: string): Promise<Profile> {
  const raw = await fs.readFile(filePath, "utf-8");

  return JSON.parse(raw);
}

async function readManifest(): Promise<Manifest> {
  const raw = await fs.readFile(MANIFEST_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeManifest(manifest: Manifest): Promise<void> {
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
}

async function listProfiles(): Promise<Manifest> {
  return readManifest();
}

// create
async function createProfile(input: CreateProfileInput): Promise<Profile> {
  const id = randomUUID();
  const now = new Date().toISOString();

  const profile: Profile = {
    id,
    meta: {
      createdAt: now,
      updatedAt: now,
    },
    identity: {
      lastName: input.lastName ?? null,
      firstName: input.firstName ?? null,
      middleName: input.middleName ?? null,
      age: input.age ?? null,
      dob: input.dob ?? null,
      gender: input.gender ?? null,
      nationality: input.nationality ?? null,
    },
    contacts: input.contacts ?? null,
    socialAccounts: input.socialAccounts ?? null,
    address: input.address ?? null,
  };

  await fs.writeFile(
    path.join(PROFILES_PATH, `${id}.json`),
    JSON.stringify(profile, null, 2),
  );

  // Update manifest
  const manifest = await readManifest();
  manifest.profiles.push({
    id,
    fullName:
      `${profile.identity.firstName ?? ""} ${profile.identity.middleName ?? ""} ${profile.identity.lastName ?? ""}`.trim(),
    updatedAt: now,
  });
  await writeManifest(manifest);

  return profile;
}
// async function saveFile(
//   fileName: string,
//   fileContent: Profile,
// ): Promise<string> {
//   const filePath = path.join(DB_PATH, `${fileName}.json`);
//   // await initDb();
//   await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2), "utf-8");

//   return filePath;
// }

// delete

export { DB_PATH, initDB, listProfiles, createProfile };
