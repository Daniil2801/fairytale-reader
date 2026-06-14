import type { UserProfile } from "@/types/user";
import { api } from "./client";

export async function getProfile(): Promise<UserProfile> {
  const response =
    await api.get<UserProfile>(
      "/users/me"
    );

  return response.data;
}