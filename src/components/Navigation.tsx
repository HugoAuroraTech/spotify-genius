import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const NavContainer = styled.nav`
  background: rgba(25, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(29, 185, 84, 0.3);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #1db954, #1ed760);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? '#1db954' : 'transparent'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.active ? '#1ed760' : 'rgba(29, 185, 84, 0.2)'};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(220, 53, 69, 0.2);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(25, 20, 20, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    border-bottom: 1px solid rgba(29, 185, 84, 0.3);
  }
`;

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <NavContainer>
      <NavContent>
        <Logo onClick={() => navigateTo('/dashboard')}>
          🎵 Spotify Genius
        </Logo>
        
        <NavLinks>
          <NavLink 
            active={isActive('/dashboard')} 
            onClick={() => navigateTo('/dashboard')}
          >
            📊 Dashboard
          </NavLink>
          <NavLink 
            active={isActive('/playlist-analyzer')} 
            onClick={() => navigateTo('/playlist-analyzer')}
          >
            🎵 Analisar Playlist
          </NavLink>
          <NavLink 
            active={isActive('/playlist-generator')} 
            onClick={() => navigateTo('/playlist-generator')}
          >
            🤖 Gerar Playlist
          </NavLink>
        </NavLinks>

        <UserSection>
          <LogoutButton onClick={handleLogout}>
            Sair
          </LogoutButton>
          
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </MobileMenuButton>
        </UserSection>
      </NavContent>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <NavLink 
          active={isActive('/dashboard')} 
          onClick={() => navigateTo('/dashboard')}
        >
          📊 Dashboard
        </NavLink>
        <NavLink 
          active={isActive('/playlist-analyzer')} 
          onClick={() => navigateTo('/playlist-analyzer')}
        >
          🎵 Analisar Playlist
        </NavLink>
        <NavLink 
          active={isActive('/playlist-generator')} 
          onClick={() => navigateTo('/playlist-generator')}
        >
          🤖 Gerar Playlist
        </NavLink>
      </MobileMenu>
    </NavContainer>
  );
};

export default Navigation; 