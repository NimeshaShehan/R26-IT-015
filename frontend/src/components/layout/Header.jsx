import { useState, useCallback } from 'react';
import { Bell, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import LiveClock from '../shared/LiveClock';

export default function Header() {
  const { theme, toggle } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, t } = useLanguage();
  const { notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const location = window.location.pathname; // or useLocation() from react-router-dom

  return (
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p style={{ fontWeight: 700, color: 'var(--accent-green)', margin: 0, fontSize: 18 }}>
        {t('header.title')}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        <LiveClock />

        {/* Language toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-hover)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          overflow: 'hidden',
          height: 32,
        }}>
          {[{code: 'en', label: 'EN'}, {code: 'si', label: 'සිං'}, {code: 'ta', label: 'த'}].map(lang => (
            <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            style={{
              padding: '0 12px',
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: language === lang.code ? 'var(--accent-teal)' : 'transparent',
              color: language === lang.code ? 'white' : 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}
            aria-pressed={language === lang.code}
            title={`Switch to ${lang.code.toUpperCase()}`}
          >
            {lang.label}
          </button>
        ))}
        </div>

        {/* Currency toggle */}
        {!(location === '/disposition' || location === '/manifest') && (
          <div style={{
            display: 'flex',
            background: 'var(--bg-hover)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            overflow: 'hidden',
            height: 32,
          }}>
            {['USD', 'LKR'].map(cur => (
              <button
              key={cur}
              onClick={() => setCurrency(cur)}
              style={{
                padding: '0 12px',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: currency === cur ? 'var(--accent-teal)' : 'transparent',
                color: currency === cur ? 'white' : 'var(--text-secondary)',
                letterSpacing: '0.04em',
              }}
              aria-pressed={currency === cur}
              title={cur === 'USD' ? 'US Dollar' : 'Sri Lankan Rupee'}
            >
              {cur}
            </button>
          ))}
        </div>
        )}

        {/* Theme toggle */}
        <button className="theme-toggle" onClick={toggle}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            aria-label={t('header.notifications')}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={15} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--accent-amber)', border: '2px solid var(--bg-surface)'
              }} />
            )}
          </button>
          
          {showNotifications && (
            <div style={{
              position: 'absolute', top: '120%', right: 0, width: 300,
              background: 'var(--bg-surface)', border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-card)', padding: '10px 0', zIndex: 50,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <div style={{ padding: '0 15px 10px', fontSize: 14, fontWeight: 700, borderBottom: '1px solid var(--border-subtle)' }}>
                {t('header.notifications')}
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px 15px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                    No recent updates
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{ padding: '12px 15px', borderBottom: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Market Update</div>
                      {n.msg}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="icon-btn" aria-label={t('header.userProfile')}><User size={15} /></button>
      </div>
    </header>
  );
}
