import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = window.localStorage.getItem('spotify_token');
      const expirationTime = window.localStorage.getItem('spotify_token_expires');

      // Verifica se o token existe
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          token: null,
          isLoading: false,
        });
        return;
      }

      // Verifica se o token expirou
      if (expirationTime) {
        const now = new Date().getTime();
        const expiration = parseInt(expirationTime);
        
        if (now >= expiration) {
          // Token expirado, remove do localStorage
          window.localStorage.removeItem('spotify_token');
          window.localStorage.removeItem('spotify_token_expires');
          setAuthState({
            isAuthenticated: false,
            token: null,
            isLoading: false,
          });
          return;
        }
      }

      // Token válido
      setAuthState({
        isAuthenticated: true,
        token,
        isLoading: false,
      });
    };

    checkAuth();

    // Listener para mudanças no localStorage (para sincronização entre abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'spotify_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    window.localStorage.removeItem('spotify_token');
    window.localStorage.removeItem('spotify_token_expires');
    setAuthState({
      isAuthenticated: false,
      token: null,
      isLoading: false,
    });
  };

  const login = (token: string, expiresIn?: number) => {
    window.localStorage.setItem('spotify_token', token);
    
    if (expiresIn) {
      const expirationTime = new Date().getTime() + (expiresIn * 1000);
      window.localStorage.setItem('spotify_token_expires', expirationTime.toString());
    }

    setAuthState({
      isAuthenticated: true,
      token,
      isLoading: false,
    });
  };

  return {
    ...authState,
    logout,
    login,
  };
}; 