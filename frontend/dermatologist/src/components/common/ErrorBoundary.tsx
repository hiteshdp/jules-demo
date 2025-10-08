// Generated via prompt: prompts/dermatologist_error_boundary_v1.md

import { Component, ErrorInfo, ReactNode } from 'react';
import { Card, Button, Typography } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Here you would typically send error to monitoring service like Sentry
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="text-6xl text-red-500 mb-4">⚠️</div>
              <Title level={3} className="text-gray-900">
                Something went wrong
              </Title>
              <Text type="secondary" className="block mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </Text>
            </div>
            
            <div className="space-y-3">
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
                block
              >
                Reload Page
              </Button>
              <Button 
                icon={<HomeOutlined />}
                onClick={this.handleGoHome}
                block
              >
                Go to Home
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
