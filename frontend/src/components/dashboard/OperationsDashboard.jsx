import { useEffect, useState } from 'react';
import { Activity, ShieldCheck, Layers, Cpu, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import MetricKPICard from '../shared/MetricKPICard';
import SystemFeed from '../shared/SystemFeed';
import SkeletonCard from '../shared/SkeletonCard';
import { getCurrentPrices, predictForecast } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

// All 7 metals
const METALS = [
  { value: 'gold',      label: 'Gold (Refined)', symbol: 'Au', unit: '/troy oz', kgPerUnit: 0.0311 },
  { value: 'copper',    label: 'Copper',          symbol: 'Cu', unit: '/kg',      kgPerUnit: 1 },
  { value: 'aluminium', label: 'Aluminium',       symbol: 'Al', unit: '/kg',      kgPerUnit: 1 },
  { value: 'nickel',    label: 'Nickel',           symbol: 'Ni', unit: '/kg',      kgPerUnit: 1 },
  { value: 'zinc',      label: 'Zinc',             symbol: 'Zn', unit: '/kg',      kgPerUnit: 1 },
  { value: 'lead',      label: 'Lead',             symbol: 'Pb', unit: '/kg',      kgPerUnit: 1 },
  { value: 'silver',    label: 'Silver',           symbol: 'Ag', unit: '/troy oz', kgPerUnit: 0.0311 },
];

// Gauge SVG
function VolatilityGauge({ value = 78.4 }) {
  const pct = Math.min(100, Math.max(0, value)) / 100;
  const angle = -180 + pct * 180;
  return (
    <div className="card card-pad" style={{ textAlign: 'center' }}>
      <div className="kpi-label" style={{ textAlign: 'center', marginBottom: 8 }}>Market Volatility Index</div>
      <svg viewBox="0 0 160 95" width="100%" style={{ maxWidth: 180, margin: '0 auto', display: 'block' }}>
        <path d="M 18 85 A 62 62 0 0 1 142 85" fill="none" stroke="var(--bg-hover)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 18 85 A 62 62 0 0 1 142 85" fill="none" stroke="var(--accent-amber)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${pct * 195} 195`} />
        <g transform={`rotate(${angle}, 80, 85)`}>
          <line x1="80" y1="85" x2="80" y2="32" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="85" r="4" fill="var(--accent-amber)" />
        </g>
        <text x="14" y="90" fontSize="9" fill="var(--text-muted)" textAnchor="middle">Low</text>
        <text x="146" y="90" fontSize="9" fill="var(--text-muted)" textAnchor="middle">High</text>
      </svg>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, color: 'var(--accent-amber)', marginTop: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Elevated · Bullish Divergence</div>
    </div>
  );
}

// Single metal card
function MetalCard({ metal, price, forecast, loading, error }) {
  const { format } = useCurrency();

  if (loading) return <SkeletonCard height={50} />;

  const rec = forecast?.recommendation;
  const isSell = rec === 'SELL NOW';
  const isHold = rec === 'HOLD';

  // Compute 90d trend direction from forecast data
  let trendIcon = <Minus size={12} style={{ color: 'var(--text-muted)' }} />;
  if (forecast?.forecast_90d?.length > 1) {
    const first = forecast.forecast_90d[0].price;
    const last  = forecast.forecast_90d[forecast.forecast_90d.length - 1].price;
    if (last > first * 1.02)      trendIcon = <TrendingUp size={12} style={{ color: 'var(--accent-green)' }} />;
    else if (last < first * 0.98) trendIcon = <TrendingDown size={12} style={{ color: 'var(--accent-red)' }} />;
  }

  return (
    <div className="card card-pad fade-in" style={{
      borderColor: isSell ? 'rgba(34,197,94,0.25)' : isHold ? 'rgba(255,184,0,0.25)' : 'var(--border-subtle)',
      transition: 'all 0.2s ease',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div className="kpi-label">{metal.label}</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 6, marginTop: 4,
            background: 'var(--bg-hover)',
            fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 500,
            color: 'var(--text-secondary)',
          }}>
            {metal.symbol}
          </div>
        </div>
        {rec && (
          <span className={`badge ${isSell ? 'badge-sell' : 'badge-hold'}`} style={{ fontSize: 10 }}>
            {rec}
          </span>
        )}
        {!rec && error && (
          <span className="badge badge-danger" style={{ fontSize: 10 }}>Offline</span>
        )}
      </div>

      {/* Price */}
      {price !== undefined ? (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
          {format(price)}
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4, fontFamily: 'var(--font-body)' }}>
            {metal.unit}
          </span>
        </div>
      ) : (
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>
          {error ? 'Awaiting data…' : 'Loading…'}
        </div>
      )}

      {/* Trend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
        {trendIcon}
        <span>90-day outlook</span>
        {forecast?.mape !== undefined && (
          <span style={{ marginLeft: 'auto', color: forecast.mape < 15 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            MAPE {forecast.mape}%
          </span>
        )}
      </div>
    </div>
  );
}

export default function OperationsDashboard() {
  const [prices, setPrices]     = useState({});
  const [forecasts, setForecasts] = useState({});
  const [loadingMetal, setLoadingMetal] = useState(true);
  const [error, setError]       = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoadingMetal(true);
      setError(false);

      // 1. Fetch current prices
      try {
        const priceRes = await getCurrentPrices();
        if (!cancelled) setPrices(priceRes.data.prices || {});
      } catch {
        if (!cancelled) setError(true);
      }

      // 2. Fetch SELL/HOLD for all 7 metals in parallel (weight=1 for dashboard overview)
      const results = await Promise.allSettled(
        METALS.map(m => predictForecast(m.value, 1))
      );

      if (!cancelled) {
        const fcMap = {};
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            fcMap[METALS[i].value] = r.value.data;
          }
        });
        setForecasts(fcMap);
        setLoadingMetal(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <MetricKPICard label="Pipeline Status"        value="85%"    sub="Materials in processing"    variant="teal"  icon={Activity}     progress={85} />
        <MetricKPICard label="Landfill Diversion Rate" value="100%"  sub="Zero waste target met"      variant="green" icon={ShieldCheck} />
        <MetricKPICard label="Active Materials"        value="7"      sub="All metals monitored"       variant="blue"  icon={Layers} />
        <MetricKPICard label="Forecasting Engine"      value="ONLINE" sub="ARIMA + LSTM models active" variant="amber" icon={Cpu} />
      </div>

      {/* Market Overview + Right Column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 16, alignItems: 'start' }}>

        {/* Market Overview */}
        <div>
          <div className="section-title">
            <Activity size={16} className="icon" />
            Market Overview
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
              Live reference prices · SELL/HOLD from ARIMA+LSTM model
            </span>
          </div>

          {error && (
            <div className="error-banner" style={{ marginBottom: 12 }}>
              <AlertTriangle size={15} />
              Backend offline — showing cached data. Restart FastAPI server.
            </div>
          )}

          {/* 7 metals — 4 col row then 3 col row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
            {METALS.slice(0, 4).map(m => (
              <MetalCard key={m.value} metal={m}
                price={prices[m.value]}
                forecast={forecasts[m.value]}
                loading={loadingMetal}
                error={error} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {METALS.slice(4).map(m => (
              <MetalCard key={m.value} metal={m}
                price={prices[m.value]}
                forecast={forecasts[m.value]}
                loading={loadingMetal}
                error={error} />
            ))}
          </div>
        </div>

        {/* Right: Feed + Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SystemFeed />
          <VolatilityGauge value={78.4} />
        </div>
      </div>
    </div>
  );
}
