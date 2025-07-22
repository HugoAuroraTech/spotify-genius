import { useState } from 'react';
import styled from 'styled-components';
import { format, isToday, isYesterday, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSpotifyQuery } from '../hooks/useSpotifyData';
import spotifyService from '../services/spotifyAPI';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { RecentlyPlayedItem } from '../types/spotify';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #191414 0%, #1ed760 100%);
  color: white;
`;

const MainContent = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #1ed760, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #1ed760;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const TimelineContainer = styled.div`
  position: relative;
  margin: 2rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 50px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #1ed760, transparent);
  }

  @media (max-width: 768px) {
    &::before {
      left: 30px;
    }
  }
`;

const TimelineDay = styled.div`
  margin-bottom: 2rem;
`;

const DayHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 44px;
    width: 14px;
    height: 14px;
    background: #1ed760;
    border-radius: 50%;
    border: 3px solid #191414;
    z-index: 2;
  }

  @media (max-width: 768px) {
    &::before {
      left: 24px;
    }
  }
`;

const DayTitle = styled.h3`
  margin: 0 0 0 80px;
  color: #1ed760;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    margin-left: 60px;
  }
`;

const TrackList = styled.div`
  margin-left: 80px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    margin-left: 60px;
  }
`;

const TrackCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

const TrackImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TrackName = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.p`
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayedTime = styled.span`
  font-size: 0.75rem;
  opacity: 0.6;
  white-space: nowrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#1ed760' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid ${props => props.active ? '#1ed760' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 25px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.active ? '#1db954' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const MusicTimeline = () => {
  const [filter, setFilter] = useState<'all' | 'today' | 'yesterday' | 'week'>('all');
  
  const { data: recentlyPlayed, loading, error, refetch } = useSpotifyQuery(
    () => spotifyService.getRecentlyPlayed(50)
  );

  // Agrupar tracks por data
  const groupTracksByDate = (tracks: RecentlyPlayedItem[]) => {
    const groups: { [key: string]: RecentlyPlayedItem[] } = {};
    
    tracks.forEach(item => {
      const date = new Date(item.played_at);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  };

  // Filtrar por período
  const filterTracks = (tracks: RecentlyPlayedItem[]) => {
    const now = new Date();
    
    switch (filter) {
      case 'today':
        return tracks.filter(item => isToday(new Date(item.played_at)));
      case 'yesterday':
        return tracks.filter(item => isYesterday(new Date(item.played_at)));
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return tracks.filter(item => new Date(item.played_at) >= weekAgo);
      default:
        return tracks;
    }
  };

  // Estatísticas
  const getStats = () => {
    if (!recentlyPlayed) return null;

    const uniqueTracks = new Set(recentlyPlayed.map(item => item.track.id)).size;
    const uniqueArtists = new Set(
      recentlyPlayed.flatMap(item => item.track.artists.map(artist => artist.id))
    ).size;

    const todayTracks = recentlyPlayed.filter(item => 
      isToday(new Date(item.played_at))
    ).length;

    return {
      totalPlays: recentlyPlayed.length,
      uniqueTracks,
      uniqueArtists,
      todayPlays: todayTracks
    };
  };

  const formatDayTitle = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) return 'Hoje';
    if (isYesterday(date)) return 'Ontem';
    
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  const formatPlayTime = (playedAt: string) => {
    const date = new Date(playedAt);
    const now = new Date();
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    }
    
    return formatDistance(date, now, { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  if (loading) {
    return (
      <Container>
        <Navigation />
        <MainContent>
          <LoadingSpinner size="large" text="Carregando seu histórico musical..." />
        </MainContent>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Navigation />
        <MainContent>
          <ErrorMessage message={error} onRetry={refetch} />
        </MainContent>
      </Container>
    );
  }

  const filteredTracks = filterTracks(recentlyPlayed || []);
  const groupedTracks = groupTracksByDate(filteredTracks);
  const stats = getStats();

  return (
    <Container>
      <Navigation />
      <MainContent>
        <Header>
          <Title>🎵 Timeline Musical</Title>
          <Subtitle>
            Sua jornada musical recente - descubra padrões e momentos especiais nas suas músicas
          </Subtitle>
        </Header>

        {stats && (
          <StatsBar>
            <StatCard>
              <StatValue>{stats.totalPlays}</StatValue>
              <StatLabel>Músicas Tocadas</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.uniqueTracks}</StatValue>
              <StatLabel>Faixas Únicas</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.uniqueArtists}</StatValue>
              <StatLabel>Artistas Diferentes</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.todayPlays}</StatValue>
              <StatLabel>Tocadas Hoje</StatLabel>
            </StatCard>
          </StatsBar>
        )}

        <FilterContainer>
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            Todas
          </FilterButton>
          <FilterButton 
            active={filter === 'today'} 
            onClick={() => setFilter('today')}
          >
            Hoje
          </FilterButton>
          <FilterButton 
            active={filter === 'yesterday'} 
            onClick={() => setFilter('yesterday')}
          >
            Ontem
          </FilterButton>
          <FilterButton 
            active={filter === 'week'} 
            onClick={() => setFilter('week')}
          >
            Última Semana
          </FilterButton>
        </FilterContainer>

        <TimelineContainer>
          {groupedTracks.map(([dateStr, tracks]) => (
            <TimelineDay key={dateStr}>
              <DayHeader>
                <DayTitle>{formatDayTitle(dateStr)}</DayTitle>
              </DayHeader>
              <TrackList>
                {tracks.map((item, index) => (
                  <TrackCard key={`${item.track.id}-${item.played_at}-${index}`}>
                    <TrackImage
                      src={item.track.album.images[0]?.url || '/default-album.png'}
                      alt={item.track.album.name}
                    />
                    <TrackInfo>
                      <TrackName>{item.track.name}</TrackName>
                      <TrackArtist>
                        {item.track.artists.map(artist => artist.name).join(', ')}
                      </TrackArtist>
                      <PlayedTime>{formatPlayTime(item.played_at)}</PlayedTime>
                    </TrackInfo>
                  </TrackCard>
                ))}
              </TrackList>
            </TimelineDay>
          ))}
        </TimelineContainer>

        {filteredTracks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.7 }}>
            <h3>📭 Nenhuma música encontrada</h3>
            <p>Tente ajustar os filtros ou ouça algumas músicas no Spotify!</p>
          </div>
        )}
      </MainContent>
    </Container>
  );
};

export default MusicTimeline; 