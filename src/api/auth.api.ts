import { api } from "./client";

export async function register(
  email: string,
  password: string
) {
  const response = await api.post(
    "/auth/register",
    {
      email,
      password,
    }
  );

  return response.data;
}

export async function login(
  email: string,
  password: string
) {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
}