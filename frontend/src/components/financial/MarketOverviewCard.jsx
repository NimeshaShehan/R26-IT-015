import { CheckCircle, Clock, DollarSign, TrendingUp, Bell } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import { useCurrency } from '../../context/CurrencyContext';

export default function MarketOverviewCard({ result, metalObj }) {
  const isSell = result.recommendation === 'SELL NOW';
  const { format } = useCurrency();

  return (
    <div className="card card-pad fade-in" style={{
      borderColor: isSell ? 'rgba(34,197,94,0.3)' : 'rgba(255,184,0,0.3)',
      background: isSell
        ? 'linear-gradient(135deg, rgba(22,163,74,0.05) 0%, var(--bg-surface) 100%)'
        : 'linear-gradient(135deg, rgba(217,119,6,0.05) 0%, var(--bg-surface) 100%)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div className="kpi-label" style={{ marginBottom: 8 }}>ARIMA + LSTM Forecast Recommendation</div>
          <StatusBadge type={isSell ? 'sell' : 'hold'}>
            {isSell ? <CheckCircle size={12} /> : <Clock size={12} />}
            {result.recommendation}
          </StatusBadge>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="kpi-label">Current Spot Price</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)', marginTop: 4 }}>
            {format(result.current_price)}
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4, fontFamily: 'var(--font-body)' }}>/kg</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 18 }}>
        {result.recommendation_reason}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {isSell ? (
          <>
            <div className="card" style={{ padding: '14px 16px', borderColor: 'rgba(34,197,94,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <DollarSign size={13} style={{ color: 'var(--accent-green)' }} />
                <span className="kpi-label" style={{ marginBottom: 0 }}>Total Revenue if Sold Now</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--accent-green)', fontWeight: 500 }}>
                {format(result.profit_if_sell)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {result.weight_kg} kg × {format(result.unit_price)}/kg
              </div>
            </div>
            <div className="card" style={{ padding: '14px 16px' }}>
              <div className="kpi-label">Metal</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4, textTransform: 'capitalize' }}>
                {metalObj?.label || result.metal}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{metalObj?.symbol}</div>
            </div>
            <div className="card" style={{ padding: '14px 16px' }}>
              <div className="kpi-label">Weight Submitted</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--text-primary)', marginTop: 4 }}>
                {result.weight_kg} kg
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card" style={{ padding: '14px 16px', borderColor: 'rgba(255,184,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <TrendingUp size={13} style={{ color: 'var(--accent-amber)' }} />
                <span className="kpi-label" style={{ marginBottom: 0 }}>Expected Peak Price</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--accent-amber)', fontWeight: 500 }}>
                {format(result.expected_peak_price)}/kg
              </div>
            </div>
            <div className="card" style={{ padding: '14px 16px', borderColor: 'rgba(255,184,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Clock size={13} style={{ color: 'var(--accent-amber)' }} />
                <span className="kpi-label" style={{ marginBottom: 0 }}>Peak Expected On</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
                {result.expected_peak_date}
              </div>
            </div>
            <div className="card" style={{ padding: '14px 16px', borderColor: 'rgba(255,184,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Bell size={13} style={{ color: 'var(--accent-amber)' }} />
                <span className="kpi-label" style={{ marginBottom: 0 }}>Price Alert</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--accent-amber)', fontWeight: 600 }}>Alert set for peak 🔔</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                Notify when price exceeds {format(result.expected_peak_price, 0)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
