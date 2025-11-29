import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'default' | 'connection' | 'maintenance';
  className?: string;
}

export default function ErrorState({
  title,
  message,
  onRetry,
  variant = 'default',
  className = '',
}: ErrorStateProps) {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (variant) {
      case 'connection':
        return <WifiOff className="h-16 w-16 text-muted-foreground" />;
      case 'maintenance':
        return <AlertCircle className="h-16 w-16 text-amber-500" />;
      default:
        return <AlertCircle className="h-16 w-16 text-destructive" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (variant) {
      case 'connection':
        return t('connectionError');
      case 'maintenance':
        return t('maintenanceMode');
      default:
        return t('errorLoadingContent');
    }
  };

  const getMessage = () => {
    if (message) return message;
    switch (variant) {
      case 'connection':
        return t('connectionErrorMessage');
      case 'maintenance':
        return t('maintenanceMessage');
      default:
        return t('temporaryIssue');
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
      role="alert"
      aria-live="polite"
      data-testid="error-state"
    >
      <div className="mb-6">
        {getIcon()}
      </div>
      <h3 className="text-2xl font-semibold mb-3" data-testid="error-state-title">
        {getTitle()}
      </h3>
      <p className="text-lg text-muted-foreground max-w-md mb-6" data-testid="error-state-message">
        {getMessage()}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          size="lg"
          className="text-base"
          data-testid="button-retry"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          {t('tryAgain')}
        </Button>
      )}
    </div>
  );
}
