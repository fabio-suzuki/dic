import AsyncStorage from '@react-native-async-storage/async-storage';
import { Draft, MeasurementRecord, Profile } from '../types/measurements';

const KEYS = {
  records: '@medidas/records/v1',
  profile: '@medidas/profile/v1',
  draft: '@medidas/draft/v1',
};

export const DEFAULT_PROFILE: Profile = {
  name: '',
  sex: 'feminino',
  focus: 'saude',
  activity: 'moderado',
};

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Armazenamento indisponível: mantemos o estado em memória.
  }
}

export async function loadRecords(): Promise<MeasurementRecord[]> {
  const records = await readJson<MeasurementRecord[]>(KEYS.records);
  if (!records) return [];
  return [...records].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}

export async function saveRecords(records: MeasurementRecord[]): Promise<void> {
  await writeJson(KEYS.records, records);
}

export async function loadProfile(): Promise<Profile> {
  const profile = await readJson<Profile>(KEYS.profile);
  return profile ? { ...DEFAULT_PROFILE, ...profile } : DEFAULT_PROFILE;
}

export async function saveProfile(profile: Profile): Promise<void> {
  await writeJson(KEYS.profile, profile);
}

export async function loadDraft(): Promise<Draft | null> {
  return readJson<Draft>(KEYS.draft);
}

export async function saveDraft(draft: Draft): Promise<void> {
  await writeJson(KEYS.draft, draft);
}

export async function clearDraft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.draft);
  } catch {
    // ignore
  }
}
