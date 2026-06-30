export function formatName(
  firstName: string | null,
  middleName: string | null,
  lastName: string | null,
) {
  return `${firstName ?? ""} ${middleName ?? ""} ${lastName ?? ""}`
    .trim()
    .replace(/\s+/g, " ");
}
