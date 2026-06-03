import * as Crypto from 'expo-crypto';

import { getJson, setJson } from '@/lib/storage';

const DEVICE_ID_KEY = '@fairytale/deviceId';

export async function getDeviceId(): Promise<string> {
  const existing = await getJson<string | null>(DEVICE_ID_KEY, null);
  if (existing) return existing;

  const id = Crypto.randomUUID();
  await setJson(DEVICE_ID_KEY, id);
  return id;
}
