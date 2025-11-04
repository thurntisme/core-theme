import React from 'react';

import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SITE_NAME } from '@/constants/site';

type Props = {
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
  onRefetch: () => void;
};

const ContentLoading = () => {
  return (
    <Card className="w-full h-[70vh] flex items-center justify-center">
      <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 min-w-[500px] max-w-full">
        <Loader2 className={`h-12 w-12 animate-spin text-primary`} />
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">{SITE_NAME}</h3>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full animate-pulse"
            style={{ width: '60%' }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

const ContentError = ({
  message,
  handleRetry,
}: {
  message?: string;
  handleRetry: () => void;
}) => {
  return (
    <Card className="w-full h-[70vh] flex flex-col items-center justify-center">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-xl font-semibold">
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>

        {message && (
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs font-mono text-muted-foreground break-all">
              {message}
            </p>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Button onClick={handleRetry} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            If the problem persists, please contact support
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
const ContentWrapper = ({ isLoading, error, children, onRefetch }: Props) => {
  if (isLoading) {
    return <ContentLoading />;
  }
  if (error) {
    return <ContentError handleRetry={onRefetch} />;
  }
  return <>{children}</>;
};

export default ContentWrapper;
