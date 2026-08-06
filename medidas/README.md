# 📏 Medidas — acompanhamento corporal em escala métrica

App mobile (React Native / Expo) para registrar medidas corporais em **kg e cm**, acompanhar a
evolução em gráficos e receber insights, treino e alimentação de acordo com o foco da pessoa.

## Funcionalidades

- **Registro completo** — peso e 14 circunferências (pescoço, ombros, peito, cintura, abdômen,
  quadril, braços, antebraços, coxas e panturrilhas), todas em escala métrica.
- **Nada se perde enquanto digita** — cada tecla grava um rascunho no armazenamento do aparelho
  (debounce de 400 ms) e o rascunho também é gravado quando o app vai para segundo plano. Ao
  reabrir o app, o formulário volta exatamente como estava, inclusive a data e as observações.
- **Gráficos de evolução** — série histórica por medida, além de IMC e gordura corporal estimada.
- **Insights** — IMC, cintura/altura, cintura/quadril, % de gordura (US Navy), massa magra, ritmo
  de perda/ganho de peso, maior variação do período e assimetrias entre lados.
- **Plano por foco** — emagrecimento, hipertrofia, definição, manutenção ou saúde geral, com divisão
  semanal de treino, orientação de cardio/progressão, meta calórica (Mifflin-St Jeor + fator de
  atividade), macros e sugestões de cardápio.
- **100% offline** — os dados ficam apenas no aparelho (AsyncStorage), sem conta nem servidor.

## Tecnologias

- [Expo](https://expo.dev/) ~56 · [React Native](https://reactnative.dev/) 0.85 ·
  [Expo Router](https://docs.expo.dev/router/introduction/) (tabs) · TypeScript 6
- `@react-native-async-storage/async-storage` para persistência
- `react-native-svg` para os gráficos

## Executar

```bash
cd medidas
npm install
npx expo start
```

Escolha a plataforma: **a** (Android), **i** (iOS) ou **w** (web).

## Estrutura

```
app/
  _layout.tsx            # Stack raiz + provider de dados
  (tabs)/_layout.tsx     # Abas: Medir, Evolução, Insights, Plano, Perfil
  (tabs)/index.tsx       # Formulário de medição com autosave
  (tabs)/evolucao.tsx    # Gráficos de evolução
  (tabs)/insights.tsx    # Leitura automática das medidas
  (tabs)/plano.tsx       # Treino + alimentação por foco
  (tabs)/perfil.tsx      # Altura, idade, sexo, atividade e foco
  historico.tsx          # Lista de medições (editar/excluir)
src/
  components/            # Card, Segmented, MeasurementInput, LineChart
  constants/             # Tema e definição dos campos de medida
  hooks/                 # MeasurementsProvider (estado + autosave)
  lib/                   # Cálculos, insights, planos e storage
  types/                 # Tipos do domínio
```

## Fórmulas usadas

| Indicador | Fórmula |
| --- | --- |
| IMC | peso / altura² |
| Gordura corporal | US Navy (log₁₀ de circunferências) |
| TMB | Mifflin-St Jeor |
| Gasto total | TMB × fator de atividade (1,2 a 1,9) |
| Meta calórica | gasto total ± ajuste do foco (−20% a +12%) |

As estimativas são orientativas e não substituem avaliação profissional.
