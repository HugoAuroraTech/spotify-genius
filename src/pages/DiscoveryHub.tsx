import { useState } from 'react';
import styled from 'styled-components';
import { useSpotifyQuery } from '../hooks/useSpotifyData';
import spotifyService from '../services/spotifyAPI';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';

import type { Track, Artist, Album, Playlist } from '../types/spotify';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #191414 0%, #1ed760 100%);
  color: white;
`;

const MainContent = styled.main`
  max-width: 1200px;
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

const SearchSection = styled.section`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #1ed760;
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#1ed760' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? 'black' : 'white'};
  border: 2px solid ${props => props.active ? '#1ed760' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#1db954' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ItemCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    border-color: #1ed760;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const ItemTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemSubtitle = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  opacity: 0.6;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: #1ed760;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GenresContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
`;

const GenreTag = styled.button<{ selected: boolean }>`
  background: ${props => props.selected ? '#1ed760' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.selected ? 'black' : 'white'};
  border: 1px solid ${props => props.selected ? '#1ed760' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.selected ? '#1db954' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const QuickFiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const QuickFilter = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #1ed760;
  }
`;

const FilterTitle = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1ed760;
`;

const FilterDescription = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

type SearchType = 'track' | 'artist' | 'album' | 'playlist';

const DiscoveryHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('track');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Buscar com query
  const { data: searchResults, loading: searchLoading } = useSpotifyQuery(
    () => searchQuery.length > 2 ? spotifyService.search(searchQuery, searchType, 20) : Promise.resolve(null),
    [searchQuery, searchType]
  );

  // New releases
  const { data: newReleases, loading: releasesLoading } = useSpotifyQuery(
    () => spotifyService.getNewReleases(20),
    []
  );

  // Gêneros disponíveis (não usado atualmente, mas pode ser útil para futuras expansões)
  // const { data: availableGenres } = useSpotifyQuery(
  //   () => spotifyService.getAvailableGenreSeeds(),
  //   []
  // );

  const popularGenres = [
    'pop', 'rock', 'hip-hop', 'electronic', 'indie', 'jazz', 'classical', 'country',
    'r-n-b', 'reggae', 'metal', 'folk', 'blues', 'punk', 'funk', 'soul'
  ];

  const quickFilters = [
    {
      title: '🔥 Trending',
      description: 'Músicas populares do momento',
      query: 'year:2024',
      type: 'track' as SearchType
    },
    {
      title: '🎸 Rock Clássico',
      description: 'Os maiores hits do rock',
      query: 'genre:rock year:1970-1990',
      type: 'track' as SearchType
    },
    {
      title: '🎵 Pop Hits',
      description: 'Sucessos pop atuais',
      query: 'genre:pop year:2020-2024',
      type: 'track' as SearchType
    },
    {
      title: '🎤 Indie Discoveries',
      description: 'Artistas indie em ascensão',
      query: 'genre:indie',
      type: 'artist' as SearchType
    },
    {
      title: '🎺 Jazz Essentials',
      description: 'Clássicos do jazz',
      query: 'genre:jazz',
      type: 'album' as SearchType
    },
    {
      title: '🎧 Electronic Vibes',
      description: 'Eletrônica moderna',
      query: 'genre:electronic year:2020-2024',
      type: 'track' as SearchType
    }
  ];

  const handleQuickFilter = (filter: typeof quickFilters[0]) => {
    setSearchQuery(filter.query);
    setSearchType(filter.type);
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const renderResults = () => {
    if (!searchResults || !searchResults.items || searchResults.items.length === 0) {
      return null;
    }

    return (
      <ResultsGrid>
        {searchResults.items.map((item: any) => {
          switch (searchType) {
            case 'track':
              const track = item as Track;
              return (
                <ItemCard key={track.id}>
                  <ItemImage
                    src={track.album.images[0]?.url || '/default-album.png'}
                    alt={track.album.name}
                  />
                  <ItemTitle>{track.name}</ItemTitle>
                  <ItemSubtitle>{track.artists.map(a => a.name).join(', ')}</ItemSubtitle>
                  <ItemMeta>
                    <span>{track.album.name}</span>
                    <span>♥ {track.popularity}</span>
                  </ItemMeta>
                </ItemCard>
              );

            case 'artist':
              const artist = item as Artist;
              return (
                <ItemCard key={artist.id}>
                  <ItemImage
                    src={artist.images[0]?.url || '/default-artist.png'}
                    alt={artist.name}
                    style={{ borderRadius: '50%' }}
                  />
                  <ItemTitle>{artist.name}</ItemTitle>
                  <ItemSubtitle>{artist.genres.slice(0, 2).join(', ')}</ItemSubtitle>
                  <ItemMeta>
                    <span>{(artist.followers.total / 1000000).toFixed(1)}M seguidores</span>
                    <span>♥ {artist.popularity}</span>
                  </ItemMeta>
                </ItemCard>
              );

            case 'album':
              const album = item as Album;
              return (
                <ItemCard key={album.id}>
                  <ItemImage
                    src={album.images[0]?.url || '/default-album.png'}
                    alt={album.name}
                  />
                  <ItemTitle>{album.name}</ItemTitle>
                  <ItemSubtitle>{album.artists.map(a => a.name).join(', ')}</ItemSubtitle>
                  <ItemMeta>
                    <span>{new Date(album.release_date).getFullYear()}</span>
                    <span>{album.total_tracks} faixas</span>
                  </ItemMeta>
                </ItemCard>
              );

            case 'playlist':
              const playlist = item as Playlist;
              return (
                <ItemCard key={playlist.id}>
                  <ItemImage
                    src={playlist.images[0]?.url || '/default-playlist.png'}
                    alt={playlist.name}
                  />
                  <ItemTitle>{playlist.name}</ItemTitle>
                  <ItemSubtitle>por {playlist.owner.display_name}</ItemSubtitle>
                  <ItemMeta>
                    <span>{playlist.tracks.total} faixas</span>
                  </ItemMeta>
                </ItemCard>
              );

            default:
              return null;
          }
        })}
      </ResultsGrid>
    );
  };

  return (
    <Container>
      <Navigation />
      <MainContent>
        <Header>
          <Title>🔍 Discovery Hub</Title>
          <Subtitle>
            Descubra nova música, explore gêneros e encontre seus próximos hits favoritos
          </Subtitle>
        </Header>

        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Busque por músicas, artistas, albums ou playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <FilterTabs>
            <FilterTab active={searchType === 'track'} onClick={() => setSearchType('track')}>
              🎵 Músicas
            </FilterTab>
            <FilterTab active={searchType === 'artist'} onClick={() => setSearchType('artist')}>
              🎤 Artistas
            </FilterTab>
            <FilterTab active={searchType === 'album'} onClick={() => setSearchType('album')}>
              💿 Albums
            </FilterTab>
            <FilterTab active={searchType === 'playlist'} onClick={() => setSearchType('playlist')}>
              📜 Playlists
            </FilterTab>
          </FilterTabs>

          <QuickFiltersContainer>
            {quickFilters.map((filter, index) => (
              <QuickFilter key={index} onClick={() => handleQuickFilter(filter)}>
                <FilterTitle>{filter.title}</FilterTitle>
                <FilterDescription>{filter.description}</FilterDescription>
              </QuickFilter>
            ))}
          </QuickFiltersContainer>
        </SearchSection>

        {searchLoading && (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <LoadingSpinner text="Descobrindo música..." />
          </div>
        )}

        {searchResults && renderResults()}

        <Section>
          <SectionTitle>🆕 Novos Lançamentos</SectionTitle>
          {releasesLoading ? (
            <LoadingSpinner text="Carregando lançamentos..." />
          ) : (
            <ResultsGrid>
              {newReleases?.slice(0, 12).map((album: Album) => (
                <ItemCard key={album.id}>
                  <ItemImage
                    src={album.images[0]?.url || '/default-album.png'}
                    alt={album.name}
                  />
                  <ItemTitle>{album.name}</ItemTitle>
                  <ItemSubtitle>{album.artists.map(a => a.name).join(', ')}</ItemSubtitle>
                  <ItemMeta>
                    <span>{new Date(album.release_date).getFullYear()}</span>
                    <span>{album.album_type}</span>
                  </ItemMeta>
                </ItemCard>
              ))}
            </ResultsGrid>
          )}
        </Section>

        <Section>
          <SectionTitle>🎭 Explorar por Gênero</SectionTitle>
          <GenresContainer>
            {popularGenres.map(genre => (
              <GenreTag
                key={genre}
                selected={selectedGenres.includes(genre)}
                onClick={() => handleGenreToggle(genre)}
              >
                {genre}
              </GenreTag>
            ))}
          </GenresContainer>
          {selectedGenres.length > 0 && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <button
                style={{
                  background: '#1ed760',
                  color: 'black',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '1rem 2rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  setSearchQuery(`genre:${selectedGenres.join(' OR genre:')}`);
                  setSearchType('track');
                }}
              >
                Buscar por Gêneros Selecionados ({selectedGenres.length})
              </button>
            </div>
          )}
        </Section>
      </MainContent>
    </Container>
  );
};

export default DiscoveryHub; 