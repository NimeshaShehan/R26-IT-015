import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ManifestProvider } from './context/ManifestContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import FinancialForecaster from './components/financial/FinancialForecaster';
import StrategicDisposition from './components/disposition/StrategicDisposition';
import TonnageManifestPage from './components/disposition/TonnageManifestPage';

function AppShell() {
  const location = useLocation();
  const path = location.pathname.substring(1);
  const activePage = path === 'financial' ? 'forecast' : path || 'dashboard';

  return (
    <div className="app-shell">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-accent)',
            borderRadius: '8px',
            fontSize: '13px',
          },
        }}
      />
      <Sidebar activePage={activePage} />
      <div className="main-area">
        <Header activePage={activePage} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/financial" element={<FinancialForecaster />} />
            <Route path="/disposition" element={<StrategicDisposition />} />
            <Route path="/manifest" element={<TonnageManifestPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <CurrencyProvider>
            <ManifestProvider>
              <AppShell />
            </ManifestProvider>
          </CurrencyProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
