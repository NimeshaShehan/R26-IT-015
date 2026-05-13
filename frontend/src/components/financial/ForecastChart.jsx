import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

export default function ForecastChart({ data, currentPrice }) {
  const { format, convert } = useCurrency();

  const chartData = data.map(d => ({
    date: d.date.slice(5),
    price:  convert(d.price),
    lower:  convert(d.lower_bound ?? d.price * 0.97),
    upper:  convert(d.upper_bound ?? d.price * 1.03),
  }));

  const all  = chartData.flatMap(d => [d.lower, d.upper]);
  const yMin = Math.min(...all) * 0.99;
  const yMax = Math.max(...all) * 1.01;

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-accent)',
        borderRadius: 8, padding: '10px 14px', fontSize: 12,
        color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color, fontFamily: 'var(--font-display)', fontSize: 13 }}>
            {p.name}: {format(p.value / (p.name === 'Forecast' ? 1 : 1), 2)}
          </div>
        ))}
      </div>
    );
  }

  const tickFmt = v =>
    v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M`
    : v >= 1_000   ? `${(v/1_000).toFixed(0)}k`
    : v.toFixed(1);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 12 }}>
        <defs>
          <linearGradient id="gPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="var(--accent-teal)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--accent-teal)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
               tickLine={false} axisLine={false}
               interval={Math.floor(chartData.length / 5)} />
        <YAxis domain={[yMin, yMax]}
               tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-display)' }}
               tickLine={false} axisLine={false}
               tickFormatter={tickFmt} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={convert(currentPrice)} stroke="var(--accent-amber)" strokeDasharray="5 3"
                       label={{ value: 'Current', fill: 'var(--accent-amber)', fontSize: 10 }} />
        <Area type="monotone" dataKey="upper" stroke="none" fill="rgba(0,153,255,0.06)" name="Upper" />
        <Area type="monotone" dataKey="lower" stroke="none" fill="none" name="Lower" />
        <Area type="monotone" dataKey="price" stroke="var(--accent-teal)" strokeWidth={2}
              fill="url(#gPrice)" name="Forecast" dot={false}
              activeDot={{ r: 4, fill: 'var(--accent-teal)' }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
