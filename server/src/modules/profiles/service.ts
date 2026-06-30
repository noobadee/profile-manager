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
    const profile = await this.repo.findById(id).catch(() => null);
    if (!profile) throw new NotFoundError("Profile");
    return profile;
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
        lastName: data.lastName && data.lastName.trim(),
        firstName: data.firstName && data.firstName.trim(),
        middleName: data.middleName && data.middleName.trim(),
        age: data.age,
        dateOfBirth: data.dateOfBirth && data.dateOfBirth.trim(),
        gender: data.gender,
        nationality: data.nationality && data.nationality.trim(),
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

  async updateProfile(
    id: string,
    updateBody: CreateProfileBody,
  ): Promise<Profile> {
    // First or last name is required
    if (!updateBody.lastName && !updateBody.firstName) {
      throw new BadRequestError("First or last name is required");
    }

    const existingProfile = await this.repo.findById(id).catch(() => null);

    if (!existingProfile) {
      throw new NotFoundError("Profile");
    }

    const updatedNow = new Date().toISOString();

    // 1) Update profile
    const { contacts, socialAccounts, address, ...identity } = updateBody;
    const updatedProfile: Profile = {
      ...existingProfile,

      id: existingProfile.id,
      meta: {
        ...existingProfile.meta,
        updatedAt: updatedNow,
      },
      identity: {
        ...existingProfile.identity,
        ...identity,
      },
      contacts: updateBody.contacts,
      socialAccounts: updateBody.socialAccounts,
      address: updateBody.address,
    };
    await this.repo.create(updatedProfile);

    // 2) Update manifest
    const { lastName, firstName, middleName } = updateBody;
    const manifest = await this.repo.readManifest();
    if (manifest.profiles) {
      const newManifest = {
        profiles: manifest.profiles.filter((p) => p.id !== id),
      };
      newManifest.profiles.push({
        id,
        name: formatName(firstName, middleName, lastName),
        updatedAt: updatedNow,
      });
      await this.repo.write(newManifest);
    }

    return updatedProfile;
  }

  async deleteProfile(id: string): Promise<Profile> {
    const existingProfile = await this.repo.findById(id).catch(() => null);

    if (!existingProfile) {
      throw new NotFoundError("Profile");
    }

    // 1) Delete profile
    await this.repo.delete(id);

    // 2) Update manifest
    const manifest = await this.repo.readManifest();
    if (manifest.profiles) {
      const newManifest = {
        profiles: manifest.profiles.filter((p) => p.id !== id),
      };
      await this.repo.write(newManifest);
    }

    return existingProfile;
  }
}
