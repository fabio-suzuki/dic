export type Sex = 'feminino' | 'masculino';

export type Focus = 'emagrecimento' | 'hipertrofia' | 'definicao' | 'manutencao' | 'saude';

export type ActivityLevel = 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'atleta';

/** Chaves das medidas corporais. Todas em escala métrica (kg / cm). */
export type MeasurementKey =
  | 'peso'
  | 'pescoco'
  | 'ombros'
  | 'peito'
  | 'cintura'
  | 'abdomen'
  | 'quadril'
  | 'bracoDireito'
  | 'bracoEsquerdo'
  | 'antebracoDireito'
  | 'antebracoEsquerdo'
  | 'coxaDireita'
  | 'coxaEsquerda'
  | 'panturrilhaDireita'
  | 'panturrilhaEsquerda';

export type MeasurementValues = Partial<Record<MeasurementKey, number>>;

/** Valores como texto: é o que fica salvo enquanto a pessoa digita. */
export type MeasurementDraftValues = Partial<Record<MeasurementKey, string>>;

export interface MeasurementRecord {
  id: string;
  /** ISO date (YYYY-MM-DD) da medição. */
  date: string;
  /** Timestamp de criação em milissegundos. */
  createdAt: number;
  values: MeasurementValues;
  note?: string;
}

export interface Profile {
  name: string;
  sex: Sex;
  birthYear?: number;
  /** Altura em centímetros. */
  heightCm?: number;
  focus: Focus;
  activity: ActivityLevel;
}

export interface Draft {
  /** Id do registro sendo editado, quando houver. */
  editingId?: string;
  /** Data como texto dd/mm/aaaa — preservada mesmo incompleta. */
  date: string;
  values: MeasurementDraftValues;
  note: string;
  savedAt: number;
}

export interface MeasurementField {
  key: MeasurementKey;
  label: string;
  unit: 'kg' | 'cm';
  hint: string;
  group: 'geral' | 'tronco' | 'membros';
}
