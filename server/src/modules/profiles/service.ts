import { randomUUID } from "node:crypto";
import type {
  IProfileRepository,
  IProfileService,
  Manifest,
  Profile,
} from "./types.ts";
import type { CreateProfileBody } from "./schemas.ts";

export class ProfileService implements IProfileService {
  constructor(private readonly repo: IProfileRepository) {}

  async getProfile(id: string): Promise<Profile> {
    const profile = this.repo.findById(id);
    return profile;
  }

  async getManifest(): Promise<Manifest> {
    const manifest = await this.repo.readManifest();
    return manifest;
  }

  async getAllProfiles(): Promise<Profile[]> {
    const manifest = await this.getManifest();

    const profiles = await Promise.all(
      manifest.profiles.map((entry) => this.getProfile(entry.id)),
    );

    return profiles;
  }

  async createProfile(data: CreateProfileBody): Promise<Profile> {
    const id = randomUUID();
    const now = new Date().toISOString();

    const existingProfile = await this.repo.findById(id).catch(() => null);

    // 1) Create new profile
    const newProfile: Profile = {
      id,
      meta: {
        createdAt: now,
        updatedAt: now,
      },
      identity: {
        lastName: data.lastName,
        firstName: data.firstName,
        middleName: data.middleName,
        age: data.age,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        nationality: data.nationality,
      },
      contacts: data.contacts,
      socialAccounts: data.socialAccounts,
      address: data.address,
    };
    await this.repo.create(newProfile);

    // 2) Update manifest — roll back if profile exists
    try {
      const newManifest = await this.repo.readManifest();
      newManifest.profiles.push({
        id: newProfile.id,
        name: `${newProfile.identity.firstName ?? ""} ${newProfile.identity.middleName ?? ""} ${newProfile.identity.lastName ?? ""}`
          .trim()
          .replace(/\s+/g, " "),
        updatedAt: now,
      });
      await this.repo.write(newManifest);
    } catch (manifestErr) {
      if (manifestErr instanceof Error) {
        try {
          if (existingProfile) {
            await this.repo.create(existingProfile);
          } else {
            await this.repo.delete(id);
          }
        } catch (rollBackErr) {
          if (rollBackErr instanceof Error) {
            throw new Error(
              `
              Failed to write manifest, and also rollback also failed.\n
              Profile ${id} may be in an inconsistent state.\n
              Manifest error: ${manifestErr.message}\n
              Rollback error: ${rollBackErr.message}
              `,
            );
          }
        }
        throw new Error(
          `Failed to write manifest; profile creation rolled back: ${manifestErr.message}`,
        );
      }
    }

    return newProfile;
  }
}
