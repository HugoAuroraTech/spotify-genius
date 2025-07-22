import axios from 'axios';
import type { 
  UserProfile, 
  Track, 
  Artist, 
  Album, 
  Playlist, 
  SpotifyApiResponse 
} from '../types/spotify';

// Configuração base da API
const spotifyAPI = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});

// Interceptor para adicionar token de autorização automaticamente
spotifyAPI.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('spotify_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros de autenticação
spotifyAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      window.localStorage.removeItem('spotify_token');
      window.localStorage.removeItem('spotify_token_expires');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Exchange authorization code for access token (PKCE)
export const exchangeCodeForToken = async (
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{ access_token: string; expires_in: number; refresh_token?: string }> => {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
  }

  return response.json();
};

// Serviços da API do Spotify
export const spotifyService = {
  // Perfil do usuário
  async getUserProfile(): Promise<UserProfile> {
    const response = await spotifyAPI.get<UserProfile>('/me');
    return response.data;
  },

  // Top tracks do usuário
  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<Track[]> {
    const response = await spotifyAPI.get<SpotifyApiResponse<Track>>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
    return response.data.items;
  },

  // Top artists do usuário
  async getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<Artist[]> {
    const response = await spotifyAPI.get<SpotifyApiResponse<Artist>>(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
    return response.data.items;
  },

  // Recently played tracks
  async getRecentlyPlayed(limit: number = 50): Promise<{ track: Track; played_at: string; context?: any }[]> {
    const response = await spotifyAPI.get(`/me/player/recently-played?limit=${limit}`);
    return response.data.items;
  },

  // Saved tracks
  async getSavedTracks(limit: number = 50, offset: number = 0): Promise<{ track: Track; added_at: string }[]> {
    const response = await spotifyAPI.get(`/me/tracks?limit=${limit}&offset=${offset}`);
    return response.data.items;
  },

  // Saved albums
  async getSavedAlbums(limit: number = 50, offset: number = 0): Promise<{ album: Album; added_at: string }[]> {
    const response = await spotifyAPI.get(`/me/albums?limit=${limit}&offset=${offset}`);
    return response.data.items;
  },

  // Buscar conteúdo
  async search(query: string, type: 'track' | 'artist' | 'album' | 'playlist', limit: number = 20): Promise<any> {
    const response = await spotifyAPI.get(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
    return response.data;
  },

  // Busca avançada com múltiplos tipos
  async searchAll(query: string, limit: number = 10): Promise<{
    tracks: Track[];
    artists: Artist[];
    albums: Album[];
    playlists: Playlist[];
  }> {
    const response = await spotifyAPI.get(`/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist&limit=${limit}`);
    return {
      tracks: response.data.tracks?.items || [],
      artists: response.data.artists?.items || [],
      albums: response.data.albums?.items || [],
      playlists: response.data.playlists?.items || [],
    };
  },

  // Detalhes de um artista
  async getArtist(artistId: string): Promise<Artist> {
    const response = await spotifyAPI.get<Artist>(`/artists/${artistId}`);
    return response.data;
  },

  // Top tracks de um artista
  async getArtistTopTracks(artistId: string, market: string = 'BR'): Promise<Track[]> {
    const response = await spotifyAPI.get(`/artists/${artistId}/top-tracks?market=${market}`);
    return response.data.tracks;
  },

  // Albums de um artista
  async getArtistAlbums(artistId: string, includeGroups: string = 'album,single', limit: number = 50): Promise<Album[]> {
    const response = await spotifyAPI.get(`/artists/${artistId}/albums?include_groups=${includeGroups}&limit=${limit}&market=BR`);
    return response.data.items;
  },

  // Múltiplos artistas
  async getArtists(artistIds: string[]): Promise<Artist[]> {
    const ids = artistIds.join(',');
    const response = await spotifyAPI.get(`/artists?ids=${ids}`);
    return response.data.artists;
  },

  // Detalhes de um album
  async getAlbum(albumId: string): Promise<Album> {
    const response = await spotifyAPI.get<Album>(`/albums/${albumId}`);
    return response.data;
  },

  // Tracks de um album
  async getAlbumTracks(albumId: string, limit: number = 50): Promise<Track[]> {
    const response = await spotifyAPI.get(`/albums/${albumId}/tracks?limit=${limit}`);
    return response.data.items;
  },

  // New releases
  async getNewReleases(limit: number = 20, country: string = 'BR'): Promise<Album[]> {
    const response = await spotifyAPI.get(`/browse/new-releases?limit=${limit}&country=${country}`);
    return response.data.albums.items;
  },

  // Playlists do usuário
  async getUserPlaylists(limit: number = 50): Promise<Playlist[]> {
    const response = await spotifyAPI.get<SpotifyApiResponse<Playlist>>(`/me/playlists?limit=${limit}`);
    return response.data.items;
  },

  // Detalhes de uma playlist
  async getPlaylist(playlistId: string): Promise<Playlist> {
    try {
      const response = await spotifyAPI.get<Playlist>(`/playlists/${playlistId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Acesso negado à playlist. Verifique se ela é pública ou se você tem permissão para acessá-la.');
      } else if (error.response?.status === 404) {
        throw new Error('Playlist não encontrada.');
      }
      throw error;
    }
  },

  // Criar nova playlist
  async createPlaylist(userId: string, name: string, description: string = '', isPublic: boolean = false): Promise<Playlist> {
    const response = await spotifyAPI.post(`/users/${userId}/playlists`, {
      name,
      description,
      public: isPublic
    });
    return response.data;
  },

  // Adicionar tracks a uma playlist
  async addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<{ snapshot_id: string }> {
    const response = await spotifyAPI.post(`/playlists/${playlistId}/tracks`, {
      uris: trackUris
    });
    return response.data;
  },

  // Available genre seeds (ainda funciona)
  async getAvailableGenreSeeds(): Promise<string[]> {
    try {
      const response = await spotifyAPI.get('/recommendations/available-genre-seeds');
      return response.data.genres;
    } catch (error) {
      // Fallback com gêneros conhecidos se a API falhar
      return [
        'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
        'blues', 'bossa-nova', 'brazil', 'breakbeat', 'british',
        'chill', 'classical', 'country', 'dance', 'deep-house',
        'disco', 'drum-and-bass', 'dub', 'dubstep', 'edm',
        'electronic', 'folk', 'funk', 'garage', 'gospel',
        'groove', 'grunge', 'hip-hop', 'house', 'indie',
        'jazz', 'latin', 'metal', 'pop', 'punk',
        'r-n-b', 'reggae', 'rock', 'soul', 'techno'
      ];
    }
  },

  // Verificar se user segue artistas
  async checkFollowingArtists(artistIds: string[]): Promise<boolean[]> {
    const ids = artistIds.join(',');
    const response = await spotifyAPI.get(`/me/following/contains?type=artist&ids=${ids}`);
    return response.data;
  },

  // Seguir artista
  async followArtist(artistId: string): Promise<void> {
    await spotifyAPI.put(`/me/following?type=artist&ids=${artistId}`);
  },

  // Parar de seguir artista
  async unfollowArtist(artistId: string): Promise<void> {
    await spotifyAPI.delete(`/me/following?type=artist&ids=${artistId}`);
  },
};

export default spotifyService; 