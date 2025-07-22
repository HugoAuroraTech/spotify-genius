# 🎵 Spotify Stats & Playlist Genius

⚠️ **AVISO**: Devido a mudanças na API do Spotify (Nov 2024), algumas funcionalidades estão temporariamente indisponíveis. [Leia mais](./SPOTIFY_API_DEPRECATION_NOTICE.md)

Uma aplicação web interativa que permite aos usuários visualizar suas estatísticas musicais do Spotify. **Funcionalidades de análise de playlists estão temporariamente indisponíveis devido a limitações da API.**

![Spotify Genius Preview](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

## ✨ Funcionalidades

- 🔐 **Autenticação OAuth 2.0** com Spotify
- 📊 **Estatísticas Personalizadas**: Visualize seus artistas e músicas mais ouvidos
- 🎯 **Análise Temporal**: Dados dos últimos 30 dias, 6 meses ou de todos os tempos
- 🎵 **Análise de Playlist**: Características de áudio com gráficos interativos
- 🤖 **Gerador Inteligente**: Crie playlists baseadas em parâmetros de áudio
- 📱 **Design Responsivo**: Interface otimizada para mobile e desktop

## 🛠️ Stack Tecnológico

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Roteamento**: React Router DOM
- **HTTP Client**: Axios
- **Estilização**: Styled Components
- **Gráficos**: Recharts
- **Linting**: ESLint

## 🚀 Configuração e Instalação

### 1. Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Spotify (para uso da aplicação)
- Conta de desenvolvedor do Spotify

### 2. Configuração do Spotify Developer Dashboard

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Faça login com sua conta do Spotify
3. Clique em **"Create App"**
4. Preencha os dados da aplicação:
   - **App name**: `Spotify Genius`
   - **App description**: `Aplicação para análise de estatísticas musicais`
   - **Website**: `http://localhost:5173` (durante desenvolvimento)
   - **Redirect URIs**: `http://localhost:5173/callback`
5. Salve a aplicação e anote o **Client ID**

### 3. Instalação do Projeto

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/spotify-genius.git
cd spotify-genius

# Instale as dependências
npm install
```

### 4. Configuração das Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_CLIENT_ID=seu_client_id_do_spotify_aqui
VITE_REDIRECT_URI=http://localhost:5173/callback
```

2. Substitua `seu_client_id_do_spotify_aqui` pelo Client ID obtido no Spotify Developer Dashboard

### 5. Executar o Projeto

```bash
# Modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

A aplicação estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── context/            # React Context
├── hooks/              # Hooks customizados
│   ├── useAuth.ts
│   └── useSpotifyData.ts
├── pages/              # Páginas da aplicação
│   ├── Login.tsx
│   ├── Callback.tsx
│   └── Dashboard.tsx
├── services/           # Serviços de API
│   └── spotifyAPI.ts
├── styles/             # Estilos globais
├── types/              # Definições TypeScript
│   └── spotify.d.ts
├── utils/              # Funções utilitárias
├── App.tsx             # Componente principal
└── main.tsx           # Ponto de entrada
```

## 🔑 Principais Hooks e Serviços

### useAuth()
Hook para gerenciamento de autenticação:
- `isAuthenticated`: Status de autenticação
- `token`: Token de acesso atual
- `isLoading`: Estado de carregamento
- `login()`: Função para fazer login
- `logout()`: Função para fazer logout

### useSpotifyData()
Hooks para buscar dados do Spotify:
- `useUserProfile()`: Dados do perfil do usuário
- `useTopArtists()`: Artistas mais ouvidos
- `useTopTracks()`: Músicas mais ouvidas

### spotifyService
Serviço centralizado para API do Spotify com métodos para:
- Buscar perfil do usuário
- Obter top artistas e músicas
- Analisar características de áudio
- Gerar recomendações
- Criar e gerenciar playlists

## 🎨 Temas e Estilização

O projeto utiliza um tema baseado nas cores do Spotify:
- **Verde principal**: `#1db954`
- **Verde claro**: `#1ed760`
- **Preto**: `#191414`
- **Transparências**: Para efeitos de vidro

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Segurança

- Tokens de acesso armazenados localmente
- Verificação automática de expiração
- Interceptors para tratamento de erros de autenticação
- Rotas protegidas com verificação de autenticação

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `VITE_CLIENT_ID`
   - `VITE_REDIRECT_URI` (URL de produção + `/callback`)
3. Atualize o Redirect URI no Spotify Developer Dashboard

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configure as variáveis de ambiente
4. Atualize o Redirect URI no Spotify Developer Dashboard

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) pela API fantástica
- [React](https://reactjs.org/) e ecossistema
- [Styled Components](https://styled-components.com/) pela estilização
- [Recharts](https://recharts.org/) pelos gráficos

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, abra uma [issue](https://github.com/seu-usuario/spotify-genius/issues) no GitHub.

---

**Desenvolvido com ❤️ e muito ☕**
