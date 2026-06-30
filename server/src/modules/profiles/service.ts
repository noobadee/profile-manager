import { randomUUID } from "node:crypto";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../common/errors/index.ts";
import { formatName } from "../../utils/formatter.ts";
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
    if (!profile) throw new NotFoundError("Profile");
    return profile;
  }

  async getManifest(): Promise<Manifest> {
    const manifest = await this.repo.readManifest();
    if (!manifest) throw new NotFoundError("Manifest");
    return manifest;
  }

  async getAllProfiles(): Promise<Profile[]> {
    const manifest = await this.repo.readManifest();
    if (!manifest) throw new NotFoundError("Manifest");

    const profiles = await Promise.all(
      manifest.profiles.map((entry) => this.getProfile(entry.id)),
    );

    return profiles;
  }

  async createProfile(data: CreateProfileBody): Promise<Profile> {
    // First or last name is required
    if (!data.lastName && !data.firstName) {
      throw new BadRequestError("First or last name is required");
    }

    // Check for duplication (full name)
    const manifest = await this.repo.readManifest();
    if (manifest.profiles) {
      const bodyName = formatName(
        data.firstName,
        data.middleName,
        data.lastName,
      );
      const existing = manifest.profiles.some((p) => p.name === bodyName);
      if (existing) {
        throw new ConflictError("Profile already exists");
      }
    }

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
      const { lastName, firstName, middleName } = newProfile.identity;
      const newManifest = await this.repo.readManifest();
      newManifest.profiles.push({
        id: newProfile.id,
        name: formatName(firstName, middleName, lastName),
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
