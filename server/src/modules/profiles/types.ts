// import type { Prettify } from "../../types/index.ts";
import type { CreateProfileBody } from "./schemas.ts";

export interface IProfileRepository {
  findById(id: string): Promise<Profile>;
  readManifest(): Promise<Manifest>;
  write(manifest: Manifest): Promise<void>;
  create(profile: Profile): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IProfileService {
  getAllProfiles(): Promise<Profile[]>;
  getProfile(id: string): Promise<Profile>;
  createProfile(data: CreateProfileBody): Promise<Profile>;
  updateProfile(id: string, updateBody: CreateProfileBody): Promise<Profile>;
  deleteProfile(id: string): Promise<Profile>;
}

// export type CreateProfileInput = Prettify<
//   Omit<Profile, "id" | "meta" | "identity"> & Profile["identity"]
// >;

export interface Profile {
  id: string;
  meta: {
    createdAt: string;
    updatedAt: string;
  };
  identity: {
    lastName: string | null;
    firstName: string | null;
    middleName: string | null;
    age: number | null;
    dateOfBirth: string | null;
    gender: "male" | "female" | "other" | null;
    nationality: string | null;
  };
  contacts: Contacts | null;
  socialAccounts: SocialAccounts[] | null;
  address: Address | null;
}

export interface Contacts {
  emails: string[] | null;
  phones: string[] | null;
}

export interface SocialAccounts {
  platform: string;
  username: string;
  url: string;
}

export interface Address {
  street: string | null;
  baranggay: string | null;
  city: string;
  province: string | null;
  postalCode: string | null;
}

export interface Manifest {
  profiles: {
    id: string;
    name: string;
    updatedAt: string;
  }[];
}
