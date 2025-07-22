import styled from 'styled-components';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

// Escopos necessários para as funcionalidades da aplicação
const SCOPES = [
  "user-read-private",
  "user-read-email", 
  "user-top-read",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-follow-read"
];

const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}&response_type=${RESPONSE_TYPE}&show_dialog=true`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1db954 0%, #191414 100%);
  color: white;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #1db954, #1ed760);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const LoginButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #1db954;
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);
  
  &:hover {
    background: #1ed760;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(29, 185, 84, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SpotifyIcon = styled.svg`
  width: 24px;
  height: 24px;
  fill: currentColor;
`;

const FeaturesList = styled.div`
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 800px;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #1ed760;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.4;
`;

const Login = () => {
  const handleLogin = () => {
    // Verifica se as variáveis de ambiente estão configuradas
    if (!CLIENT_ID || CLIENT_ID === 'your_spotify_client_id_here') {
      alert('Por favor, configure suas credenciais do Spotify no arquivo .env.local');
      return;
    }
    
    // Redireciona para o Spotify
    window.location.href = loginUrl;
  };

  return (
    <LoginContainer>
      <Title>Spotify Genius</Title>
      <Subtitle>
        Descubra suas estatísticas musicais e crie playlists inteligentes 
        baseadas nos seus gostos e características de áudio das suas músicas favoritas.
      </Subtitle>
      
      <LoginButton href={loginUrl} onClick={(e) => {
        e.preventDefault();
        handleLogin();
      }}>
        <SpotifyIcon viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
        </SpotifyIcon>
        Entrar com Spotify
      </LoginButton>

      <FeaturesList>
        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Estatísticas Personalizadas</FeatureTitle>
          <FeatureDescription>
            Veja seus artistas e músicas mais ouvidos em diferentes períodos
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🎵</FeatureIcon>
          <FeatureTitle>Análise de Playlist</FeatureTitle>
          <FeatureDescription>
            Analise as características de áudio das suas playlists favoritas
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>Gerador Inteligente</FeatureTitle>
          <FeatureDescription>
            Crie playlists personalizadas baseadas em parâmetros de áudio
          </FeatureDescription>
        </FeatureCard>
      </FeaturesList>
    </LoginContainer>
  );
};

export default Login; 