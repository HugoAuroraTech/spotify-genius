import axios from 'axios';
import type { 
  UserProfile, 
  Artist, 
  Track, 
  Playlist, 
  AudioFeatures, 
  Recommendations, 
  RecommendationSeed,
  SpotifyApiResponse,
  CreatePlaylistRequest,
  AddTracksToPlaylistRequest
} from '../types/spotify';

// Configuração base da API
const spotifyAPI = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  timeout: 10000,
});

// Interceptor para adicionar token de autorização automaticamente
spotifyAPI.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('spotify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Token expirado ou inválido
      window.localStorage.removeItem('spotify_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Serviços da API
export const spotifyService = {
  // Perfil do usuário
  async getUserProfile(): Promise<UserProfile> {
    const response = await spotifyAPI.get<UserProfile>('/me');
    return response.data;
  },

  // Top artistas
  async getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<Artist[]> {
    const response = await spotifyAPI.get<SpotifyApiResponse<Artist>>(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
    return response.data.items;
  },

  // Top faixas
  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<Track[]> {
    const response = await spotifyAPI.get<SpotifyApiResponse<Track>>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
    return response.data.items;
  },

  // Playlists do usuário
  async getUserPlaylists(limit: number = 20): Promise<Playlist[]> {
    const response = await spotifyAPI.get<SpotifyApiResponse<Playlist>>(`/me/playlists?limit=${limit}`);
    return response.data.items;
  },

  // Buscar playlist específica
  async getPlaylist(playlistId: string): Promise<Playlist> {
    const response = await spotifyAPI.get<Playlist>(`/playlists/${playlistId}`);
    return response.data;
  },

  // Características de áudio de múltiplas faixas
  async getAudioFeatures(trackIds: string[]): Promise<AudioFeatures[]> {
    const ids = trackIds.join(',');
    const response = await spotifyAPI.get<{ audio_features: AudioFeatures[] }>(`/audio-features?ids=${ids}`);
    return response.data.audio_features.filter(feature => feature !== null);
  },

  // Recomendações
  async getRecommendations(params: RecommendationSeed): Promise<Recommendations> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await spotifyAPI.get<Recommendations>(`/recommendations?${queryParams.toString()}`);
    return response.data;
  },

  // Gêneros disponíveis para recomendação
  async getAvailableGenres(): Promise<string[]> {
    const response = await spotifyAPI.get<{ genres: string[] }>('/recommendations/available-genre-seeds');
    return response.data.genres;
  },

  // Buscar artistas, faixas, etc.
  async search(query: string, type: 'artist' | 'track' | 'album' | 'playlist', limit: number = 20): Promise<any> {
    const response = await spotifyAPI.get(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
    return response.data[`${type}s`].items;
  },

  // Criar nova playlist
  async createPlaylist(userId: string, playlistData: CreatePlaylistRequest): Promise<Playlist> {
    const response = await spotifyAPI.post<Playlist>(`/users/${userId}/playlists`, playlistData);
    return response.data;
  },

  // Adicionar faixas à playlist
  async addTracksToPlaylist(playlistId: string, tracksData: AddTracksToPlaylistRequest): Promise<void> {
    await spotifyAPI.post(`/playlists/${playlistId}/tracks`, tracksData);
  },

  // Verificar se o usuário segue artistas
  async checkFollowingArtists(artistIds: string[]): Promise<boolean[]> {
    const ids = artistIds.join(',');
    const response = await spotifyAPI.get<boolean[]>(`/me/following/contains?type=artist&ids=${ids}`);
    return response.data;
  }
};

export default spotifyAPI; 