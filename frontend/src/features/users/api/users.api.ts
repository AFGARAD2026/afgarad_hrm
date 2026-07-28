import { api } from "../../../lib/api/axios";

export async function getUsers() {
  const response = await api.get("/api/users/all");
  return response.data?.data ?? [];
}
