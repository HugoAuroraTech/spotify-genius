import { useState, useEffect } from 'react';
import { spotifyService } from '../services/spotifyAPI';
import type { UserProfile, Artist, Track } from '../types/spotify';

interface UseSpotifyDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserProfile = (): UseSpotifyDataState<UserProfile> => {
  const [state, setState] = useState<UseSpotifyDataState<UserProfile>>({
    data: null,
    loading: true,
    error: null,
    refetch: () => {},
  });

  const fetchProfile = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const profile = await spotifyService.getUserProfile();
      setState(prev => ({ ...prev, data: profile, loading: false }));
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro ao carregar perfil do usuário' 
      }));
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    ...state,
    refetch: fetchProfile,
  };
};

export const useTopArtists = (
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 20
): UseSpotifyDataState<Artist[]> => {
  const [state, setState] = useState<UseSpotifyDataState<Artist[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: () => {},
  });

  const fetchTopArtists = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const artists = await spotifyService.getTopArtists(timeRange, limit);
      setState(prev => ({ ...prev, data: artists, loading: false }));
    } catch (error) {
      console.error('Erro ao buscar top artistas:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro ao carregar artistas mais ouvidos' 
      }));
    }
  };

  useEffect(() => {
    fetchTopArtists();
  }, [timeRange, limit]);

  return {
    ...state,
    refetch: fetchTopArtists,
  };
};

export const useTopTracks = (
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 20
): UseSpotifyDataState<Track[]> => {
  const [state, setState] = useState<UseSpotifyDataState<Track[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: () => {},
  });

  const fetchTopTracks = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const tracks = await spotifyService.getTopTracks(timeRange, limit);
      setState(prev => ({ ...prev, data: tracks, loading: false }));
    } catch (error) {
      console.error('Erro ao buscar top faixas:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro ao carregar faixas mais ouvidas' 
      }));
    }
  };

  useEffect(() => {
    fetchTopTracks();
  }, [timeRange, limit]);

  return {
    ...state,
    refetch: fetchTopTracks,
  };
};

// Hook genérico para qualquer função do serviço Spotify
export const useSpotifyQuery = <T>(
  queryFn: () => Promise<T>,
  dependencies: any[] = []
): UseSpotifyDataState<T> => {
  const [state, setState] = useState<UseSpotifyDataState<T>>({
    data: null,
    loading: true,
    error: null,
    refetch: () => {},
  });

  const executeQuery = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await queryFn();
      setState(prev => ({ ...prev, data, loading: false }));
    } catch (error) {
      console.error('Erro na consulta Spotify:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro ao carregar dados' 
      }));
    }
  };

  useEffect(() => {
    executeQuery();
  }, dependencies);

  return {
    ...state,
    refetch: executeQuery,
  };
}; 