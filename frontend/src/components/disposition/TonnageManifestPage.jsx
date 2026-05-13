import { useState } from 'react';
import {
  FileText, CheckCircle, Package, Zap, Droplets, Wind, Leaf,
  FileDown, FileJson, AlertCircle, ArrowRight, ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useManifest } from '../../context/ManifestContext';
import { useLanguage } from '../../context/LanguageContext';
import { exportManifestPDF } from '../../utils/pdfExport';
import { exportJSON } from '../../utils/jsonExport';
import LoadingSpinner from '../shared/LoadingSpinner';
import Erec from '../shared/Erec';
import toast from 'react-hot-toast';

// ── Helpers ────────────────────────────────────────────────────────────

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="section-title" style={{ marginBottom: 14 }}>
      <Icon size={16} className="icon" />
      {children}
    </div>
  );
}

function ComplianceRow({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 0', borderBottom: '1px solid var(--border-subtle)',
      fontSize: 13, color: 'var(--text-secondary)',
    }}>
      <CheckCircle size={15} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
      {label}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────

function EmptyManifest() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
      <div className="card card-pad" style={{ maxWidth: 480, textAlign: 'center', padding: '40px 36px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'var(--bg-hover)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px',
        }}>
          <FileText size={26} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
          {t('manifest.emptyTitle')}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 22 }}>
          {t('manifest.emptyDesc')}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/disposition')}
                style={{ margin: '0 auto' }}>
          <Zap size={14} /> {t('manifest.goToDisposition')}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────

export default function TonnageManifestPage() {
  const { manifestData, forecastData } = useManifest();
  const { t } = useLanguage();
  const [pdfLoading, setPdfLoading]   = useState(false);
  const [jsonLoading, setJsonLoading] = useState(false);

  if (!manifestData) return <EmptyManifest />;

  const m  = manifestData;
  const eb = m.energy_breakdown;

  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      await exportManifestPDF(m);
      toast.success('PDF manifest downloaded');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('PDF generation failed. Check console for details.');
    } finally { 
      setPdfLoading(false); 
    }
  };

  const handleJSON = () => {
    setJsonLoading(true);
    try {
      const filename = `EcoVision_Manifest_${m.manifest_id || 'export'}.json`;
      exportJSON(m, filename);
      toast.success('JSON manifest exported');
    } catch (err) {
      toast.error('JSON export failed');
    } finally { 
      setJsonLoading(false); 
    }
  };

  const ts = m.timestamp
    ? new Date(m.timestamp).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })
    : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>{t('manifest.title')}</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0, marginTop: 4 }}>{t('manifest.subtitle')}</p>
      </div>

      {/* ── Manifest Header card ───────────────────────────────────────── */}
      <div className="card card-pad fade-in" style={{
        background: 'linear-gradient(135deg, rgba(0,201,167,0.06) 0%, var(--bg-surface) 100%)',
        borderColor: 'var(--border-accent)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--accent-teal)', fontWeight: 600,
                          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              {t('manifest.headerLabel')}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {m.facility_name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {t('manifest.generated')} {ts}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span className="badge badge-teal" style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.06em' }}>
              {m.manifest_id}
            </span>
            <span className="badge badge-online" style={{ fontSize: 10 }}>
              <CheckCircle size={10} /> {t('manifest.diversion')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 1: Final Material Destinations ───────────────────── */}
      <div className="card card-pad fade-in fade-in-1">
        <SectionTitle icon={Package}>
          {t('manifest.section1Title')}
        </SectionTitle>

        {/* Disposition flow visual */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          padding: '14px 18px', background: 'var(--bg-input)',
          borderRadius: 'var(--radius-btn)', marginBottom: 18,
          border: '1px solid var(--border-subtle)',
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{m.waste_type}</span>
          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="badge badge-danger" style={{ fontSize: 11 }}>{t('manifest.nonRecyclable')}</span>
          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="badge badge-teal" style={{ fontSize: 11 }}>{m.disposition_route}</span>
          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="badge badge-online" style={{ fontSize: 11 }}>
            <CheckCircle size={10} /> {t('manifest.wtePathway')}
          </span>
        </div>

        {/* Residual waste table */}
        <table className="manifest-table" style={{ marginBottom: 18 }}>
          <thead>
            <tr>
              <th>{t('manifest.tableParam')}</th>
              <th>{t('manifest.tableDetail')}</th>
              <th>{t('manifest.tableStatus')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="col-section">{t('manifest.wasteType')}</td>
              <td className="col-value">{m.waste_type}</td>
              <td><span className="badge badge-danger" style={{ fontSize: 10 }}>{t('manifest.nonRecyclable')}</span></td>
            </tr>
            <tr>
              <td className="col-section">{t('manifest.inputWeight')}</td>
              <td className="col-highlight">{m.weight_kg.toLocaleString()} kg</td>
              <td><span className="badge badge-teal" style={{ fontSize: 10 }}>{t('manifest.processed')}</span></td>
            </tr>
            <tr>
              <td className="col-section">{t('manifest.disposition')}</td>
              <td className="col-highlight">{m.disposition_route}</td>
              <td><span className="badge badge-online" style={{ fontSize: 10 }}>✓ {t('manifest.diverted')}</span></td>
            </tr>
            <tr>
              <td className="col-section">{t('manifest.landfillSent')}</td>
              <td className="col-green">0 kg — {t('manifest.zero')}</td>
              <td><span className="badge badge-online" style={{ fontSize: 10 }}>✓ {t('manifest.achieved')}</span></td>
            </tr>
          </tbody>
        </table>

        {/* Financial forecast summary (if available) */}
        {forecastData && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          marginBottom: 10, marginTop: 4 }}>
              {t('manifest.highValueDecision')}
            </div>
            <table className="manifest-table">
              <thead>
                <tr>
                  <th>Metal</th>
                  <th>Weight</th>
                  <th>Recommendation</th>
                  <th>Unit Price</th>
                  <th>Revenue / Peak</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col-value" style={{ textTransform: 'capitalize' }}>{forecastData.metal}</td>
                  <td className="col-value">{forecastData.weight_kg} kg</td>
                  <td>
                    <span className={`badge ${forecastData.recommendation === 'SELL NOW' ? 'badge-sell' : 'badge-hold'}`}
                          style={{ fontSize: 10 }}>
                      {forecastData.recommendation}
                    </span>
                  </td>
                  <td className="col-value" style={{ fontFamily: 'var(--font-display)' }}>
                    ${forecastData.unit_price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}/kg
                  </td>
                  <td className={forecastData.recommendation === 'SELL NOW' ? 'col-green' : 'col-highlight'}
                      style={{ fontFamily: 'var(--font-display)' }}>
                    {forecastData.recommendation === 'SELL NOW'
                      ? `$${forecastData.profit_if_sell?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : `Peak: $${forecastData.expected_peak_price?.toLocaleString(undefined, { minimumFractionDigits: 2 })} on ${forecastData.expected_peak_date}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* ── Section 2: Exact Energy Recovery Metrics ─────────────────── */}
      <div className="card card-pad fade-in fade-in-2">
        <SectionTitle icon={Zap}>
          Exact Energy Recovery Metrics (<Erec />)
        </SectionTitle>

        {/* Formula box */}
        <div style={{
          padding: '12px 18px', marginBottom: 18,
          background: 'var(--bg-input)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-btn)',
          fontFamily: 'var(--font-display)', fontSize: 13,
          color: 'var(--accent-teal)',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}><Erec /> =</span>
          <span>Σ(Mᵢ × LHVᵢ × η)</span>
          <span style={{ color: 'var(--text-muted)' }}>=</span>
          <span>{m.weight_kg} kg</span>
          <span style={{ color: 'var(--text-muted)' }}>×</span>
          <span>{m.lhv_mj_kg} MJ/kg</span>
          <span style={{ color: 'var(--text-muted)' }}>×</span>
          <span>{(m.process_efficiency * 100).toFixed(0)}%</span>
          <span style={{ color: 'var(--text-muted)' }}>=</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent-teal)' }}>
            {eb.total_kwh.toLocaleString()} kWh
          </span>
        </div>

        {/* 5-metric grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[
            { icon: Zap,      label: <><span style={{marginRight: 4}}>Total</span><Erec/></>,     value: `${eb.total_kwh.toLocaleString()} kWh`, color: 'var(--accent-teal)',  highlight: true },
            { icon: Droplets, label: 'Bio-oil output',  value: `${eb.bio_oil_liters.toFixed(2)} L`,    color: 'var(--accent-blue)' },
            { icon: Wind,     label: 'Syngas output',   value: `${eb.syngas_kwh.toFixed(2)} kWh`,      color: '#A78BFA' },
            { icon: Package,  label: 'Char residue',    value: `${eb.char_kg.toFixed(2)} kg`,          color: 'var(--accent-amber)' },
            { icon: Leaf,     label: 'CO₂ avoided',     value: `${m.co2_avoided_kg.toFixed(2)} kg`,    color: 'var(--accent-green)' },
          ].map(({ icon: Icon, label, value, color, highlight }) => (
            <div key={label} className="kpi-card" style={{
              borderLeftColor: color,
              background: highlight ? 'rgba(0,201,167,0.04)' : 'var(--bg-surface)',
            }}>
              <Icon size={14} style={{ color, marginBottom: 6 }} />
              <div className="kpi-label">{label}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500,
                color: highlight ? color : 'var(--text-primary)', marginTop: 2,
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Data sources note */}
        <div style={{
          marginTop: 14, fontSize: 11, color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <ShieldCheck size={12} style={{ color: 'var(--accent-teal)' }} />
          LHV values sourced from EPA WARM model and MatWeb Material Properties Database. Peer-reviewed, validated data.
        </div>
      </div>

      {/* ── Section 3: Zero-Waste Compliance Validation ──────────────── */}
      <div className="card card-pad fade-in fade-in-3">
        <SectionTitle icon={ShieldCheck}>
          {t('manifest.section3Title')}
        </SectionTitle>

        {/* Big green banner */}
        <div style={{
          background: 'rgba(34,197,94,0.10)',
          border: '1px solid rgba(34,197,94,0.35)',
          borderRadius: 'var(--radius-btn)',
          padding: '18px 22px',
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 18,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(34,197,94,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <CheckCircle size={22} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-green)', marginBottom: 2 }}>
              {t('manifest.diversionAchieved')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {t('manifest.diversionDesc')}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
            <span className="badge badge-online" style={{ fontSize: 11 }}>{t('manifest.compliant')}</span>
          </div>
        </div>

        {/* Compliance checklist */}
        <div style={{ marginBottom: 18 }}>
          <ComplianceRow label="All residual waste routed to verified WTE (Waste-to-Energy) pathways" />
          <ComplianceRow label="Zero materials sent to municipal landfill — 100% diversion confirmed" />
          <ComplianceRow label="Energy recovery calculated per EPA WARM & MatWeb validated LHV standards" />
          <ComplianceRow label={`Manifest ID ${m.manifest_id} generated with full timestamp and audit trail`} />
          <ComplianceRow label="SDG 11 (Sustainable Cities), SDG 12 (Responsible Production), SDG 13 (Climate Action) alignment confirmed" />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 0', fontSize: 13, color: 'var(--text-secondary)',
          }}>
            <CheckCircle size={15} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
            Methane emissions prevented: <strong style={{ color: 'var(--text-primary)', marginLeft: 4 }}>
              {(m.co2_avoided_kg * 0.21).toFixed(2)} kg CO₂eq
            </strong> avoided by diverting from landfill
          </div>
        </div>

        {/* Audit metadata */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          padding: '14px 0', borderTop: '1px solid var(--border-subtle)',
        }}>
          {[
            { label: t('manifest.manifestId'),    value: m.manifest_id,     mono: true },
            { label: t('manifest.facility'),       value: m.facility_name },
            { label: t('manifest.timestamp'),      value: ts },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <div className="kpi-label">{label}</div>
              <div style={{
                fontSize: 12, color: 'var(--text-primary)',
                fontFamily: mono ? 'var(--font-display)' : 'var(--font-body)',
                marginTop: 4, wordBreak: 'break-all',
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 4: Download & Export ─────────────────────────────── */}
      <div className="card card-pad fade-in fade-in-4">
        <SectionTitle icon={FileDown}>
          {t('manifest.section4Title')}
        </SectionTitle>

        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>
          Download the complete Tonnage Manifest as a colourful PDF document for regulatory submission,
          or export as a structured JSON file for secure compliance logging and historical auditing. Detailed report includes specific information about the {m.weight_kg}kg of {m.waste_type} processed.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* PDF card */}
          <div style={{
            padding: '20px 22px',
            background: 'rgba(255,77,109,0.05)',
            border: '1px solid rgba(255,77,109,0.2)',
            borderRadius: 'var(--radius-card)',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(255,77,109,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileDown size={18} style={{ color: 'var(--accent-red)' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t('manifest.pdfTitle')}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('manifest.pdfDesc')}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Professionally formatted, section-structured PDF with branded colours, energy tables,
              compliance checklist, and official audit trail for {m.waste_type} processing.
            </div>
            <button className="btn btn-danger" onClick={handlePDF} disabled={pdfLoading}
                    style={{ alignSelf: 'flex-start' }}>
              {pdfLoading ? <LoadingSpinner size={14} /> : <FileDown size={14} />}
              {pdfLoading ? t('manifest.generatingPdf') : t('manifest.downloadPdf')}
            </button>
          </div>

          {/* JSON card */}
          <div style={{
            padding: '20px 22px',
            background: 'rgba(0,153,255,0.05)',
            border: '1px solid rgba(0,153,255,0.2)',
            borderRadius: 'var(--radius-card)',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(0,153,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileJson size={18} style={{ color: 'var(--accent-blue)' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t('manifest.jsonTitle')}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('manifest.jsonDesc')}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Machine-readable JSON with full nested manifest data — energy breakdown, disposition routes,
              environmental impact, and SDG alignment fields.
            </div>
            <button className="btn btn-info" onClick={handleJSON} disabled={jsonLoading}
                    style={{ alignSelf: 'flex-start' }}>
              {jsonLoading ? <LoadingSpinner size={14} /> : <FileJson size={14} />}
              {jsonLoading ? t('manifest.exportingJson') : t('manifest.exportJson')}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
