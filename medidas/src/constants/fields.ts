import { ActivityLevel, Focus, MeasurementField, MeasurementKey } from '../types/measurements';

export const MEASUREMENT_FIELDS: MeasurementField[] = [
  { key: 'peso', label: 'Peso', unit: 'kg', hint: 'Em jejum, pela manhã', group: 'geral' },
  { key: 'pescoco', label: 'Pescoço', unit: 'cm', hint: 'Abaixo do pomo de adão', group: 'tronco' },
  { key: 'ombros', label: 'Ombros', unit: 'cm', hint: 'Parte mais larga', group: 'tronco' },
  { key: 'peito', label: 'Peito', unit: 'cm', hint: 'Na linha dos mamilos', group: 'tronco' },
  { key: 'cintura', label: 'Cintura', unit: 'cm', hint: 'Parte mais estreita', group: 'tronco' },
  { key: 'abdomen', label: 'Abdômen', unit: 'cm', hint: 'Na altura do umbigo', group: 'tronco' },
  { key: 'quadril', label: 'Quadril', unit: 'cm', hint: 'Parte mais larga do glúteo', group: 'tronco' },
  { key: 'bracoDireito', label: 'Braço direito', unit: 'cm', hint: 'Contraído ou relaxado (mantenha o padrão)', group: 'membros' },
  { key: 'bracoEsquerdo', label: 'Braço esquerdo', unit: 'cm', hint: 'Mesmo padrão do direito', group: 'membros' },
  { key: 'antebracoDireito', label: 'Antebraço direito', unit: 'cm', hint: 'Parte mais grossa', group: 'membros' },
  { key: 'antebracoEsquerdo', label: 'Antebraço esquerdo', unit: 'cm', hint: 'Parte mais grossa', group: 'membros' },
  { key: 'coxaDireita', label: 'Coxa direita', unit: 'cm', hint: 'Meio da coxa', group: 'membros' },
  { key: 'coxaEsquerda', label: 'Coxa esquerda', unit: 'cm', hint: 'Meio da coxa', group: 'membros' },
  { key: 'panturrilhaDireita', label: 'Panturrilha direita', unit: 'cm', hint: 'Parte mais grossa', group: 'membros' },
  { key: 'panturrilhaEsquerda', label: 'Panturrilha esquerda', unit: 'cm', hint: 'Parte mais grossa', group: 'membros' },
];

export const FIELD_LABELS: Record<MeasurementKey, string> = MEASUREMENT_FIELDS.reduce(
  (acc, field) => ({ ...acc, [field.key]: field.label }),
  {} as Record<MeasurementKey, string>
);

export const FIELD_UNITS: Record<MeasurementKey, 'kg' | 'cm'> = MEASUREMENT_FIELDS.reduce(
  (acc, field) => ({ ...acc, [field.key]: field.unit }),
  {} as Record<MeasurementKey, 'kg' | 'cm'>
);

export const GROUP_LABELS: Record<MeasurementField['group'], string> = {
  geral: 'Geral',
  tronco: 'Tronco',
  membros: 'Membros',
};

export const FOCUS_OPTIONS: { value: Focus; label: string; emoji: string }[] = [
  { value: 'emagrecimento', label: 'Emagrecimento', emoji: '🔥' },
  { value: 'hipertrofia', label: 'Hipertrofia', emoji: '💪' },
  { value: 'definicao', label: 'Definição', emoji: '✂️' },
  { value: 'manutencao', label: 'Manutenção', emoji: '⚖️' },
  { value: 'saude', label: 'Saúde geral', emoji: '❤️' },
];

export const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; factor: number }[] = [
  { value: 'sedentario', label: 'Sedentário', factor: 1.2 },
  { value: 'leve', label: 'Leve (1-2x)', factor: 1.375 },
  { value: 'moderado', label: 'Moderado (3-4x)', factor: 1.55 },
  { value: 'intenso', label: 'Intenso (5-6x)', factor: 1.725 },
  { value: 'atleta', label: 'Atleta (2x/dia)', factor: 1.9 },
];
