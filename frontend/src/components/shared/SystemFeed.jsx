/**
 * Simulated real-time system feed panel.
 * In production, replace FEED_ITEMS with a WebSocket or polling endpoint.
 */
const FEED_ITEMS = [
  { time: '14:32:01', metal: 'PVC', kg: 42.0,  tag: 'pyro',    route: 'PYROLYSIS',  kwh: 185.5, label: 'recovered' },
  { time: '14:29:44', metal: 'Copper', kg: 8.5, tag: 'sell',   route: 'SELL NOW',   price: '$4.12/lb' },
  { time: '14:25:12', metal: 'HDPE',   kg: 28.0, tag: 'pyro',  route: 'PYROLYSIS',  kwh: 240.1, label: 'recovered' },
  { time: '14:21:33', metal: 'Gold',   kg: 0.3,  tag: 'hold',  route: 'HOLD',       price: '$2,365/oz' },
  { time: '14:18:07', metal: 'Mixed Plastics', kg: 55.0, tag: 'pyro', route: 'PYROLYSIS', kwh: 357.6, label: 'recovered' },
  { time: '14:15:22', metal: 'Lithium', kg: 5.2, tag: 'sell',  route: 'SELL NOW',   price: '$28.40/kg' },
  { time: '14:12:48', metal: 'Contaminated Glass', kg: 18.0, tag: 'thermal', route: 'THERMAL', kwh: 6.0, label: 'recovered' },
  { time: '14:09:15', metal: 'Aluminium', kg: 12.0, tag: 'sell', route: 'SELL NOW', price: '$2,450/t' },
  { time: '14:06:30', metal: 'Polystyrene', kg: 33.0, tag: 'pyro', route: 'PYROLYSIS', kwh: 249.6, label: 'recovered' },
  { time: '14:03:55', metal: 'E-Waste PCB', kg: 7.8, tag: 'thermal', route: 'THERMAL', kwh: 23.6, label: 'recovered' },
];

const TAG_STYLE = {
  sell:    'feed-tag-sell',
  hold:    'feed-tag-hold',
  pyro:    'feed-tag-pyro',
  thermal: 'feed-tag-thermal',
};

export default function SystemFeed() {
  return (
    <div className="card card-pad" style={{ height: '100%' }}>
      <div className="section-title">
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)',
                       display: 'inline-block', animation: 'pulse 2s infinite', flexShrink: 0 }} />
        System Feed
      </div>
      <div style={{ overflowY: 'auto', maxHeight: 340 }}>
        {FEED_ITEMS.map((item, i) => (
          <div key={i} className="feed-item">
            <span className="feed-time">[{item.time}]</span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--text-primary)' }}>{item.metal}</strong>{' '}
              <span style={{ color: 'var(--text-muted)' }}>{item.kg}kg</span>
              {' → '}
              <span className={TAG_STYLE[item.tag]}>{item.route}</span>
              {item.kwh && <> — <span style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-teal)' }}>{item.kwh} kWh</span> {item.label}</>}
              {item.price && <> — <span style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-amber)' }}>{item.price}</span></>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
