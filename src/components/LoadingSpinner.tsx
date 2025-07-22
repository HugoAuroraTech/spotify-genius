import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const Spinner = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  width: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  border: ${props => {
    switch (props.size) {
      case 'small': return '2px solid rgba(29, 185, 84, 0.3)';
      case 'large': return '6px solid rgba(29, 185, 84, 0.3)';
      default: return '4px solid rgba(29, 185, 84, 0.3)';
    }
  }};
  border-top: ${props => {
    switch (props.size) {
      case 'small': return '2px solid #1db954';
      case 'large': return '6px solid #1db954';
      default: return '4px solid #1db954';
    }
  }};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #666;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner = ({ size = 'medium', text }: LoadingSpinnerProps) => {
  return (
    <SpinnerContainer size={size}>
      <div>
        <Spinner size={size} />
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 