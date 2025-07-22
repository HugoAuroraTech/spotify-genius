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

// Função para trocar authorization code por access token
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

  // Características de áudio de múltiplas faixas
  async getAudioFeatures(trackIds: string[]): Promise<AudioFeatures[]> {
    if (trackIds.length === 0) {
      return [];
    }
    
    try {
      // Fazer requisições individuais para evitar problemas com muitos IDs
      const audioFeaturesPromises = trackIds.map(async (trackId) => {
        try {
          const response = await spotifyAPI.get<AudioFeatures>(`/audio-features/${trackId}`);
          return response.data;
        } catch (error: any) {
          console.warn(`Erro ao buscar características da faixa ${trackId}:`, error);
          return null; // Retorna null se a faixa não puder ser analisada
        }
      });

      // Esperar todas as requisições terminarem
      const results = await Promise.all(audioFeaturesPromises);
      
      // Filtrar resultados válidos
      return results.filter((feature): feature is AudioFeatures => feature !== null);
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Acesso negado às características de áudio das faixas.');
      }
      throw error;
    }
  },

  // Características de áudio de uma única faixa
  async getSingleAudioFeatures(trackId: string): Promise<AudioFeatures | null> {
    try {
      const response = await spotifyAPI.get<AudioFeatures>(`/audio-features/${trackId}`);
      return response.data;
    } catch (error: any) {
      console.warn(`Erro ao buscar características da faixa ${trackId}:`, error);
      return null;
    }
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