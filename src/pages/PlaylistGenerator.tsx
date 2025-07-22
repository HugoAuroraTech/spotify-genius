import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { spotifyService } from '../services/spotifyAPI';
import { useUserProfile } from '../hooks/useSpotifyData';
import Navigation from '../components/Navigation';
import ErrorMessage from '../components/ErrorMessage';
import type { Artist, Track } from '../types/spotify';

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

const GeneratorContainer = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #1ed760;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SeedSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SeedTypeCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
`;

const SeedTypeTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #1ed760;
  font-size: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    border-color: #1db954;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchResults = styled.div`
  max-height: 150px;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

const SearchResultItem = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  margin-bottom: 0.25rem;
  text-align: left;
  font-size: 0.85rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(29, 185, 84, 0.2);
  }
`;

const SelectedSeeds = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SeedTag = styled.div`
  background: #1db954;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveSeedButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.7rem;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const AudioFeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FeatureControl = styled.div`
  margin-bottom: 1rem;
`;

const FeatureLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const FeatureSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1db954;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1db954;
    cursor: pointer;
    border: none;
  }
`;

const FeatureValue = styled.span`
  color: #1ed760;
  font-weight: bold;
  font-size: 0.9rem;
`;

const GenerateButton = styled.button`
  background: linear-gradient(45deg, #1db954, #1ed760);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1rem auto;
  display: block;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(29, 185, 84, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RecommendationsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TrackImage = styled.img`
  width: 60px;
  height: 60px;
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
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
`;

const CreatePlaylistButton = styled.button`
  background: #1db954;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background: #1ed760;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface SeedItem {
  id: string;
  name: string;
  type: 'artist' | 'track' | 'genre';
}

const PlaylistGenerator = () => {
  const { data: profile } = useUserProfile();
  const [seeds, setSeeds] = useState<SeedItem[]>([]);
  const [searchQueries, setSearchQueries] = useState({
    artist: '',
    track: '',
    genre: ''
  });
  const [searchResults, setSearchResults] = useState({
    artists: [] as Artist[],
    tracks: [] as Track[],
    genres: [] as string[]
  });
  const [audioFeatures, setAudioFeatures] = useState({
    danceability: 0.5,
    energy: 0.5,
    valence: 0.5,
    acousticness: 0.5,
    instrumentalness: 0.5,
    liveness: 0.5,
    tempo: 120,
    popularity: 50
  });
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  // Carregar gêneros disponíveis
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genres = await spotifyService.getAvailableGenres();
        setAvailableGenres(genres);
      } catch (error) {
        console.error('Erro ao carregar gêneros:', error);
      }
    };
    loadGenres();
  }, []);

  // Buscar artistas
  const searchArtists = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(prev => ({ ...prev, artists: [] }));
      return;
    }
    
    try {
      const results = await spotifyService.search(query, 'artist', 10);
      setSearchResults(prev => ({ ...prev, artists: results }));
    } catch (error) {
      console.error('Erro ao buscar artistas:', error);
    }
  };

  // Buscar faixas
  const searchTracks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(prev => ({ ...prev, tracks: [] }));
      return;
    }
    
    try {
      const results = await spotifyService.search(query, 'track', 10);
      setSearchResults(prev => ({ ...prev, tracks: results }));
    } catch (error) {
      console.error('Erro ao buscar faixas:', error);
    }
  };

  // Filtrar gêneros
  const filterGenres = (query: string) => {
    if (!query.trim()) {
      setSearchResults(prev => ({ ...prev, genres: [] }));
      return;
    }
    
    const filtered = availableGenres
      .filter(genre => genre.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
    setSearchResults(prev => ({ ...prev, genres: filtered }));
  };

  // Adicionar seed
  const addSeed = (item: SeedItem) => {
    if (seeds.length >= 5) return; // Máximo 5 seeds
    if (seeds.find(seed => seed.id === item.id && seed.type === item.type)) return; // Já existe
    
    setSeeds([...seeds, item]);
    setSearchQueries(prev => ({ ...prev, [item.type]: '' }));
    setSearchResults({
      artists: [],
      tracks: [],
      genres: []
    });
  };

  // Remover seed
  const removeSeed = (seedToRemove: SeedItem) => {
    setSeeds(seeds.filter(seed => 
      !(seed.id === seedToRemove.id && seed.type === seedToRemove.type)
    ));
  };

  // Gerar recomendações
  const generateRecommendations = async () => {
    if (seeds.length === 0) {
      setError('Adicione pelo menos uma semente (artista, música ou gênero)');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const seedArtists = seeds.filter(s => s.type === 'artist').map(s => s.id);
      const seedTracks = seeds.filter(s => s.type === 'track').map(s => s.id);
      const seedGenres = seeds.filter(s => s.type === 'genre').map(s => s.id);

      const params = {
        seed_artists: seedArtists.length > 0 ? seedArtists : undefined,
        seed_tracks: seedTracks.length > 0 ? seedTracks : undefined,
        seed_genres: seedGenres.length > 0 ? seedGenres : undefined,
        target_danceability: audioFeatures.danceability,
        target_energy: audioFeatures.energy,
        target_valence: audioFeatures.valence,
        target_acousticness: audioFeatures.acousticness,
        target_instrumentalness: audioFeatures.instrumentalness,
        target_liveness: audioFeatures.liveness,
        target_tempo: audioFeatures.tempo,
        target_popularity: audioFeatures.popularity,
        limit: 20
      };

      const result = await spotifyService.getRecommendations(params);
      setRecommendations(result.tracks);
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      setError(error instanceof Error ? error.message : 'Erro ao gerar recomendações');
    } finally {
      setIsGenerating(false);
    }
  };

  // Criar playlist
  const createPlaylist = async () => {
    if (!profile || recommendations.length === 0) return;

    setIsCreatingPlaylist(true);

    try {
      const playlistName = `Playlist Genius - ${new Date().toLocaleDateString()}`;
      const description = 'Playlist gerada pelo Spotify Genius baseada nas suas preferências musicais';

      // Criar playlist
      const playlist = await spotifyService.createPlaylist(profile.id, {
        name: playlistName,
        description,
        public: false
      });

      // Adicionar faixas
      const trackUris = recommendations.map(track => track.uri);
      await spotifyService.addTracksToPlaylist(playlist.id, { uris: trackUris });

      alert(`Playlist "${playlistName}" criada com sucesso! 🎉`);
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar playlist');
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  return (
    <PageContainer>
      <Navigation />
      <ContentContainer>
        <Header>
          <Title>🤖 Gerador de Playlist Inteligente</Title>
          <Subtitle>
            Crie playlists personalizadas baseadas em seus artistas, músicas e gêneros favoritos, 
            com controle preciso sobre as características musicais.
          </Subtitle>
        </Header>

        <GeneratorContainer>
          {/* Seção de Seeds */}
          <Section>
            <SectionTitle>🎯 Sementes da Playlist</SectionTitle>
            <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
              Escolha até 5 artistas, músicas ou gêneros como base para suas recomendações
            </p>
            
            <SeedSection>
              {/* Busca de Artistas */}
              <SeedTypeCard>
                <SeedTypeTitle>🎤 Artistas</SeedTypeTitle>
                <SearchInput
                  placeholder="Buscar artista..."
                  value={searchQueries.artist}
                  onChange={(e) => {
                    setSearchQueries(prev => ({ ...prev, artist: e.target.value }));
                    searchArtists(e.target.value);
                  }}
                />
                <SearchResults>
                  {searchResults.artists.map(artist => (
                    <SearchResultItem
                      key={artist.id}
                      onClick={() => addSeed({ id: artist.id, name: artist.name, type: 'artist' })}
                    >
                      {artist.name}
                    </SearchResultItem>
                  ))}
                </SearchResults>
              </SeedTypeCard>

              {/* Busca de Faixas */}
              <SeedTypeCard>
                <SeedTypeTitle>🎵 Músicas</SeedTypeTitle>
                <SearchInput
                  placeholder="Buscar música..."
                  value={searchQueries.track}
                  onChange={(e) => {
                    setSearchQueries(prev => ({ ...prev, track: e.target.value }));
                    searchTracks(e.target.value);
                  }}
                />
                <SearchResults>
                  {searchResults.tracks.map(track => (
                    <SearchResultItem
                      key={track.id}
                      onClick={() => addSeed({ 
                        id: track.id, 
                        name: `${track.name} - ${track.artists[0]?.name}`, 
                        type: 'track' 
                      })}
                    >
                      {track.name} - {track.artists[0]?.name}
                    </SearchResultItem>
                  ))}
                </SearchResults>
              </SeedTypeCard>

              {/* Busca de Gêneros */}
              <SeedTypeCard>
                <SeedTypeTitle>🎸 Gêneros</SeedTypeTitle>
                <SearchInput
                  placeholder="Buscar gênero..."
                  value={searchQueries.genre}
                  onChange={(e) => {
                    setSearchQueries(prev => ({ ...prev, genre: e.target.value }));
                    filterGenres(e.target.value);
                  }}
                />
                <SearchResults>
                  {searchResults.genres.map(genre => (
                    <SearchResultItem
                      key={genre}
                      onClick={() => addSeed({ id: genre, name: genre, type: 'genre' })}
                    >
                      {genre}
                    </SearchResultItem>
                  ))}
                </SearchResults>
              </SeedTypeCard>
            </SeedSection>

            {/* Seeds Selecionadas */}
            {seeds.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <SeedTypeTitle>Selecionadas ({seeds.length}/5):</SeedTypeTitle>
                <SelectedSeeds>
                  {seeds.map((seed, index) => (
                    <SeedTag key={`${seed.type}-${seed.id}-${index}`}>
                      {seed.name}
                      <RemoveSeedButton onClick={() => removeSeed(seed)}>
                        ✕
                      </RemoveSeedButton>
                    </SeedTag>
                  ))}
                </SelectedSeeds>
              </div>
            )}
          </Section>

          {/* Controles de Características de Áudio */}
          <Section>
            <SectionTitle>🎛️ Características Musicais</SectionTitle>
            <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
              Ajuste os parâmetros para personalizar o estilo das recomendações
            </p>
            
            <AudioFeaturesSection>
              <FeatureControl>
                <FeatureLabel>
                  Danceabilidade: <FeatureValue>{Math.round(audioFeatures.danceability * 100)}%</FeatureValue>
                </FeatureLabel>
                <FeatureSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioFeatures.danceability}
                  onChange={(e) => setAudioFeatures(prev => ({ 
                    ...prev, 
                    danceability: parseFloat(e.target.value) 
                  }))}
                />
              </FeatureControl>

              <FeatureControl>
                <FeatureLabel>
                  Energia: <FeatureValue>{Math.round(audioFeatures.energy * 100)}%</FeatureValue>
                </FeatureLabel>
                <FeatureSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioFeatures.energy}
                  onChange={(e) => setAudioFeatures(prev => ({ 
                    ...prev, 
                    energy: parseFloat(e.target.value) 
                  }))}
                />
              </FeatureControl>

              <FeatureControl>
                <FeatureLabel>
                  Positividade: <FeatureValue>{Math.round(audioFeatures.valence * 100)}%</FeatureValue>
                </FeatureLabel>
                <FeatureSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioFeatures.valence}
                  onChange={(e) => setAudioFeatures(prev => ({ 
                    ...prev, 
                    valence: parseFloat(e.target.value) 
                  }))}
                />
              </FeatureControl>

              <FeatureControl>
                <FeatureLabel>
                  Acústico: <FeatureValue>{Math.round(audioFeatures.acousticness * 100)}%</FeatureValue>
                </FeatureLabel>
                <FeatureSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioFeatures.acousticness}
                  onChange={(e) => setAudioFeatures(prev => ({ 
                    ...prev, 
                    acousticness: parseFloat(e.target.value) 
                  }))}
                />
              </FeatureControl>

              <FeatureControl>
                <FeatureLabel>
                  Tempo: <FeatureValue>{Math.round(audioFeatures.tempo)} BPM</FeatureValue>
                </FeatureLabel>
                <FeatureSlider
                  type="range"
                  min="60"
                  max="200"
                  step="1"
                  value={audioFeatures.tempo}
                  onChange={(e) => setAudioFeatures(prev => ({ 
                    ...prev, 
                    tempo: parseFloat(e.target.value) 
                  }))}
                />
              </FeatureControl>

              <FeatureControl>
                <FeatureLabel>
                  Popularidade: <FeatureValue>{Math.round(audioFeatures.popularity)}%</FeatureValue>
                </FeatureLabel>
                <FeatureSlider
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={audioFeatures.popularity}
                  onChange={(e) => setAudioFeatures(prev => ({ 
                    ...prev, 
                    popularity: parseFloat(e.target.value) 
                  }))}
                />
              </FeatureControl>
            </AudioFeaturesSection>
          </Section>
        </GeneratorContainer>

        <GenerateButton
          onClick={generateRecommendations}
          disabled={isGenerating || seeds.length === 0}
        >
          {isGenerating ? 'Gerando...' : '🎵 Gerar Recomendações'}
        </GenerateButton>

        {error && <ErrorMessage message={error} />}

        {/* Recomendações */}
        {recommendations.length > 0 && (
          <RecommendationsSection>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <SectionTitle style={{ margin: 0 }}>🎵 Suas Recomendações</SectionTitle>
              <CreatePlaylistButton
                onClick={createPlaylist}
                disabled={isCreatingPlaylist}
              >
                {isCreatingPlaylist ? 'Criando...' : '➕ Criar Playlist'}
              </CreatePlaylistButton>
            </div>
            
            <TrackList>
              {recommendations.map((track) => (
                <TrackItem key={track.id}>
                  <TrackImage 
                    src={track.album.images[0]?.url || '/default-track.png'} 
                    alt={track.name}
                  />
                  <TrackInfo>
                    <TrackName>{track.name}</TrackName>
                    <TrackArtist>{track.artists.map(artist => artist.name).join(', ')}</TrackArtist>
                  </TrackInfo>
                </TrackItem>
              ))}
            </TrackList>
          </RecommendationsSection>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default PlaylistGenerator; 