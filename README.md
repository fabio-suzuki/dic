# 🏳️‍🌈 Pajubá — Dicionário Ilustrado

App mobile (React Native / Expo) que funciona como um dicionário ilustrado de **Pajubá**, o dialeto utilizado pela comunidade LGBT+ no Brasil.

## Funcionalidades

- **Busca de verbetes** — pesquise por termo, definição ou tag
- **Definição completa** — cada verbete inclui definição, semântica e exemplo de uso
- **Ilustrações** — emojis contextuais para facilitar o entendimento
- **Tags categorizadas** — identidade, moda, expressão, social, gíria, etc.
- **Interface com cores do orgulho** — barra arco-íris e paleta LGBT+

## Tecnologias

- [Expo](https://expo.dev/) ~56
- [React Native](https://reactnative.dev/) 0.85
- [Expo Router](https://docs.expo.dev/router/introduction/) v5
- TypeScript 6

## Requisitos

- Node.js 20+ (recomendado 22)
- npm 10+
- Expo CLI (`npx expo`)

## Instalação

```bash
npm install
```

## Executar

```bash
npx expo start
```

Escolha a plataforma:
- **a** — Android (emulador ou dispositivo)
- **i** — iOS (simulador, apenas macOS)
- **w** — Web

## Publicar com Expo

```bash
npx expo export
# ou para EAS Build:
npx eas build --platform all
```

## Estrutura do Projeto

```
app/
  _layout.tsx        # Layout raiz (Stack Navigator)
  index.tsx          # Tela principal (busca + lista)
  term/[id].tsx      # Tela de detalhe do verbete
src/
  components/        # Componentes reutilizáveis
  constants/         # Tema, cores, espaçamentos
  data/              # Base de dados dos verbetes
  types/             # Interfaces TypeScript
assets/              # Ícones e imagens
```

## Outros apps neste repositório

- [`medidas/`](./medidas) — **Medidas**: registro de medidas corporais em escala métrica, com
  autosave enquanto digita, gráficos de evolução, insights e planos de treino/alimentação.

## Licença

MIT
