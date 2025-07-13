import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HospitalProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HospitalProvider>
  </React.StrictMode>
);