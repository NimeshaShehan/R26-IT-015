/**
 * KPI card for the top row of the Operations Dashboard.
 * Props: label, value, sub, variant ('teal'|'green'|'amber'|'blue'), icon (Lucide component), progress (0-100 optional)
 */
export default function MetricKPICard({ label, value, sub, variant = 'teal', icon: Icon, progress }) {
  return (
    <div className={`kpi-card ${variant} fade-in`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="kpi-label">{label}</div>
        {Icon && <Icon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
      </div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {progress !== undefined && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
