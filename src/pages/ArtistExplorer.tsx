import React, { useState } from 'react';
import styled from 'styled-components';
import { useSpotifyQuery } from '../hooks/useSpotifyData';
import spotifyService from '../services/spotifyAPI';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';

import type { Artist, Track, Album } from '../types/spotify';

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

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 3rem auto;
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

  &:focus {
    outline: none;
    border-color: #1ed760;
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SearchResults = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ArtistCard = styled.button`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-align: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    border-color: #1ed760;
  }
`;

const ArtistImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const ArtistName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const ArtistInfo = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.7;
`;

const ArtistDetail = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ArtistHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ArtistLargeImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const ArtistMeta = styled.div`
  flex: 1;
`;

const ArtistTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  color: #1ed760;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ArtistStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1ed760;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const GenreList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const GenreTag = styled.span`
  background: rgba(30, 215, 96, 0.2);
  color: #1ed760;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  border: 1px solid rgba(30, 215, 96, 0.3);
`;

const FollowButton = styled.button<{ following: boolean }>`
  background: ${props => props.following ? 'rgba(255, 255, 255, 0.1)' : '#1ed760'};
  color: ${props => props.following ? 'white' : 'black'};
  border: 2px solid ${props => props.following ? 'rgba(255, 255, 255, 0.3)' : '#1ed760'};
  border-radius: 25px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: ${props => props.following ? 'rgba(255, 255, 255, 0.2)' : '#1db954'};
  }
`;

const SectionTitle = styled.h3`
  color: #1ed760;
  margin: 2rem 0 1rem 0;
  font-size: 1.5rem;
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TrackItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: all 0.3s ease;

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

const TrackAlbum = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackPopularity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.8;
`;

const PopularityBar = styled.div<{ popularity: number }>`
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.popularity}%;
    height: 100%;
    background: #1ed760;
  }
`;

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const AlbumCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const AlbumImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const AlbumName = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AlbumYear = styled.p`
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
`;

const ArtistExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Buscar artistas
  const { data: searchResults, loading: searchLoading } = useSpotifyQuery(
    () => searchQuery.length > 2 ? spotifyService.search(searchQuery, 'artist', 10) : Promise.resolve(null),
    [searchQuery]
  );

  // Buscar top tracks do artista selecionado
  const { data: topTracks, loading: tracksLoading } = useSpotifyQuery(
    () => selectedArtist ? spotifyService.getArtistTopTracks(selectedArtist.id) : Promise.resolve([]),
    [selectedArtist?.id]
  );

  // Buscar albums do artista
  const { data: albums, loading: albumsLoading } = useSpotifyQuery(
    () => selectedArtist ? spotifyService.getArtistAlbums(selectedArtist.id, 'album,single', 20) : Promise.resolve([]),
    [selectedArtist?.id]
  );

  // Verificar se segue o artista
  const { data: followingStatus } = useSpotifyQuery(
    () => selectedArtist ? spotifyService.checkFollowingArtists([selectedArtist.id]) : Promise.resolve([false]),
    [selectedArtist?.id]
  );

  React.useEffect(() => {
    if (followingStatus && followingStatus.length > 0) {
      setIsFollowing(followingStatus[0]);
    }
  }, [followingStatus]);

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleFollowToggle = async () => {
    if (!selectedArtist) return;

    try {
      if (isFollowing) {
        await spotifyService.unfollowArtist(selectedArtist.id);
      } else {
        await spotifyService.followArtist(selectedArtist.id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Erro ao alterar seguimento:', error);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container>
      <Navigation />
      <MainContent>
        <Header>
          <Title>🎤 Explorer de Artistas</Title>
        </Header>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Busque por artistas... (ex: Taylor Swift, The Beatles)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        {searchLoading && searchQuery.length > 2 && (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <LoadingSpinner text="Buscando artistas..." />
          </div>
        )}

        {searchResults && searchResults.items && searchResults.items.length > 0 && (
          <SearchResults>
            {searchResults.items.map((artist: Artist) => (
              <ArtistCard key={artist.id} onClick={() => handleArtistSelect(artist)}>
                <ArtistImage
                  src={artist.images[0]?.url || '/default-artist.png'}
                  alt={artist.name}
                />
                <ArtistName>{artist.name}</ArtistName>
                <ArtistInfo>
                  {formatFollowers(artist.followers.total)} seguidores
                </ArtistInfo>
              </ArtistCard>
            ))}
          </SearchResults>
        )}

        {selectedArtist && (
          <ArtistDetail>
            <ArtistHeader>
              <ArtistLargeImage
                src={selectedArtist.images[0]?.url || '/default-artist.png'}
                alt={selectedArtist.name}
              />
              <ArtistMeta>
                <ArtistTitle>{selectedArtist.name}</ArtistTitle>
                <ArtistStats>
                  <StatItem>
                    <StatValue>{formatFollowers(selectedArtist.followers.total)}</StatValue>
                    <StatLabel>Seguidores</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{selectedArtist.popularity}</StatValue>
                    <StatLabel>Popularidade</StatLabel>
                  </StatItem>
                </ArtistStats>
                {selectedArtist.genres.length > 0 && (
                  <GenreList>
                    {selectedArtist.genres.slice(0, 5).map(genre => (
                      <GenreTag key={genre}>{genre}</GenreTag>
                    ))}
                  </GenreList>
                )}
                <FollowButton following={isFollowing} onClick={handleFollowToggle}>
                  {isFollowing ? '✓ Seguindo' : '+ Seguir'}
                </FollowButton>
              </ArtistMeta>
            </ArtistHeader>

            <SectionTitle>🔥 Top Tracks</SectionTitle>
            {tracksLoading ? (
              <LoadingSpinner text="Carregando músicas..." />
            ) : (
              <TrackList>
                {topTracks?.slice(0, 10).map((track: Track, index: number) => (
                  <TrackItem key={track.id}>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold', 
                      color: '#1ed760',
                      minWidth: '24px',
                      textAlign: 'center'
                    }}>
                      {index + 1}
                    </div>
                    <TrackImage
                      src={track.album.images[0]?.url || '/default-album.png'}
                      alt={track.album.name}
                    />
                    <TrackInfo>
                      <TrackName>{track.name}</TrackName>
                      <TrackAlbum>{track.album.name}</TrackAlbum>
                    </TrackInfo>
                    <TrackPopularity>
                      <span>{formatDuration(track.duration_ms)}</span>
                      <PopularityBar popularity={track.popularity} />
                    </TrackPopularity>
                  </TrackItem>
                ))}
              </TrackList>
            )}

            <SectionTitle>💿 Discografia</SectionTitle>
            {albumsLoading ? (
              <LoadingSpinner text="Carregando albums..." />
            ) : (
              <AlbumGrid>
                {albums?.map((album: Album) => (
                  <AlbumCard key={album.id}>
                    <AlbumImage
                      src={album.images[0]?.url || '/default-album.png'}
                      alt={album.name}
                    />
                    <AlbumName>{album.name}</AlbumName>
                    <AlbumYear>{new Date(album.release_date).getFullYear()}</AlbumYear>
                  </AlbumCard>
                ))}
              </AlbumGrid>
            )}
          </ArtistDetail>
        )}

        {searchQuery.length === 0 && !selectedArtist && (
          <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.7 }}>
            <h3>🔍 Descubra seus artistas favoritos</h3>
            <p>Digite o nome de um artista para explorar sua discografia, top tracks e muito mais!</p>
          </div>
        )}
      </MainContent>
    </Container>
  );
};

export default ArtistExplorer; 