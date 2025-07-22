import styled from 'styled-components';

const ErrorContainer = styled.div`
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ErrorIcon = styled.div`
  font-size: 1.2rem;
  min-width: 24px;
`;

const ErrorContent = styled.div`
  flex: 1;
`;

const ErrorTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
`;

const ErrorDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.4;
`;

const RetryButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #c82333;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showIcon?: boolean;
}

const ErrorMessage = ({ 
  title = "Erro", 
  message, 
  onRetry, 
  retryText = "Tentar Novamente",
  showIcon = true 
}: ErrorMessageProps) => {
  return (
    <ErrorContainer>
      {showIcon && <ErrorIcon>⚠️</ErrorIcon>}
      <ErrorContent>
        <ErrorTitle>{title}</ErrorTitle>
        <ErrorDescription>{message}</ErrorDescription>
      </ErrorContent>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          {retryText}
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage; 