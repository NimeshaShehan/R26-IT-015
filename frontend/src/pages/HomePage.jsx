import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Recycle, FileText, Activity, ShieldCheck, Layers, Cpu } from 'lucide-react'
import useSilentRefresh from '../hooks/useSilentRefresh'
import MetricKPICard from '../components/shared/MetricKPICard'
import { checkHealth } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { useNotifications } from '../context/NotificationContext'
import toast from 'react-hot-toast'

const FALLBACK_PRICES = [
  { metal: 'aluminium', label: 'Aluminium',       price_usd_kg: 3.520,    change_24h_pct: +0.68, recommendation: 'SELL_NOW' },
  { metal: 'copper',    label: 'Copper',           price_usd_kg: 13.573,   change_24h_pct: +1.34, recommendation: 'SELL_NOW' },
  { metal: 'nickel',    label: 'Nickel',           price_usd_kg: 18.892,   change_24h_pct: -1.31, recommendation: 'SELL_NOW' },
  { metal: 'zinc',      label: 'Zinc',             price_usd_kg: 3.458,    change_24h_pct: +1.75, recommendation: 'HOLD'     },
  { metal: 'lead',      label: 'Lead',             price_usd_kg: 1.975,    change_24h_pct: -0.35, recommendation: 'SELL_NOW' },
  { metal: 'silver',    label: 'Silver (Refined)', price_usd_kg: 2540.0,   change_24h_pct: +2.10, recommendation: 'HOLD'     },
  { metal: 'gold',      label: 'Gold (Refined)',   price_usd_kg: 151600.0, change_24h_pct: +0.63, recommendation: 'SELL_NOW' },
]

function VolatilityGauge({ value = 78.4 }) {
  const { t } = useLanguage();
  const pct = Math.min(100, Math.max(0, value)) / 100;
  const angle = -180 + pct * 180;
  return (
    <div className="card card-pad" style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="kpi-label" style={{ textAlign: 'center', marginBottom: 8 }}>{t('home.volatilityIndex')}</div>
      <svg viewBox="0 0 160 95" width="100%" style={{ maxWidth: 180, margin: '0 auto', display: 'block' }}>
        <path d="M 18 85 A 62 62 0 0 1 142 85" fill="none" stroke="var(--bg-hover)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 18 85 A 62 62 0 0 1 142 85" fill="none" stroke="var(--accent-amber)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${pct * 195} 195`} />
        <g transform={`rotate(${angle}, 80, 85)`}>
          <line x1="80" y1="85" x2="80" y2="32" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="85" r="4" fill="var(--accent-amber)" />
        </g>
        <text x="14" y="90" fontSize="9" fill="var(--text-muted)" textAnchor="middle">{t('home.volatilityLow')}</text>
        <text x="146" y="90" fontSize="9" fill="var(--text-muted)" textAnchor="middle">{t('home.volatilityHigh')}</text>
      </svg>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, color: 'var(--accent-amber)', marginTop: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t('home.volatilityDesc')}</div>
    </div>
  );
}

function MetalPriceCard({ metal, navigate }) {
  const { format, currency } = useCurrency()
  const METAL_COLORS = {
    aluminium: { from: '#1e3a5f', to: '#2563eb', accent: '#93c5fd' },
    copper:    { from: '#7c2d12', to: '#ea580c', accent: '#fdba74' },
    nickel:    { from: '#1f2937', to: '#4b5563', accent: '#d1d5db' },
    zinc:      { from: '#064e3b', to: '#059669', accent: '#6ee7b7' },
    lead:      { from: '#3b0764', to: '#7c3aed', accent: '#c4b5fd' },
    silver:    { from: '#1e293b', to: '#64748b', accent: '#e2e8f0' },
    gold:      { from: '#78350f', to: '#b45309', accent: '#fcd34d' },
  }

  const colors = METAL_COLORS[metal.metal] || { from: '#1f2937', to: '#374151', accent: '#fff' }
  const isUp   = metal.change_24h_pct >= 0

  return (
    <div
      onClick={() => navigate('/financial', { state: { selectedMetal: metal.metal } })}
      style={{
        background:    `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
        borderRadius:  20,
        padding:       '20px',
        cursor:        'pointer',
        transition:    'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow:     '0 4px 16px rgba(0,0,0,0.08)',
        position:      'relative',
        overflow:      'hidden',
        minWidth:      0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform  = 'translateY(-3px)'
        e.currentTarget.style.boxShadow  = '0 8px 28px rgba(0,0,0,0.14)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform  = 'translateY(0)'
        e.currentTarget.style.boxShadow  = '0 4px 16px rgba(0,0,0,0.08)'
      }}
    >
      {/* Decorative circle */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
      }} />

      {/* Metal name */}
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.accent, letterSpacing: 1, textTransform: 'uppercase' }}>
        {metal.label}
      </p>

      {/* Price */}
      <p style={{
        margin: '8px 0 4px',
        fontSize: metal.price_usd_kg > 1000 ? 18 : 24,
        fontWeight: 900,
        color: '#ffffff',
        lineHeight: 1.1,
        fontFamily: 'monospace',
      }}>
        {metal.price_usd_kg > 1000
          ? format(metal.metal === 'gold' ? metal.price_usd_kg / 32.1507 : metal.price_usd_kg, 0)
          : format(metal.price_usd_kg, 3)
        }
      </p>
      <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
        {currency} / {metal.metal === 'gold' ? 'troy oz' : 'kg'}
      </p>

      {/* 24h change badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <span style={{
          padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          background: isUp ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
          color:      isUp ? '#86efac'              : '#fca5a5',
          border:     `1px solid ${isUp ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
        }}>
          {isUp ? '▲' : '▼'} {Math.abs(metal.change_24h_pct).toFixed(2)}%
        </span>
        <span style={{
          padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 800,
          background: metal.recommendation === 'SELL_NOW'
            ? 'rgba(34,197,94,0.3)'
            : 'rgba(251,191,36,0.3)',
          color: metal.recommendation === 'SELL_NOW' ? '#86efac' : '#fde68a',
          border: `1px solid ${metal.recommendation === 'SELL_NOW' ? 'rgba(34,197,94,0.5)' : 'rgba(251,191,36,0.5)'}`,
        }}>
          {metal.recommendation === 'SELL_NOW' ? '✅ SELL' : '⏳ HOLD'}
        </span>
      </div>

    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { t } = useLanguage();
  const { priceData } = useNotifications();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <MetricKPICard label={t('home.pipelineStatus')} value="85%" sub={t('home.pipelineSub')} variant="teal" icon={Activity} progress={85} />
        <MetricKPICard label={t('home.activeMetals')} value="7" sub={t('home.activeMetalsSub')} variant="blue" icon={Layers} />
        <MetricKPICard label={t('home.forecastingEngine')} value="ONLINE" sub={t('home.forecastingSub')} variant="amber" icon={Cpu} />
      </div>
      

      {/* Market Overview & Volatility Gauge */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 16, alignItems: 'start' }}>
        
        {/* Left Column: Market Overview */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                📊 {t('home.marketOverview')}
              </h2>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
              background: 'var(--bg-hover)', color: 'var(--accent-green)',
              border: '1px solid var(--border-accent)',
            }}>
              🟢 {t('home.live')}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 14,
          }}>
            {(priceData?.prices || FALLBACK_PRICES).map(metal => (
              <MetalPriceCard key={metal.metal} metal={metal} navigate={navigate} />
            ))}
          </div>
        </div>
        
        {/* Right Column: Volatility Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <VolatilityGauge value={78.4} />
        </div>

      </div>

      <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
        {t('home.footerText')}
      </div>
    </div>
  )
}
