import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the welcome screen', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument();
});
