import { Zap, Droplets, Wind, Package, Leaf, ArrowRight } from 'lucide-react';

export default function EnergyResultCard({ result }) {
  const eb = result.energy_breakdown;
  const metrics = [
    { icon: Zap,      label: 'Total Erec',     value: `${eb.total_kwh.toLocaleString()} kWh`, color: 'var(--accent-teal)',  highlight: true },
    { icon: Droplets, label: 'Bio-Oil',         value: `${eb.bio_oil_liters.toFixed(1)} L`,   color: 'var(--accent-blue)' },
    { icon: Wind,     label: 'Syngas Energy',   value: `${eb.syngas_kwh.toFixed(1)} kWh`,     color: '#A78BFA' },
    { icon: Package,  label: 'Char Residue',    value: `${eb.char_kg.toFixed(1)} kg`,         color: 'var(--accent-amber)' },
    { icon: Leaf,     label: 'CO2 Avoided',     value: `${result.co2_avoided_kg.toFixed(1)} kg`, color: 'var(--accent-green)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Disposition Route Banner */}
      <div className="card card-pad fade-in" style={{
        background: 'linear-gradient(135deg, rgba(0,201,167,0.08) 0%, var(--bg-surface) 100%)',
        borderColor: 'var(--border-accent)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="kpi-label" style={{ color: 'var(--accent-teal)' }}>Disposition Route</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              {result.waste_type}
              <ArrowRight size={16} style={{ color: 'var(--accent-teal)' }} />
              {result.disposition_route}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
              LHV: {result.lhv_mj_kg} MJ/kg &nbsp;&middot;&nbsp; η: {(result.process_efficiency * 100).toFixed(0)}% process efficiency &nbsp;&middot;&nbsp;
              <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>✓ 100% Landfill Diversion</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="kpi-label">Erec Formula</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent-teal)', marginTop: 4 }}>
              Erec = Σ(Mi × LHVi × η)
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        {metrics.map(({ icon: Icon, label, value, color, highlight }) => (
          <div key={label} className="kpi-card fade-in"
               style={{ borderLeftColor: color, borderLeftWidth: 3, borderLeftStyle: 'solid',
                        background: highlight ? 'rgba(0,201,167,0.04)' : 'var(--bg-surface)' }}>
            <Icon size={14} style={{ color, marginBottom: 6 }} />
            <div className="kpi-label">{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 500, color: highlight ? color : 'var(--text-primary)', marginTop: 2 }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
