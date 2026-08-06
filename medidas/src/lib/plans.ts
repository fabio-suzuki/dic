import { Focus } from '../types/measurements';

export interface TrainingDay {
  day: string;
  title: string;
  exercises: string[];
}

export interface TrainingPlan {
  headline: string;
  summary: string;
  weeklySplit: TrainingDay[];
  cardio: string;
  progression: string;
}

export interface NutritionPlan {
  headline: string;
  summary: string;
  priorities: string[];
  meals: { name: string; suggestion: string }[];
  avoid: string[];
}

export const TRAINING_PLANS: Record<Focus, TrainingPlan> = {
  emagrecimento: {
    headline: 'Full body + gasto calórico',
    summary:
      'Treinos de corpo inteiro em circuito para manter massa magra enquanto o déficit calórico reduz a gordura.',
    weeklySplit: [
      { day: 'Seg', title: 'Full body A', exercises: ['Agachamento livre 3x12', 'Supino halteres 3x12', 'Remada curvada 3x12', 'Prancha 3x40s'] },
      { day: 'Ter', title: 'Cardio contínuo', exercises: ['40 min de caminhada inclinada ou bike em Z2'] },
      { day: 'Qua', title: 'Full body B', exercises: ['Levantamento terra romeno 3x10', 'Desenvolvimento 3x12', 'Puxada alta 3x12', 'Abdominal remador 3x15'] },
      { day: 'Qui', title: 'Ativo', exercises: ['Mobilidade 20 min', '8-10 mil passos'] },
      { day: 'Sex', title: 'Full body C (circuito)', exercises: ['Leg press 3x15', 'Flexão de braço 3x máx', 'Remada baixa 3x15', 'Burpee 3x10'] },
      { day: 'Sáb', title: 'HIIT curto', exercises: ['10 x 30s forte / 60s leve'] },
      { day: 'Dom', title: 'Descanso', exercises: ['Alongamento e sono de 7-9h'] },
    ],
    cardio: '150-250 min semanais somando Z2 e HIIT, sempre após a musculação.',
    progression: 'Mantenha as cargas e aumente densidade (menos descanso) enquanto o peso cai.',
  },
  hipertrofia: {
    headline: 'Upper/Lower 4x por semana',
    summary: 'Volume progressivo por grupo muscular com foco em sobrecarga e recuperação.',
    weeklySplit: [
      { day: 'Seg', title: 'Superior A (força)', exercises: ['Supino reto 4x6-8', 'Remada curvada 4x6-8', 'Desenvolvimento 3x8', 'Rosca direta 3x10'] },
      { day: 'Ter', title: 'Inferior A', exercises: ['Agachamento 4x6-8', 'Terra romeno 3x8', 'Cadeira extensora 3x12', 'Panturrilha 4x15'] },
      { day: 'Qua', title: 'Descanso ativo', exercises: ['Caminhada leve 30 min'] },
      { day: 'Qui', title: 'Superior B (hipertrofia)', exercises: ['Supino inclinado 4x10', 'Puxada alta 4x10', 'Elevação lateral 4x15', 'Tríceps corda 3x12'] },
      { day: 'Sex', title: 'Inferior B', exercises: ['Leg press 4x12', 'Mesa flexora 4x12', 'Afundo 3x12 por perna', 'Abdominal infra 3x15'] },
      { day: 'Sáb', title: 'Pontos fracos', exercises: ['2 exercícios para o grupo mais atrasado nas medidas'] },
      { day: 'Dom', title: 'Descanso', exercises: ['Sono de 8h — a hipertrofia acontece aqui'] },
    ],
    cardio: 'Máximo 2 sessões leves de 20-30 min para não competir com a recuperação.',
    progression: 'Adicione 2,5% de carga ou 1 repetição por série a cada semana (sobrecarga progressiva).',
  },
  definicao: {
    headline: 'Push/Pull/Legs + cardio moderado',
    summary: 'Preserva massa magra com volume alto e déficit leve para revelar definição.',
    weeklySplit: [
      { day: 'Seg', title: 'Push', exercises: ['Supino reto 4x10', 'Desenvolvimento 3x12', 'Crucifixo 3x15', 'Tríceps testa 3x12'] },
      { day: 'Ter', title: 'Pull', exercises: ['Barra fixa/puxada 4x10', 'Remada baixa 4x12', 'Face pull 3x15', 'Rosca martelo 3x12'] },
      { day: 'Qua', title: 'Legs', exercises: ['Agachamento 4x10', 'Stiff 3x12', 'Búlgaro 3x12', 'Panturrilha 4x20'] },
      { day: 'Qui', title: 'Cardio + core', exercises: ['30 min Z2', 'Circuito de core 4 exercícios'] },
      { day: 'Sex', title: 'Push/Pull misto', exercises: ['Supino inclinado 3x12', 'Remada unilateral 3x12', 'Elevação lateral 4x15'] },
      { day: 'Sáb', title: 'Legs + HIIT', exercises: ['Leg press 4x15', 'Mesa flexora 3x15', '8 x 20s sprint'] },
      { day: 'Dom', title: 'Descanso', exercises: ['Mobilidade e alongamento'] },
    ],
    cardio: '3 sessões semanais: 2 em Z2 de 30 min e 1 HIIT curto.',
    progression: 'Mantenha as cargas altas: perder força indica déficit agressivo demais.',
  },
  manutencao: {
    headline: 'Híbrido 3x força + 2x condicionamento',
    summary: 'Equilíbrio entre força, condicionamento e consistência de longo prazo.',
    weeklySplit: [
      { day: 'Seg', title: 'Força total A', exercises: ['Agachamento 3x8', 'Supino 3x8', 'Remada 3x10', 'Prancha 3x45s'] },
      { day: 'Ter', title: 'Condicionamento', exercises: ['30-40 min corrida/bike em ritmo confortável'] },
      { day: 'Qua', title: 'Descanso', exercises: ['Caminhada leve'] },
      { day: 'Qui', title: 'Força total B', exercises: ['Terra 3x6', 'Desenvolvimento 3x10', 'Puxada 3x10', 'Abdominal 3x15'] },
      { day: 'Sex', title: 'Condicionamento', exercises: ['Circuito funcional 25 min'] },
      { day: 'Sáb', title: 'Atividade que você gosta', exercises: ['Esporte, trilha, dança — 60 min'] },
      { day: 'Dom', title: 'Descanso', exercises: ['Recuperação e sono'] },
    ],
    cardio: '2 a 3 sessões semanais de intensidade moderada.',
    progression: 'Revise as cargas a cada 4 semanas; mantenha as medidas dentro de ±2 cm.',
  },
  saude: {
    headline: 'Base de saúde: força leve + mobilidade',
    summary: 'Prioriza pressão, glicemia, mobilidade e criação do hábito de treinar.',
    weeklySplit: [
      { day: 'Seg', title: 'Força guiada', exercises: ['Leg press 2x15', 'Supino máquina 2x15', 'Remada máquina 2x15', 'Prancha 3x30s'] },
      { day: 'Ter', title: 'Caminhada', exercises: ['30-40 min em ritmo que permita conversar'] },
      { day: 'Qua', title: 'Mobilidade', exercises: ['Yoga ou alongamento 25 min'] },
      { day: 'Qui', title: 'Força guiada', exercises: ['Agachamento assistido 2x12', 'Puxada 2x15', 'Elevação lateral 2x15'] },
      { day: 'Sex', title: 'Caminhada', exercises: ['30-40 min + escadas'] },
      { day: 'Sáb', title: 'Lazer ativo', exercises: ['Bicicleta, natação ou dança'] },
      { day: 'Dom', title: 'Descanso', exercises: ['Sono regular e hidratação'] },
    ],
    cardio: 'Meta de 7.000 a 10.000 passos diários.',
    progression: 'Some 5 minutos por semana até chegar a 150 min de atividade moderada.',
  },
};

export const NUTRITION_PLANS: Record<Focus, NutritionPlan> = {
  emagrecimento: {
    headline: 'Déficit calórico de ~20% com proteína alta',
    summary: 'Volume alimentar alto e saciedade para sustentar o déficit sem perder massa magra.',
    priorities: [
      'Proteína em todas as refeições (1,8 g por kg ao dia)',
      'Metade do prato com vegetais e folhas',
      '25-35 g de fibras por dia',
      'Água: 35 ml por kg de peso',
    ],
    meals: [
      { name: 'Café da manhã', suggestion: 'Ovos mexidos + pão integral + fruta' },
      { name: 'Almoço', suggestion: 'Frango grelhado, arroz integral, feijão e salada à vontade' },
      { name: 'Lanche', suggestion: 'Iogurte natural com frutas vermelhas e chia' },
      { name: 'Jantar', suggestion: 'Peixe assado com legumes no vapor e purê de abóbora' },
      { name: 'Ceia', suggestion: 'Queijo cottage ou caseína se houver fome noturna' },
    ],
    avoid: ['Bebidas calóricas e álcool frequente', 'Ultraprocessados e frituras', 'Beliscar fora das refeições'],
  },
  hipertrofia: {
    headline: 'Superávit leve (+10 a 15%) e proteína de 2 g/kg',
    summary: 'Energia suficiente para treinar pesado, com ganho controlado para limitar gordura.',
    priorities: [
      '2 g de proteína por kg distribuídos em 4-5 refeições',
      'Carboidrato antes e depois do treino',
      'Creatina 3-5 g por dia (evidência sólida)',
      'Superávit de 200-350 kcal por dia',
    ],
    meals: [
      { name: 'Café da manhã', suggestion: 'Aveia com leite, banana, pasta de amendoim e ovos' },
      { name: 'Pré-treino', suggestion: 'Pão + geleia + whey (1h antes)' },
      { name: 'Almoço', suggestion: 'Carne vermelha magra, arroz, feijão, legumes e azeite' },
      { name: 'Pós-treino', suggestion: 'Whey com fruta e carboidrato rápido' },
      { name: 'Jantar', suggestion: 'Frango ou peixe, batata-doce, salada e ovo' },
    ],
    avoid: ['Ficar mais de 5h sem comer', 'Superávit muito alto (ganho de gordura)', 'Álcool nos dias de treino pesado'],
  },
  definicao: {
    headline: 'Déficit leve (~10%) com proteína muito alta',
    summary: 'Recomposição corporal: perder gordura mantendo (ou ganhando) massa magra.',
    priorities: [
      '2 g de proteína por kg — inegociável',
      'Carboidrato concentrado ao redor do treino',
      'Gordura em 25-30% das calorias para hormônios',
      'Sódio e água constantes para leitura estável das medidas',
    ],
    meals: [
      { name: 'Café da manhã', suggestion: 'Omelete de claras + 2 ovos inteiros e fruta' },
      { name: 'Almoço', suggestion: 'Peito de frango, arroz, brócolis e salada' },
      { name: 'Pré-treino', suggestion: 'Fruta + café' },
      { name: 'Pós-treino', suggestion: 'Whey + batata-doce ou arroz' },
      { name: 'Jantar', suggestion: 'Peixe branco, legumes salteados e azeite' },
    ],
    avoid: ['Cortes calóricos agressivos', 'Cardio em jejum prolongado', 'Dietas sem carboidrato em semana de treino forte'],
  },
  manutencao: {
    headline: 'Calorias na manutenção com comida de verdade',
    summary: 'Estabilidade de peso e medidas com flexibilidade sustentável.',
    priorities: [
      '1,4-1,6 g de proteína por kg',
      '80% de alimentos minimamente processados / 20% livre',
      'Fibras e frutas diariamente',
      'Hidratação e sono consistentes',
    ],
    meals: [
      { name: 'Café da manhã', suggestion: 'Iogurte, granola sem açúcar e fruta' },
      { name: 'Almoço', suggestion: 'Prato equilibrado: proteína, carboidrato, legumes e salada' },
      { name: 'Lanche', suggestion: 'Castanhas e fruta' },
      { name: 'Jantar', suggestion: 'Sopa de legumes com proteína ou omelete completa' },
    ],
    avoid: ['Pular refeições e compensar à noite', 'Refrigerante diário', 'Excesso de álcool no fim de semana'],
  },
  saude: {
    headline: 'Padrão mediterrâneo',
    summary: 'Foco em pressão arterial, colesterol, glicemia e energia no dia a dia.',
    priorities: [
      'Azeite como gordura principal',
      'Peixe 2x por semana e leguminosas 4x',
      'Reduzir sódio e açúcar de adição',
      '5 porções de frutas e vegetais por dia',
    ],
    meals: [
      { name: 'Café da manhã', suggestion: 'Pão integral com azeite e tomate + fruta' },
      { name: 'Almoço', suggestion: 'Grão-de-bico ou lentilha com arroz integral e salada colorida' },
      { name: 'Lanche', suggestion: 'Fruta com castanhas' },
      { name: 'Jantar', suggestion: 'Sardinha ou salmão com legumes assados' },
    ],
    avoid: ['Embutidos e defumados', 'Excesso de sal na preparação', 'Doces diários'],
  },
};
