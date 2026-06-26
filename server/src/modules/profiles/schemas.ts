import { z } from "zod";

const ContactSchema = z.object({
  emails: z.array(z.string().min(1).max(255)).nullable().default(null),
  phones: z.array(z.string().min(1).max(255)).nullable().default(null),
});

const SocialAccountSchema = z.object({
  platform: z.string().min(1).max(255),
  username: z.string().min(1).max(255),
  url: z.url({ error: "Must be a valid URL" }),
});

const AddressSchema = z.object({
  street: z.string().min(1).max(255).nullable().default(null),
  baranggay: z.string().min(1).max(255).nullable().default(null),
  city: z.string().min(1).max(255),
  province: z.string().min(1).max(255).nullable().default(null),
  postalCode: z
    .string()
    .regex(/^\d{4}$/, { error: "Invalid Philippine postal code" })
    .nullable()
    .default(null),
});

export const CreateProfileSchema = z.object({
  lastName: z.string().min(1).max(255).nullable().default(null),
  firstName: z.string().min(1).max(255).nullable().default(null),
  middleName: z.string().min(1).max(255).nullable().default(null),
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1 year old")
    .max(128, "Age must not older than 128 years old")
    .nullable()
    .default(null),
  dateOfBirth: z.iso
    .date()
    .refine((val) => new Date(val) < new Date(), {
      error: "Date of birth must be in the past",
    })
    .nullable()
    .default(null),
  gender: z.enum(["male", "female", "other"]).nullable().default(null),
  nationality: z.string().min(1).max(255).nullable().default(null),
  contacts: ContactSchema.nullable().default(null),
  socialAccounts: z.array(SocialAccountSchema).nullable().default(null),
  address: AddressSchema.nullable().default(null),
});

export type CreateProfileBody = z.infer<typeof CreateProfileSchema>;
