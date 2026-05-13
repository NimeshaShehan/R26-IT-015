import { LayoutDashboard, TrendingUp, Recycle, FileText, LogOut, Leaf, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Sidebar({ activePage }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { id: 'dashboard',   icon: LayoutDashboard, label: t('nav.dashboard'), path: '/' },
    { id: 'forecast',    icon: TrendingUp,      label: t('nav.forecast'), path: '/financial' },
    { id: 'disposition', icon: Recycle,          label: t('nav.disposition'), path: '/disposition' },
    { id: 'manifest',    icon: FileText,         label: t('nav.manifest'), path: '/manifest' },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap style={{ color: 'var(--accent-green)' }} size={24} />
          <div>
            <p style={{ fontWeight: 900, fontSize: 16, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              EcoVision
            </p>
            <p style={{ color: 'var(--accent-green)', fontSize: 9, margin: 0, lineHeight: 1.3 }}>
              {t('header.title').split('—')[1] || 'Smart Valuation & Material Routing'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ id, icon: Icon, label, path }) => (
          <button
            key={id}
            onClick={() => navigate(path)}
            className={`nav-item ${activePage === id ? 'active' : ''}`}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        <button className="nav-item" style={{ color: 'var(--accent-red)' }}>
          <LogOut size={16} style={{ flexShrink: 0 }} />
          <span className="signout-label">{t('nav.signOut')}</span>
        </button>
      </div>
    </aside>
  );
}
