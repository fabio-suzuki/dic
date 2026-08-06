import { FIELD_LABELS } from '../constants/fields';
import { MeasurementRecord, Profile } from '../types/measurements';
import {
  asymmetry,
  bmi,
  bmiCategory,
  bodyFatNavy,
  deltasBetween,
  formatMetric,
  formatSigned,
  leanMass,
  waistHeightRatio,
  waistHipRatio,
} from './calculations';

export type InsightTone = 'positivo' | 'atencao' | 'alerta' | 'neutro';

export interface Insight {
  id: string;
  title: string;
  description: string;
  tone: InsightTone;
  emoji: string;
}

const DAY_MS = 86_400_000;

export function buildInsights(records: MeasurementRecord[], profile: Profile): Insight[] {
  if (records.length === 0) {
    return [
      {
        id: 'sem-dados',
        title: 'Registre sua primeira medição',
        description:
          'Assim que houver dados, os insights mostram composição corporal, tendências e riscos.',
        tone: 'neutro',
        emoji: '📝',
      },
    ];
  }

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : undefined;
  const first = sorted[0];
  const insights: Insight[] = [];

  const imc = bmi(latest.values.peso, profile.heightCm);
  if (imc !== undefined) {
    const category = bmiCategory(imc);
    insights.push({
      id: 'imc',
      title: `IMC ${formatMetric(imc)} — ${category.label}`,
      description:
        category.risk === 'low'
          ? 'Faixa considerada adequada. Use circunferências e % de gordura para acompanhar a composição.'
          : 'O IMC não separa massa magra de gordura: acompanhe também cintura e % de gordura.',
      tone: category.risk === 'low' ? 'positivo' : category.risk === 'medium' ? 'atencao' : 'alerta',
      emoji: '⚖️',
    });
  } else if (!profile.heightCm) {
    insights.push({
      id: 'sem-altura',
      title: 'Informe sua altura no perfil',
      description: 'Com a altura o app calcula IMC, % de gordura e as metas calóricas.',
      tone: 'neutro',
      emoji: '📏',
    });
  }

  const whtr = waistHeightRatio(latest.values, profile.heightCm);
  if (whtr !== undefined) {
    const high = whtr >= 0.5;
    insights.push({
      id: 'cintura-altura',
      title: `Cintura/altura ${formatMetric(whtr, 2)}`,
      description: high
        ? 'Acima de 0,50 indica gordura abdominal elevada. Reduzir a cintura é a prioridade nº 1.'
        : 'Abaixo de 0,50 — indicador de risco cardiometabólico baixo. Mantenha.',
      tone: high ? 'alerta' : 'positivo',
      emoji: '📐',
    });
  }

  const whr = waistHipRatio(latest.values);
  if (whr !== undefined) {
    const threshold = profile.sex === 'masculino' ? 0.9 : 0.85;
    const high = whr > threshold;
    insights.push({
      id: 'cintura-quadril',
      title: `Cintura/quadril ${formatMetric(whr, 2)}`,
      description: high
        ? `Acima do limite de referência (${formatMetric(threshold, 2)}) — distribuição andróide de gordura.`
        : 'Dentro da faixa de referência para o seu perfil.',
      tone: high ? 'atencao' : 'positivo',
      emoji: '🩺',
    });
  }

  const bf = bodyFatNavy(latest.values, profile);
  if (bf !== undefined) {
    const lean = leanMass(latest.values.peso, bf);
    insights.push({
      id: 'gordura',
      title: `Gordura estimada ${formatMetric(bf)}%`,
      description: lean
        ? `Massa magra aproximada de ${formatMetric(lean)} kg (método US Navy, estimativa por circunferências).`
        : 'Estimativa pelo método US Navy a partir das circunferências.',
      tone: 'neutro',
      emoji: '🧬',
    });

    const previousBf = previous ? bodyFatNavy(previous.values, profile) : undefined;
    if (previousBf !== undefined && Math.abs(bf - previousBf) >= 0.3) {
      const down = bf < previousBf;
      insights.push({
        id: 'gordura-tendencia',
        title: `Gordura ${down ? 'em queda' : 'em alta'} (${formatSigned(bf - previousBf)} p.p.)`,
        description: down
          ? 'A composição corporal está melhorando em relação à medição anterior.'
          : 'Reveja aderência ao plano alimentar e volume de treino das últimas semanas.',
        tone: down ? 'positivo' : 'atencao',
        emoji: down ? '📉' : '📈',
      });
    }
  }

  if (previous) {
    const deltas = deltasBetween(latest, previous);
    const weight = deltas.find((d) => d.key === 'peso');
    if (weight) {
      const days = Math.max(1, Math.round((toTime(latest.date) - toTime(previous.date)) / DAY_MS));
      const perWeek = (weight.diff / days) * 7;
      insights.push({
        id: 'peso-ritmo',
        title: `Peso ${formatSigned(weight.diff)} kg em ${days} dia${days > 1 ? 's' : ''}`,
        description: `Ritmo de ${formatSigned(perWeek)} kg/semana. Variações entre −1% e +0,5% do peso por semana são as mais sustentáveis.`,
        tone: Math.abs(perWeek) > latest.values.peso! * 0.01 ? 'atencao' : 'neutro',
        emoji: '🏃',
      });
    }

    const biggest = deltas
      .filter((d) => d.key !== 'peso')
      .sort((a, b) => Math.abs(b.percent) - Math.abs(a.percent))[0];
    if (biggest && Math.abs(biggest.diff) >= 0.2) {
      insights.push({
        id: 'maior-variacao',
        title: `${FIELD_LABELS[biggest.key]}: ${formatSigned(biggest.diff)} cm`,
        description: `Maior variação desde ${formatShort(previous.date)} (${formatSigned(biggest.percent)}%).`,
        tone: 'neutro',
        emoji: '🔍',
      });
    }
  }

  const armAsym = asymmetry(latest.values.bracoDireito, latest.values.bracoEsquerdo);
  const legAsym = asymmetry(latest.values.coxaDireita, latest.values.coxaEsquerda);
  const worstAsym = [
    { label: 'braços', value: armAsym },
    { label: 'coxas', value: legAsym },
  ]
    .filter((a): a is { label: string; value: number } => a.value !== undefined)
    .sort((a, b) => b.value - a.value)[0];
  if (worstAsym && worstAsym.value >= 3) {
    insights.push({
      id: 'assimetria',
      title: `Assimetria de ${formatMetric(worstAsym.value)}% nos ${worstAsym.label}`,
      description:
        'Priorize exercícios unilaterais, começando sempre pelo lado menor e igualando as repetições.',
      tone: 'atencao',
      emoji: '⚠️',
    });
  }

  if (sorted.length >= 3) {
    const waistFirst = first.values.cintura;
    const waistLast = latest.values.cintura;
    if (waistFirst !== undefined && waistLast !== undefined) {
      insights.push({
        id: 'cintura-total',
        title: `Cintura ${formatSigned(waistLast - waistFirst)} cm desde ${formatShort(first.date)}`,
        description: 'Balanço total do período registrado — a métrica mais sensível à gordura visceral.',
        tone: waistLast <= waistFirst ? 'positivo' : 'atencao',
        emoji: '🧭',
      });
    }
  }

  const daysSinceLast = Math.round((Date.now() - toTime(latest.date)) / DAY_MS);
  if (daysSinceLast > 21) {
    insights.push({
      id: 'frequencia',
      title: `Última medição há ${daysSinceLast} dias`,
      description: 'Meça a cada 7 a 14 dias, sempre no mesmo horário e condições, para ver tendências reais.',
      tone: 'atencao',
      emoji: '⏰',
    });
  }

  return insights;
}

function toTime(iso: string): number {
  return new Date(`${iso}T12:00:00`).getTime();
}

function formatShort(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
}
