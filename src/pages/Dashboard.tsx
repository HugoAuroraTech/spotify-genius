import { useState } from 'react';
import styled from 'styled-components';
import { useUserProfile, useTopArtists, useTopTracks } from '../hooks/useSpotifyData';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #191414 0%, #1db954 100%);
  color: white;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const UserAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #1db954;
`;

const UserInfo = styled.div`
  text-align: left;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const WelcomeText = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(45deg, #1db954, #1ed760);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const UserStats = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.8;
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TimeRangeButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#1db954' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid ${props => props.active ? '#1db954' : 'rgba(255, 255, 255, 0.3)'};
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#1ed760' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CardTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #1ed760;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemDetails = styled.p`
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemRank = styled.div`
  background: #1db954;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');

  const { data: profile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { data: topArtists, loading: artistsLoading, error: artistsError, refetch: refetchArtists } = useTopArtists(timeRange, 10);
  const { data: topTracks, loading: tracksLoading, error: tracksError, refetch: refetchTracks } = useTopTracks(timeRange, 10);

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term': return 'Último Mês';
      case 'medium_term': return 'Últimos 6 Meses';
      case 'long_term': return 'Todos os Tempos';
      default: return '';
    }
  };

  if (profileLoading) {
    return (
      <DashboardContainer>
        <Navigation />
        <ContentContainer>
          <LoadingSpinner size="large" text="Carregando seu perfil..." />
        </ContentContainer>
      </DashboardContainer>
    );
  }

  if (profileError) {
    return (
      <DashboardContainer>
        <Navigation />
        <ContentContainer>
          <ErrorMessage 
            title="Erro ao carregar perfil"
            message={profileError}
            onRetry={refetchProfile}
          />
        </ContentContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Navigation />
      <ContentContainer>
        <Header>
          {profile && (
            <WelcomeSection>
              <UserAvatar 
                src={profile.images[0]?.url || '/default-avatar.png'} 
                alt={profile.display_name}
              />
              <UserInfo>
                <WelcomeText>Olá, {profile.display_name}! 👋</WelcomeText>
                <UserStats>{profile.followers.total} seguidores • {profile.country}</UserStats>
              </UserInfo>
            </WelcomeSection>
          )}
        </Header>
        <TimeRangeSelector>
          {(['short_term', 'medium_term', 'long_term'] as const).map((range) => (
            <TimeRangeButton
              key={range}
              active={timeRange === range}
              onClick={() => setTimeRange(range)}
            >
              {getTimeRangeLabel(range)}
            </TimeRangeButton>
          ))}
        </TimeRangeSelector>

        <StatsGrid>
          {/* Top Artistas */}
          <StatsCard>
            <CardTitle>
              🎤 Seus Artistas Mais Ouvidos
            </CardTitle>
            {artistsLoading ? (
              <LoadingSpinner size="small" text="Carregando artistas..." />
            ) : artistsError ? (
              <ErrorMessage 
                message={artistsError}
                onRetry={refetchArtists}
                showIcon={false}
              />
            ) : (
              <ItemList>
                {topArtists?.map((artist, index) => (
                  <ListItem key={artist.id}>
                    <ItemRank>{index + 1}</ItemRank>
                    <ItemImage 
                      src={artist.images[0]?.url || '/default-artist.png'} 
                      alt={artist.name}
                    />
                    <ItemInfo>
                      <ItemName>{artist.name}</ItemName>
                      <ItemDetails>
                        {artist.genres.slice(0, 2).join(', ')} • {artist.popularity}% popularidade
                      </ItemDetails>
                    </ItemInfo>
                  </ListItem>
                ))}
              </ItemList>
            )}
          </StatsCard>

          {/* Top Faixas */}
          <StatsCard>
            <CardTitle>
              🎵 Suas Músicas Mais Ouvidas
            </CardTitle>
            {tracksLoading ? (
              <LoadingSpinner size="small" text="Carregando músicas..." />
            ) : tracksError ? (
              <ErrorMessage 
                message={tracksError}
                onRetry={refetchTracks}
                showIcon={false}
              />
            ) : (
              <ItemList>
                {topTracks?.map((track, index) => (
                  <ListItem key={track.id}>
                    <ItemRank>{index + 1}</ItemRank>
                    <ItemImage 
                      src={track.album.images[0]?.url || '/default-track.png'} 
                      alt={track.name}
                    />
                    <ItemInfo>
                      <ItemName>{track.name}</ItemName>
                      <ItemDetails>
                        {track.artists.map(artist => artist.name).join(', ')} • {track.album.name}
                      </ItemDetails>
                    </ItemInfo>
                  </ListItem>
                ))}
              </ItemList>
            )}
          </StatsCard>
                  </StatsGrid>
        </ContentContainer>
      </DashboardContainer>
    );
  };

export default Dashboard; 