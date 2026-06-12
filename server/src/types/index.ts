export interface Profile {
  id: string;
  meta: {
    created_at: string;
    updated_at: string;
  };
  identity: {
    last_name: string | null;
    first_name: string;
    middle_name: string | null;
    dob: string;
    gender: string;
    nationality: string;
  };
  contacts: Contacts | null;
  social_accounts: SocialAccounts[] | null;
}

export interface Contacts {
  emails: string[] | null;
  phones: string[] | null;
}

export interface SocialAccounts {
  platform: string;
  handle: string;
  url: string;
}
