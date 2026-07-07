export const profileQueryKeys = {
  all: ["users"] as const,
  lists: () => [...profileQueryKeys.all, "list"] as const,
  detail: (id: string) => [...profileQueryKeys.all, "detail", id] as const,
};