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

  // Características de áudio de múltiplas faixas - usando o endpoint correto com ?ids=
  async getAudioFeatures(trackIds: string[]): Promise<AudioFeatures[]> {
    if (trackIds.length === 0) {
      return [];
    }

    try {
      console.log(`🎵 Iniciando busca de características para ${trackIds.length} faixas`);
      
      // Verificar se há token válido
      const token = window.localStorage.getItem('spotify_token');
      if (!token) {
        throw new Error('Token de acesso não encontrado. Faça login novamente.');
      }

      // Filtrar IDs válidos (remover nulls, undefined, strings vazias)
      const validTrackIds = trackIds.filter(id => id && typeof id === 'string' && id.trim().length > 0);
      
      if (validTrackIds.length === 0) {
        console.warn('Nenhum ID de faixa válido encontrado');
        return [];
      }

      // A API do Spotify permite até 100 faixas por requisição
      const BATCH_SIZE = 100;
      const allAudioFeatures: AudioFeatures[] = [];

      // Processar em lotes de 100 faixas
      for (let i = 0; i < validTrackIds.length; i += BATCH_SIZE) {
        const batch = validTrackIds.slice(i, i + BATCH_SIZE);
        console.log(`📦 Lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(validTrackIds.length / BATCH_SIZE)}: ${batch.length} faixas`);
        
        try {
          // Usar o endpoint correto com query parameter ?ids=
          const idsParam = batch.join(',');
          const response = await spotifyAPI.get<{ audio_features: (AudioFeatures | null)[] }>(`/audio-features?ids=${encodeURIComponent(idsParam)}`);
          
          // Filtrar resultados válidos (a API pode retornar null para faixas não encontradas)
          const validFeatures = response.data.audio_features.filter((feature): feature is AudioFeatures => feature !== null);
          
          allAudioFeatures.push(...validFeatures);
          console.log(`✅ ${validFeatures.length}/${batch.length} faixas processadas`);
          
          // Delay entre lotes para evitar rate limiting
          if (i + BATCH_SIZE < validTrackIds.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
        } catch (error: any) {
          console.error(`❌ Erro no lote ${Math.floor(i / BATCH_SIZE) + 1}:`, {
            status: error.response?.status,
            message: error.response?.data?.error?.message || error.message,
            batchSize: batch.length
          });
          
          // Se o lote falhar, continuar com o próximo
          continue;
        }
      }
      
      console.log(`🎉 Análise concluída: ${allAudioFeatures.length}/${validTrackIds.length} faixas analisadas com sucesso`);
      return allAudioFeatures;
      
    } catch (error: any) {
      console.error('❌ Erro geral na busca de características:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Acesso negado às características de áudio das faixas. Verifique se você tem as permissões necessárias.');
      } else if (error.response?.status === 401) {
        throw new Error('Token expirado. Faça login novamente.');
      } else if (error.response?.status === 429) {
        throw new Error('Muitas requisições. Aguarde um momento e tente novamente.');
      }
      
      throw error;
    }
  },

  // Características de áudio de uma única faixa - usar getAudioFeatures([trackId]) em vez disso
  async getSingleAudioFeatures(trackId: string): Promise<AudioFeatures | null> {
    try {
      const result = await this.getAudioFeatures([trackId]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error(`Erro ao buscar características da faixa ${trackId}:`, error);
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