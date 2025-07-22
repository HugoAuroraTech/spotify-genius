import styled from 'styled-components';

const InfoContainer = styled.div`
  background: rgba(29, 185, 84, 0.1);
  border: 1px solid rgba(29, 185, 84, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
`;

const InfoTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #1ed760;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoText = styled.p`
  margin: 0 0 1rem 0;
  line-height: 1.6;
  opacity: 0.9;
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }
`;

const PlaylistAccessInfo = () => {
  return (
    <InfoContainer>
      <InfoTitle>
        💡 Dica sobre Acesso a Playlists
      </InfoTitle>
      <InfoText>
        Se você está recebendo erro de acesso negado (403), isso pode acontecer por alguns motivos:
      </InfoText>
      <InfoList>
        <li><strong>Playlist privada:</strong> Apenas playlists públicas ou suas próprias playlists podem ser analisadas</li>
        <li><strong>Playlist de terceiros:</strong> Playlists criadas por outros usuários precisam ser públicas</li>
        <li><strong>Playlist colaborativa:</strong> Você precisa ser colaborador para acessar</li>
        <li><strong>Faixas locais:</strong> Músicas não disponíveis no Spotify não podem ser analisadas</li>
      </InfoList>
      <InfoText>
        <strong>Soluções:</strong>
      </InfoText>
      <InfoList>
        <li>Tente analisar suas próprias playlists ou playlists públicas do Spotify</li>
        <li>Para playlists grandes, o processo pode demorar alguns minutos</li>
        <li>Se houver muitos erros, aguarde alguns minutos antes de tentar novamente</li>
      </InfoList>
    </InfoContainer>
  );
};

export default PlaylistAccessInfo; 