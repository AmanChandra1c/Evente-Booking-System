import React from 'react';
import Router from '../routes/Routers';
import toast, { Toaster } from "react-hot-toast";
import PageTransition from './components/ui/PageTransition';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <PageTransition>
        <Router />
      </PageTransition>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            backdropFilter: 'blur(10px)',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f8fafc',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f8fafc',
            },
          },
        }}
      />
    </div>
  );
};

export default App;