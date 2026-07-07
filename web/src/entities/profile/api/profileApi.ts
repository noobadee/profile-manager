import { baseFetch } from "@/shared/api/base-instance";

export const profileApi = {
  getAll: () => baseFetch("/profiles"),
}