import * as Sentry from '@sentry/react';

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
const sentryEnabled = process.env.REACT_APP_ENABLE_SENTRY !== 'false' && Boolean(sentryDsn);

type ApiErrorContext = {
  client?: string;
  path?: string;
  method?: string;
  status?: number;
};

export const initSentry = (): void => {
  if (!sentryEnabled) {
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT || process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV,
    release: process.env.REACT_APP_RELEASE,
    tracesSampleRate: Number(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE || 0.1),
    enabled: sentryEnabled,
  });
};

export const captureApiError = (error: any, context?: ApiErrorContext): void => {
  if (!sentryEnabled) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setTag('error_source', 'api');

    if (context?.client) scope.setTag('api_client', context.client);
    if (context?.path) scope.setExtra('path', context.path);
    if (context?.method) scope.setExtra('method', context.method.toUpperCase());
    if (typeof context?.status === 'number') scope.setExtra('status', context.status);

    const backendMessage = error?.response?.data?.message;
    if (backendMessage) {
      scope.setExtra('backend_message', backendMessage);
    }

    Sentry.captureException(error);
  });
};