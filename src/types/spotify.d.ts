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
  total_tracks?: number;
  album_type?: string;
  tracks?: {
    items: Track[];
  };
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

// Tipos para recently played
export interface RecentlyPlayedItem {
  track: Track;
  played_at: string;
  context?: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  };
}

// Tipos para saved items
export interface SavedTrack {
  track: Track;
  added_at: string;
}

export interface SavedAlbum {
  album: Album;
  added_at: string;
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

// Tipos para busca
export interface SearchResults {
  tracks?: {
    items: Track[];
    total: number;
  };
  artists?: {
    items: Artist[];
    total: number;
  };
  albums?: {
    items: Album[];
    total: number;
  };
  playlists?: {
    items: Playlist[];
    total: number;
  };
}

// Tipos para new releases
export interface NewReleasesResponse {
  albums: {
    items: Album[];
    total: number;
    limit: number;
    offset: number;
  };
}

// Tipos úteis para a aplicação
export interface TimeRange {
  value: 'short_term' | 'medium_term' | 'long_term';
  label: string;
  description: string;
} 