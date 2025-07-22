# 🎵 Configuração do Spotify Developer Dashboard

Este guia passo a passo te ajudará a configurar sua aplicação no Spotify Developer Dashboard para usar com o **Spotify Genius**.

## 📋 Pré-requisitos

- Conta no Spotify (gratuita ou premium)
- Navegador web
- Projeto clonado localmente

## 🔧 Passo a Passo

### 1. Acessar o Developer Dashboard

1. Vá para [https://developer.spotify.com/dashboard/](https://developer.spotify.com/dashboard/)
2. Clique em **"Log In"** e faça login com sua conta do Spotify
3. Aceite os termos de uso do Spotify for Developers (se for a primeira vez)

### 2. Criar Nova Aplicação

1. No dashboard, clique no botão **"Create app"**
2. Preencha o formulário com os seguintes dados:

   **Informações Básicas:**
   - **App name**: `Spotify Genius` (ou o nome que preferir)
   - **App description**: `Aplicação web para análise de estatísticas musicais e geração de playlists inteligentes`

   **Configurações Técnicas:**
   - **Website**: `http://localhost:5173` (para desenvolvimento local)
   - **Redirect URIs**: `http://localhost:5173/callback`
   - **Which API/SDKs are you planning to use?**: Selecione **"Web API"**

3. Marque a caixa concordando com os **Termos de Serviço**
4. Clique em **"Save"**

### 3. Obter Credenciais

Após criar a aplicação, você será redirecionado para a página de configurações:

1. Na seção **"Basic Information"**, você verá:
   - **Client ID**: Este é o valor que você precisa copiar
   - **Client Secret**: Clique em **"View client secret"** para ver (não necessário para este projeto)

2. **IMPORTANTE**: Copie o **Client ID** - você precisará dele no próximo passo

### 4. Configurar Variáveis de Ambiente

1. No seu projeto, crie um arquivo `.env.local` na pasta raiz (mesmo nível do `package.json`)

2. Adicione as seguintes linhas ao arquivo:

```env
VITE_CLIENT_ID=cole_seu_client_id_aqui
VITE_REDIRECT_URI=http://localhost:5173/callback
```

3. Substitua `cole_seu_client_id_aqui` pelo Client ID que você copiou

**Exemplo:**
```env
VITE_CLIENT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
VITE_REDIRECT_URI=http://localhost:5173/callback
```

### 5. Verificar Configurações

Volte ao Spotify Developer Dashboard e verifique:

1. **Redirect URIs** deve conter: `http://localhost:5173/callback`
2. **Client ID** deve estar copiado corretamente no seu `.env.local`

### 6. Testar a Aplicação

1. No terminal, execute:
```bash
npm run dev
```

2. Acesse `http://localhost:5173`
3. Clique em **"Entrar com Spotify"**
4. Você deve ser redirecionado para a página de autorização do Spotify
5. Após autorizar, você será redirecionado de volta para a aplicação

## 🔄 Configuração para Produção

Quando você fizer o deploy da aplicação:

### Para Vercel:
1. No dashboard do Vercel, adicione as variáveis de ambiente:
   - `VITE_CLIENT_ID`: Seu Client ID
   - `VITE_REDIRECT_URI`: `https://seu-dominio.vercel.app/callback`

2. No Spotify Developer Dashboard, adicione a nova Redirect URI:
   - `https://seu-dominio.vercel.app/callback`

### Para Netlify:
1. Nas configurações do site, adicione as variáveis de ambiente:
   - `VITE_CLIENT_ID`: Seu Client ID
   - `VITE_REDIRECT_URI`: `https://seu-dominio.netlify.app/callback`

2. No Spotify Developer Dashboard, adicione a nova Redirect URI:
   - `https://seu-dominio.netlify.app/callback`

## ⚠️ Importante

- **Nunca** compartilhe publicamente seu Client ID em repositórios públicos
- O arquivo `.env.local` já está no `.gitignore` para proteger suas credenciais
- Você pode ter múltiplas Redirect URIs configuradas (desenvolvimento + produção)

## 🛠️ Solução de Problemas

### "INVALID_CLIENT: Invalid redirect URI"
- Verifique se a Redirect URI no Spotify Dashboard está exatamente igual à configurada no código
- URLs devem ser exatas (incluindo `http://` vs `https://`)

### "Aplicação não está autorizada"
- Certifique-se de que o Client ID no `.env.local` está correto
- Verifique se não há espaços extras no início ou fim do Client ID

### "Token de acesso não encontrado"
- Limpe o localStorage do navegador e tente novamente
- Verifique o console do navegador para erros

## 📞 Suporte

Se você encontrar problemas:
1. Verifique o console do navegador para erros
2. Confirme que todas as URLs estão corretas
3. Teste com uma aba anônima para descartar problemas de cache

---

**Configuração concluída! Agora você pode aproveitar todas as funcionalidades do Spotify Genius! 🎉** 