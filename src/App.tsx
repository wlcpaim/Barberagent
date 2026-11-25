import React from 'react';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  const path = window.location.pathname;

  if (path === '/admin') {
    return <AdminDashboard />;
  }

  return <LandingPage />;
}

export default App;
