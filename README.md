# 🎵 Spotify Stats & Playlist Genius

Uma aplicação web interativa moderna que oferece insights poderosos sobre seus hábitos musicais do Spotify com funcionalidades inovadoras de descoberta musical.

## ✨ **Funcionalidades Principais**

### 🏠 **Dashboard Inteligente**
- 📊 Estatísticas personalizadas dos seus hábitos musicais
- 🎤 Top artistas e músicas por diferentes períodos
- 🕒 Histórico das músicas tocadas recentemente
- 🆕 Novos lançamentos e descobertas

### 🕒 **Timeline Musical**
- 📅 Linha do tempo visual das suas músicas
- 🔍 Filtros por período (hoje, ontem, última semana)
- 📈 Estatísticas detalhadas de escuta
- 📱 Interface responsiva e interativa

### 🎤 **Explorer de Artistas**
- 🔍 Busca avançada de artistas
- 📊 Informações detalhadas e discografia completa
- 🎵 Top tracks e albums do artista
- 👥 Sistema de seguir/parar de seguir

### 🔍 **Discovery Hub**
- 🎯 Busca universal (músicas, artistas, albums, playlists)
- 🎭 Exploração por gêneros musicais
- 🔥 Filtros rápidos pré-configurados
- 🆕 Seção de novos lançamentos

## 🚀 **Tecnologias Utilizadas**

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Styled Components com design system moderno
- **Roteamento**: React Router DOM
- **Estado**: React Hooks + Context API
- **Requisições**: Axios com interceptors
- **Datas**: date-fns com localização PT-BR
- **Autenticação**: OAuth 2.0 + PKCE (Proof Key for Code Exchange)
- **Deploy**: Vercel com configuração SPA

## 📋 **Pré-requisitos**

1. **Node.js** (versão 16 ou superior)
2. **Conta no Spotify Developer Dashboard**
3. **Client ID** do Spotify configurado

## 🛠️ **Configuração e Instalação**

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/spotify-genius.git
cd spotify-genius
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_CLIENT_ID=seu_spotify_client_id_aqui
VITE_REDIRECT_URI=http://localhost:5173/callback
```

### 4. Configure o Spotify Developer Dashboard
1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie um novo app ou use um existente
3. Adicione as URLs de redirecionamento:
   - `http://localhost:5173/callback` (desenvolvimento)
   - `https://seu-dominio.vercel.app/callback` (produção)
4. Copie o **Client ID** para o arquivo `.env.local`

### 5. Execute o projeto
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📁 **Estrutura do Projeto**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Navigation.tsx   # Barra de navegação
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/              # Páginas principais
│   ├── Login.tsx       # Autenticação OAuth
│   ├── Callback.tsx    # Processamento do callback
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── MusicTimeline.tsx    # Timeline musical
│   ├── ArtistExplorer.tsx   # Explorer de artistas
│   └── DiscoveryHub.tsx     # Hub de descoberta
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Gerenciamento de autenticação
│   └── useSpotifyData.ts    # Hooks para dados do Spotify
├── services/           # Serviços de API
│   └── spotifyAPI.ts   # Cliente da API do Spotify
├── types/              # Definições TypeScript
│   └── spotify.d.ts    # Tipos da API do Spotify
├── utils/              # Utilitários
│   └── pkce.ts        # Funções PKCE para OAuth
└── styles/            # Estilos globais
    └── index.css
```

## 🔐 **Segurança e Autenticação**

- **OAuth 2.0 com PKCE**: Implementação segura sem Client Secret
- **State Parameter**: Proteção contra ataques CSRF
- **Token Expiration**: Gestão automática de expiração de tokens
- **Secure Storage**: Armazenamento seguro de tokens no localStorage

## 🎨 **Design e UX**

- **Design System**: Cores e componentes consistentes inspirados no Spotify
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Animações**: Transições suaves e efeitos visuais modernos
- **Dark Theme**: Interface otimizada para uso prolongado
- **Accessibility**: Componentes acessíveis com navegação por teclado

## 📱 **Funcionalidades por Página**

### Dashboard
- Perfil do usuário com foto e estatísticas
- Top artists e tracks com filtros de período
- Recently played com timestamps
- Novos lançamentos em grid visual

### Timeline Musical
- Visualização cronológica das músicas
- Agrupamento inteligente por data
- Filtros temporais interativos
- Estatísticas de listening habits

### Explorer de Artistas
- Busca em tempo real
- Perfil completo do artista
- Discografia organizada por tipo
- Sistema de follow/unfollow

### Discovery Hub
- Busca universal multi-tipo
- Filtros rápidos pré-configurados
- Exploração por gêneros
- Seção de trending e clássicos

## 🚀 **Deploy**

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente na dashboard do Vercel
3. O deploy automático acontecerá a cada push

### Outras Plataformas
- **Netlify**: Configure redirects para SPA
- **GitHub Pages**: Use hash routing
- **Firebase Hosting**: Configure rewrites para client-side routing

## 🔧 **Scripts Disponíveis**

- `npm run dev`: Servidor de desenvolvimento
- `npm run build`: Build para produção
- `npm run preview`: Preview do build local
- `npm run lint`: Análise de código

## 🌟 **Funcionalidades Técnicas Avançadas**

- **Lazy Loading**: Carregamento otimizado de componentes
- **Error Boundaries**: Tratamento robusto de erros
- **Performance Optimization**: Memoização e otimizações de re-render
- **API Rate Limiting**: Gestão inteligente de limites da API
- **Responsive Images**: Otimização automática de imagens
- **SEO Ready**: Meta tags e estrutura otimizada

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 **Suporte**

- 📧 Email: seu-email@exemplo.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/spotify-genius/issues)
- 📖 Documentação: [Wiki do Projeto](https://github.com/seu-usuario/spotify-genius/wiki)

---

**Feito com ❤️ e muita música 🎵**
