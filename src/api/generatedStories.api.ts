import { api } from "./client";

export async function getGeneratedStory(
  id: string
) {
  const response = await api.get(
    `/stories/${id}`
  );

  return response.data;
}

