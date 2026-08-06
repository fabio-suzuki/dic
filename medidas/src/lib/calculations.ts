import { ACTIVITY_OPTIONS } from '../constants/fields';
import {
  Focus,
  MeasurementKey,
  MeasurementRecord,
  MeasurementValues,
  Profile,
} from '../types/measurements';

/** Converte texto digitado (aceita vírgula) em número métrico válido. */
export function parseMetric(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const normalized = text.replace(',', '.').trim();
  if (normalized.length === 0) return undefined;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return value;
}

export function formatMetric(value: number | undefined, digits = 1): string {
  if (value === undefined) return '—';
  return value.toFixed(digits).replace('.', ',');
}

export function formatSigned(value: number, digits = 1): string {
  const formatted = Math.abs(value).toFixed(digits).replace('.', ',');
  if (Math.abs(value) < 0.05) return '=';
  return `${value > 0 ? '+' : '−'}${formatted}`;
}

export function bmi(weightKg?: number, heightCm?: number): number | undefined {
  if (!weightKg || !heightCm) return undefined;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function bmiCategory(value: number): { label: string; risk: 'low' | 'medium' | 'high' } {
  if (value < 18.5) return { label: 'Abaixo do peso', risk: 'medium' };
  if (value < 25) return { label: 'Peso adequado', risk: 'low' };
  if (value < 30) return { label: 'Sobrepeso', risk: 'medium' };
  return { label: 'Obesidade', risk: 'high' };
}

/** Razão cintura/quadril. */
export function waistHipRatio(values: MeasurementValues): number | undefined {
  if (!values.cintura || !values.quadril) return undefined;
  return values.cintura / values.quadril;
}

/** Razão cintura/altura — melhor preditor simples de risco cardiometabólico. */
export function waistHeightRatio(values: MeasurementValues, heightCm?: number): number | undefined {
  if (!values.cintura || !heightCm) return undefined;
  return values.cintura / heightCm;
}

/**
 * Percentual de gordura pelo método US Navy (circunferências em cm).
 * Homens: pescoço, abdômen (ou cintura). Mulheres: pescoço, cintura e quadril.
 */
export function bodyFatNavy(
  values: MeasurementValues,
  profile: Profile
): number | undefined {
  const height = profile.heightCm;
  const neck = values.pescoco;
  const waist = values.abdomen ?? values.cintura;
  if (!height || !neck || !waist) return undefined;

  if (profile.sex === 'masculino') {
    if (waist - neck <= 0) return undefined;
    const result =
      495 /
        (1.0324 -
          0.19077 * Math.log10(waist - neck) +
          0.15456 * Math.log10(height)) -
      450;
    return clampPercent(result);
  }

  const hip = values.quadril;
  if (!hip) return undefined;
  const sum = values.cintura ?? waist;
  if (sum + hip - neck <= 0) return undefined;
  const result =
    495 /
      (1.29579 -
        0.35004 * Math.log10(sum + hip - neck) +
        0.221 * Math.log10(height)) -
    450;
  return clampPercent(result);
}

function clampPercent(value: number): number | undefined {
  if (!Number.isFinite(value) || value <= 2 || value >= 70) return undefined;
  return value;
}

export function leanMass(weightKg?: number, bodyFatPercent?: number): number | undefined {
  if (!weightKg || bodyFatPercent === undefined) return undefined;
  return weightKg * (1 - bodyFatPercent / 100);
}

export function age(profile: Profile): number | undefined {
  if (!profile.birthYear) return undefined;
  const value = new Date().getFullYear() - profile.birthYear;
  return value > 0 && value < 120 ? value : undefined;
}

/** Taxa metabólica basal (Mifflin-St Jeor). */
export function bmr(weightKg: number, heightCm: number, years: number, profile: Profile): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * years;
  return profile.sex === 'masculino' ? base + 5 : base - 161;
}

export function activityFactor(profile: Profile): number {
  return ACTIVITY_OPTIONS.find((o) => o.value === profile.activity)?.factor ?? 1.55;
}

export const FOCUS_CALORIE_ADJUSTMENT: Record<Focus, number> = {
  emagrecimento: -0.2,
  definicao: -0.1,
  hipertrofia: 0.12,
  manutencao: 0,
  saude: 0,
};

export interface EnergyPlan {
  bmr: number;
  tdee: number;
  target: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  waterMl: number;
}

export function energyPlan(profile: Profile, weightKg?: number): EnergyPlan | undefined {
  const years = age(profile);
  if (!weightKg || !profile.heightCm || years === undefined) return undefined;

  const basal = bmr(weightKg, profile.heightCm, years, profile);
  const tdee = basal * activityFactor(profile);
  const target = tdee * (1 + FOCUS_CALORIE_ADJUSTMENT[profile.focus]);

  const proteinPerKg =
    profile.focus === 'hipertrofia' || profile.focus === 'definicao'
      ? 2
      : profile.focus === 'emagrecimento'
        ? 1.8
        : 1.4;
  const proteinG = weightKg * proteinPerKg;
  const fatG = (target * 0.27) / 9;
  const carbG = Math.max(0, (target - proteinG * 4 - fatG * 9) / 4);

  return {
    bmr: basal,
    tdee,
    target,
    proteinG,
    fatG,
    carbG,
    waterMl: weightKg * 35,
  };
}

export interface Delta {
  key: MeasurementKey;
  current: number;
  previous: number;
  diff: number;
  percent: number;
}

export function deltasBetween(
  current: MeasurementRecord,
  previous: MeasurementRecord
): Delta[] {
  const keys = Object.keys(current.values) as MeasurementKey[];
  return keys
    .map((key) => {
      const currentValue = current.values[key];
      const previousValue = previous.values[key];
      if (currentValue === undefined || previousValue === undefined) return null;
      const diff = currentValue - previousValue;
      return {
        key,
        current: currentValue,
        previous: previousValue,
        diff,
        percent: previousValue === 0 ? 0 : (diff / previousValue) * 100,
      };
    })
    .filter((d): d is Delta => d !== null);
}

/** Série cronológica (mais antigo → mais recente) de uma medida. */
export function seriesFor(
  records: MeasurementRecord[],
  key: MeasurementKey
): { date: string; value: number }[] {
  return [...records]
    .filter((r) => r.values[key] !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt)
    .map((r) => ({ date: r.date, value: r.values[key] as number }));
}

export function asymmetry(right?: number, left?: number): number | undefined {
  if (right === undefined || left === undefined) return undefined;
  const base = Math.max(right, left);
  if (base === 0) return undefined;
  return (Math.abs(right - left) / base) * 100;
}

export function todayIso(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatDateBr(iso: string): string {
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

/** Converte texto dd/mm/aaaa em ISO; retorna undefined enquanto a data está incompleta. */
export function brToIso(text: string): string | undefined {
  const match = text.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T12:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  if (date.getMonth() + 1 !== Number(month) || date.getDate() !== Number(day)) return undefined;
  return `${year}-${month}-${day}`;
}

/** Aplica a máscara dd/mm/aaaa conforme a pessoa digita, sem descartar o que foi digitado. */
export function maskDateBr(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
