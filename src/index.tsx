import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as Sentry from '@sentry/react';
import { initSentry } from './monitoring/sentry';

initSentry();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Ocorreu um erro inesperado. Tente recarregar a pagina.</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

// Em desenvolvimento, desativa qualquer SW existente para não quebrar HMR/chunks.
if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('SW registrado com sucesso:', registration);
          }
        })
        .catch((registrationError) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('SW falha no registro:', registrationError);
          }
        });
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });

    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
