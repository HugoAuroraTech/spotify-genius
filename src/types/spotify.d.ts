// Tipos para a API do Spotify

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
  followers: {
    total: number;
  };
  country: string;
}

export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface Artist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  uri: string;
}

export interface Album {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  artists: Artist[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  tracks: {
    total: number;
    items: PlaylistTrack[];
  };
  owner: {
    id: string;
    display_name: string;
  };
  public: boolean;
  collaborative: boolean;
  external_urls: {
    spotify: string;
  };
}

export interface PlaylistTrack {
  track: Track;
  added_at: string;
}

export interface AudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export interface RecommendationSeed {
  seed_artists?: string[];
  seed_tracks?: string[];
  seed_genres?: string[];
  target_acousticness?: number;
  target_danceability?: number;
  target_energy?: number;
  target_instrumentalness?: number;
  target_liveness?: number;
  target_loudness?: number;
  target_popularity?: number;
  target_speechiness?: number;
  target_tempo?: number;
  target_valence?: number;
  limit?: number;
}

export interface Recommendations {
  tracks: Track[];
  seeds: Array<{
    type: string;
    id: string;
  }>;
}

// Tipos para resposta da API
export interface SpotifyApiResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

// Tipos para criação de playlist
export interface CreatePlaylistRequest {
  name: string;
  description?: string;
  public?: boolean;
  collaborative?: boolean;
}

export interface AddTracksToPlaylistRequest {
  uris: string[];
  position?: number;
} 