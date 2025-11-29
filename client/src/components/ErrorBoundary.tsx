import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { translations, type Language } from '@/lib/i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function getStoredLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language');
    if (stored === 'hi' || stored === 'en') return stored;
  }
  return 'en';
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const language = getStoredLanguage();
      const t = translations[language];

      return (
        <div
          className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
          role="alert"
          aria-live="polite"
          data-testid="error-boundary"
        >
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">
            {t.somethingWentWrong}
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mb-6">
            {t.unexpectedError}
          </p>
          <Button
            onClick={this.handleRetry}
            size="lg"
            className="text-base"
            data-testid="button-retry-boundary"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            {t.tryAgain}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
