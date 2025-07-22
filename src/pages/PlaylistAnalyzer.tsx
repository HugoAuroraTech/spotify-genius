import { useState } from 'react';
import styled from 'styled-components';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import { useSpotifyQuery } from '../hooks/useSpotifyData';
import { spotifyService } from '../services/spotifyAPI';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Playlist, AudioFeatures } from '../types/spotify';

const PageContainer = styled.div`
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

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #1db954, #1ed760);
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

const PlaylistSelector = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SelectorTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #1ed760;
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PlaylistCard = styled.button<{ selected?: boolean }>`
  background: ${props => props.selected ? 'rgba(29, 185, 84, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.selected ? '#1db954' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-align: left;
  display: flex;
  gap: 1rem;
  align-items: center;
  
  &:hover {
    background: rgba(29, 185, 84, 0.2);
    border-color: #1db954;
  }
`;

const PlaylistImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

const PlaylistInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PlaylistName = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaylistDetails = styled.p`
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
`;

const AnalysisContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChartTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #1ed760;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1ed760;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

// Cores para os gráficos
const COLORS = ['#1db954', '#1ed760', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];

const PlaylistAnalyzer = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Buscar playlists do usuário
  const { data: playlists, loading: playlistsLoading, error: playlistsError } = useSpotifyQuery(
    () => spotifyService.getUserPlaylists(50)
  );

  // Analisar playlist selecionada
  const analyzePlaylist = async (playlist: Playlist) => {
    if (!playlist) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Buscar detalhes completos da playlist
      const fullPlaylist = await spotifyService.getPlaylist(playlist.id);
      
      // Extrair IDs das faixas (máximo 100 por limitação da API)
      const trackIds = fullPlaylist.tracks.items
        .slice(0, 100)
        .map(item => item.track.id)
        .filter(id => id); // Remove faixas sem ID (podem ser locais)

      if (trackIds.length === 0) {
        throw new Error('Nenhuma faixa encontrada na playlist');
      }

      // Buscar características de áudio
      const features = await spotifyService.getAudioFeatures(trackIds);
      setAudioFeatures(features);
      
    } catch (error) {
      console.error('Erro ao analisar playlist:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Erro ao analisar playlist');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Processar dados para gráficos
  const getRadarData = () => {
    if (audioFeatures.length === 0) return [];

    const avgFeatures = {
      danceability: audioFeatures.reduce((sum, f) => sum + f.danceability, 0) / audioFeatures.length,
      energy: audioFeatures.reduce((sum, f) => sum + f.energy, 0) / audioFeatures.length,
      valence: audioFeatures.reduce((sum, f) => sum + f.valence, 0) / audioFeatures.length,
      acousticness: audioFeatures.reduce((sum, f) => sum + f.acousticness, 0) / audioFeatures.length,
      instrumentalness: audioFeatures.reduce((sum, f) => sum + f.instrumentalness, 0) / audioFeatures.length,
      liveness: audioFeatures.reduce((sum, f) => sum + f.liveness, 0) / audioFeatures.length,
    };

    return [
      { feature: 'Danceabilidade', value: avgFeatures.danceability * 100 },
      { feature: 'Energia', value: avgFeatures.energy * 100 },
      { feature: 'Positividade', value: avgFeatures.valence * 100 },
      { feature: 'Acústico', value: avgFeatures.acousticness * 100 },
      { feature: 'Instrumental', value: avgFeatures.instrumentalness * 100 },
      { feature: 'Ao Vivo', value: avgFeatures.liveness * 100 },
    ];
  };

  const getTempoData = () => {
    const tempoRanges = [
      { range: '60-80 BPM', min: 60, max: 80, count: 0 },
      { range: '80-100 BPM', min: 80, max: 100, count: 0 },
      { range: '100-120 BPM', min: 100, max: 120, count: 0 },
      { range: '120-140 BPM', min: 120, max: 140, count: 0 },
      { range: '140+ BPM', min: 140, max: 999, count: 0 },
    ];

    audioFeatures.forEach(feature => {
      const range = tempoRanges.find(r => feature.tempo >= r.min && feature.tempo < r.max);
      if (range) range.count++;
    });

    return tempoRanges.filter(range => range.count > 0);
  };

  const getKeyData = () => {
    const keyNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyCounts: { [key: number]: number } = {};

    audioFeatures.forEach(feature => {
      keyCounts[feature.key] = (keyCounts[feature.key] || 0) + 1;
    });

    return Object.entries(keyCounts).map(([key, count]) => ({
      key: keyNames[parseInt(key)] || 'Desconhecida',
      count
    }));
  };

  const getStats = () => {
    if (audioFeatures.length === 0) return null;

    const avgTempo = audioFeatures.reduce((sum, f) => sum + f.tempo, 0) / audioFeatures.length;
    const avgDanceability = audioFeatures.reduce((sum, f) => sum + f.danceability, 0) / audioFeatures.length;
    const avgEnergy = audioFeatures.reduce((sum, f) => sum + f.energy, 0) / audioFeatures.length;
    const avgValence = audioFeatures.reduce((sum, f) => sum + f.valence, 0) / audioFeatures.length;

    return {
      tempo: Math.round(avgTempo),
      danceability: Math.round(avgDanceability * 100),
      energy: Math.round(avgEnergy * 100),
      valence: Math.round(avgValence * 100),
      totalTracks: audioFeatures.length
    };
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    analyzePlaylist(playlist);
  };

  const stats = getStats();

  return (
    <PageContainer>
      <Navigation />
      <ContentContainer>
        <Header>
          <Title>🎵 Analisador de Playlist</Title>
          <Subtitle>
            Descubra as características musicais das suas playlists com análises detalhadas 
            de danceabilidade, energia, tom e muito mais.
          </Subtitle>
        </Header>

        <PlaylistSelector>
          <SelectorTitle>Selecione uma Playlist para Analisar</SelectorTitle>
          
          {playlistsLoading ? (
            <LoadingSpinner text="Carregando suas playlists..." />
          ) : playlistsError ? (
            <ErrorMessage message={playlistsError} />
          ) : (
            <PlaylistGrid>
              {playlists?.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  selected={selectedPlaylist?.id === playlist.id}
                  onClick={() => handlePlaylistSelect(playlist)}
                >
                  <PlaylistImage 
                    src={playlist.images[0]?.url || '/default-playlist.png'} 
                    alt={playlist.name}
                  />
                  <PlaylistInfo>
                    <PlaylistName>{playlist.name}</PlaylistName>
                    <PlaylistDetails>
                      {playlist.tracks.total} músicas • {playlist.owner.display_name}
                    </PlaylistDetails>
                  </PlaylistInfo>
                </PlaylistCard>
              ))}
            </PlaylistGrid>
          )}
        </PlaylistSelector>

        {selectedPlaylist && (
          <>
            {isAnalyzing ? (
              <LoadingSpinner size="large" text="Analisando playlist..." />
            ) : analysisError ? (
              <ErrorMessage 
                message={analysisError} 
                onRetry={() => analyzePlaylist(selectedPlaylist)}
              />
            ) : audioFeatures.length > 0 ? (
              <>
                <AnalysisContainer>
                  {/* Gráfico Radar - Características Gerais */}
                  <ChartCard>
                    <ChartTitle>Características da Playlist</ChartTitle>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={getRadarData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="feature" />
                        <Radar 
                          name="Intensidade" 
                          dataKey="value" 
                          stroke="#1db954" 
                          fill="#1db954" 
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* Gráfico de Barras - Distribuição de Tempo */}
                  <ChartCard>
                    <ChartTitle>Distribuição de Tempo (BPM)</ChartTitle>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getTempoData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(25, 20, 20, 0.9)', 
                            border: '1px solid #1db954' 
                          }} 
                        />
                        <Bar dataKey="count" fill="#1db954" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* Gráfico de Pizza - Distribuição de Tons */}
                  <ChartCard>
                    <ChartTitle>Distribuição de Tons Musicais</ChartTitle>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getKeyData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ key, percent }) => `${key} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {getKeyData().map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </AnalysisContainer>

                {/* Estatísticas Resumidas */}
                {stats && (
                  <StatsGrid>
                    <StatCard>
                      <StatValue>{stats.totalTracks}</StatValue>
                      <StatLabel>Faixas Analisadas</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue>{stats.tempo} BPM</StatValue>
                      <StatLabel>Tempo Médio</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue>{stats.danceability}%</StatValue>
                      <StatLabel>Danceabilidade</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue>{stats.energy}%</StatValue>
                      <StatLabel>Energia</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue>{stats.valence}%</StatValue>
                      <StatLabel>Positividade</StatLabel>
                    </StatCard>
                  </StatsGrid>
                )}
              </>
            ) : null}
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default PlaylistAnalyzer; 