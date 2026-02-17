import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">
              <AlertTriangle size={48} className="text-red-500" />
            </div>
            <h2 className="error-boundary-title">Une erreur est survenue</h2>
            <p className="error-boundary-message">
              Désolé, une erreur inattendue s'est produite lors de l'affichage de ce composant.
            </p>
            {this.state.error && (
              <details className="error-boundary-details">
                <summary>Détails techniques</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && <pre>{this.state.errorInfo.componentStack}</pre>}
              </details>
            )}
            <button onClick={this.handleReload} className="error-boundary-button">
              <RefreshCw size={16} className="mr-2" />
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
