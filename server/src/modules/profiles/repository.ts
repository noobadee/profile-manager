import fs from "node:fs/promises";
import path from "node:path";
import { PROFILES_PATH, MANIFEST_PATH } from "../../utils/constants.ts";
import type { IProfileRepository, Manifest, Profile } from "./types.ts";

export class ProfileRepository implements IProfileRepository {
  async findById(id: string): Promise<Profile> {
    const raw = await fs.readFile(
      path.join(PROFILES_PATH, `${id}.json`),
      "utf-8",
    );
    return JSON.parse(raw);
  }

  async readManifest(): Promise<Manifest> {
    const raw = await fs.readFile(MANIFEST_PATH, "utf-8");
    return JSON.parse(raw);
  }

  async write(manifest: Manifest): Promise<void> {
    await fs.writeFile(
      MANIFEST_PATH,
      JSON.stringify(manifest, null, 2),
      "utf-8",
    );
  }

  async create(profile: Profile): Promise<void> {
    await fs.writeFile(
      path.join(PROFILES_PATH, `${profile.id}.json`),
      JSON.stringify(profile, null, 2),
    );
  }

  async delete(id: string): Promise<void> {
    await fs.unlink(path.join(PROFILES_PATH, `${id}.json`));
  }
}
