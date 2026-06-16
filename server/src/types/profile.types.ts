import type { Contacts } from "./contacts.types.ts";
import type { SocialAccounts } from "./socials.types.ts";
import type { Address } from "./address.types.ts";
import type { Prettify } from "./utils.ts";

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
    dob: string | null;
    gender: string | null;
    nationality: string | null;
  };
  contacts: Contacts | null;
  socialAccounts: SocialAccounts[] | null;
  address: Address | null;
}

export type CreateProfileInput = Prettify<
  Omit<Profile, "id" | "meta" | "identity"> & Profile["identity"]
>;
