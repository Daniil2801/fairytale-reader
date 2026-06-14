import { api } from "./client";

export async function generateStory(
  data: {
    childName: string;
    age: number;
    theme: string;
    favoriteAnimal: string;
  }
) {
  const response = await api.post(
    "/stories/generate",
    data
  );

  return response.data;
}

export async function getMyStories() {
  const response = await api.get(
    "/stories/my"
  );

  return response.data;
}

export async function deleteStory(
  id: string
) {
  await api.delete(
    `/stories/${id}`
  );
}

export async function toggleFavorite(
  id: string
) {
  const response =
    await api.patch(
      `/stories/${id}/favorite`
    );

  return response.data;
}