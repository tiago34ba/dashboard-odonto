import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login screen when navigating to /login', async () => {
  window.history.pushState({}, 'Login page', '/login');
  render(<App />);
  expect(await screen.findByText(/Entre em sua conta/i)).toBeInTheDocument();
});
