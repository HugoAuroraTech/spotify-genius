import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { getPKCEParams, clearPKCEParams } from '../utils/pkce';
import { exchangeCodeForToken } from '../services/spotifyAPI';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CallbackContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1db954 0%, #191414 100%);
  color: white;
  text-align: center;
  padding: 20px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid #1db954;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 2rem;
  color: #dc3545;
`;

const RetryButton = styled.button`
  background: #1db954;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: #1ed760;
  }
`;

const Callback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        
        // Verifica se há erro na URL
        if (error) {
          setStatus('error');
          setErrorMessage(
            error === 'access_denied' 
              ? 'Acesso negado. Você precisa autorizar o aplicativo para continuar.'
              : 'Erro durante a autenticação. Tente novamente.'
          );
          clearPKCEParams();
          return;
        }

        // Verifica se já tem token no localStorage
        const existingToken = window.localStorage.getItem("spotify_token");
        if (existingToken) {
          setStatus('success');
          navigate("/dashboard");
          return;
        }

        // Processa o authorization code
        if (code) {
          const { codeVerifier, state: storedState } = getPKCEParams();
          
          // Verifica o state para proteção CSRF
          if (!state || !storedState || state !== storedState) {
            setStatus('error');
            setErrorMessage('Erro de validação de segurança. Tente fazer login novamente.');
            clearPKCEParams();
            return;
          }

          if (!codeVerifier) {
            setStatus('error');
            setErrorMessage('Parâmetros de autenticação não encontrados. Tente fazer login novamente.');
            clearPKCEParams();
            return;
          }

          // Troca o código pelo token
          const redirectUri = import.meta.env.VITE_REDIRECT_URI;
          const tokenData = await exchangeCodeForToken(code, codeVerifier, redirectUri);
          
          // Salva o token
          window.localStorage.setItem("spotify_token", tokenData.access_token);
          
          if (tokenData.expires_in) {
            const expirationTime = new Date().getTime() + (tokenData.expires_in * 1000);
            window.localStorage.setItem("spotify_token_expires", expirationTime.toString());
          }

          if (tokenData.refresh_token) {
            window.localStorage.setItem("spotify_refresh_token", tokenData.refresh_token);
          }
          
          // Limpa os parâmetros PKCE
          clearPKCEParams();
          
          setStatus('success');
          
          // Redireciona após um pequeno delay para mostrar o sucesso
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          setStatus('error');
          setErrorMessage('Código de autorização não encontrado na resposta do Spotify.');
        }
        
      } catch (error) {
        console.error('Erro ao processar callback de autenticação:', error);
        setStatus('error');
        setErrorMessage(
          error instanceof Error 
            ? `Erro na autenticação: ${error.message}`
            : 'Erro inesperado durante a autenticação.'
        );
        clearPKCEParams();
      }
    };

    processAuthCallback();
  }, [navigate]);

  const handleRetry = () => {
    // Limpa qualquer token existente e volta para a página de login
    window.localStorage.removeItem("spotify_token");
    window.localStorage.removeItem("spotify_token_expires");
    navigate("/");
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Spinner />
            <Message>Processando autenticação...</Message>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
              Aguarde enquanto configuramos sua conta
            </p>
          </>
        );
      
      case 'success':
        return (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <Message>Autenticação realizada com sucesso!</Message>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
              Redirecionando para o dashboard...
            </p>
          </>
        );
      
      case 'error':
        return (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <Message>Falha na autenticação</Message>
            <ErrorMessage>
              {errorMessage}
            </ErrorMessage>
            <RetryButton onClick={handleRetry}>
              Tentar Novamente
            </RetryButton>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <CallbackContainer>
      {renderContent()}
    </CallbackContainer>
  );
};

export default Callback; 