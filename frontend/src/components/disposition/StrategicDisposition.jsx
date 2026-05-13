import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Recycle, Zap, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import { getWasteTypes, calculateDisposition } from '../../services/api';
import { useManifest } from '../../context/ManifestContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import EnergyResultCard from './EnergyResultCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import Erec from '../shared/Erec';

export default function StrategicDisposition() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [wasteTypes, setWasteTypes] = useState([]);
  const [selectedWaste, setWaste]   = useState('');
  const [weight, setWeight]         = useState('');
  const [facility, setFacility]     = useState('Urban Recycling Facility');
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
  const [metaError, setMetaError]   = useState(false);
  const [recentManifests, setRecentManifests] = useState(() => {
    try {
      const saved = localStorage.getItem('recentManifests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const { setManifestData } = useManifest();

  useEffect(() => {
    getWasteTypes()
      .then(r => { setWasteTypes(r.data.waste_types); setWaste(r.data.waste_types[0]?.value || ''); })
      .catch(() => setMetaError(true));
  }, []);

  useEffect(() => {
    localStorage.setItem('recentManifests', JSON.stringify(recentManifests));
  }, [recentManifests]);

  const handleCalculate = async () => {
    if (!selectedWaste || !weight || parseFloat(weight) <= 0) {
      toast.error(t('disposition.toastSelect'));
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await calculateDisposition(selectedWaste, parseFloat(weight), facility);
      setResult(res.data);
      setManifestData(res.data); // Save for Tonnage Manifest page
      setRecentManifests(prev => {
        if (prev.some(m => m.manifest_id === res.data.manifest_id)) return prev;
        return [res.data, ...prev].slice(0, 5);
      });
      toast.success(t('disposition.toastSuccess'));
    } catch {
      toast.error(t('disposition.toastError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>{t('disposition.title')}</h1>
        <p style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-secondary)', margin: 0, marginTop: 4 }}>{t('disposition.subtitle')}</p>
      </div>

      {/* Input Panel — ALL IN ONE ROW */}
      <div className="card card-pad fade-in">
        <div className="section-title">
          <Recycle size={16} className="icon" />
          {t('disposition.inputTitle')}
        </div>

        {metaError && (
          <div className="error-banner" style={{ marginBottom: 12 }}>
            <AlertTriangle size={15} /> {t('disposition.errorLoad')}
          </div>
        )}

        {/* SINGLE ROW */}
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 12, alignItems: 'flex-end' }}>

          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <label className="form-label">{t('disposition.wasteTypeLabel')}</label>
            <div style={{ position: 'relative' }}>
              <select className="form-select" value={selectedWaste} onChange={e => setWaste(e.target.value)}>
                {wasteTypes.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
              </select>
              <span style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none', color: 'var(--text-muted)', fontSize: 9,
              }}>▼</span>
            </div>
          </div>

          <div style={{ flex: '1 1 130px', minWidth: 0 }}>
            <label className="form-label">{t('disposition.weightLabel')}</label>
            <input type="number" min="0.01" step="0.01" className="form-input"
                   value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 42" />
          </div>

          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <label className="form-label">{t('disposition.facilityLabel')}</label>
            <input type="text" className="form-input"
                   value={facility} onChange={e => setFacility(e.target.value)} placeholder="Facility name" />
          </div>

          <div style={{ flexShrink: 0 }}>
            <button className="btn btn-primary" onClick={handleCalculate} disabled={loading}
                    style={{ height: 40, whiteSpace: 'nowrap', paddingLeft: 20, paddingRight: 20 }}>
              {loading ? <LoadingSpinner size={14} /> : <Zap size={14} />}
              {loading ? t('disposition.calculating') : <><span style={{marginRight: 6}}>Calculate</span> <Erec /></>}
            </button>
          </div>
        </div>
      </div>

      {/* Energy Result */}
      {result && (
        <>
          <EnergyResultCard result={result} />

          {/* CTA to Tonnage Manifest page */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px',
            background: 'rgba(0,201,167,0.06)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-card)',
            gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={16} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {t('disposition.manifestReady')} {result.manifest_id}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Full logistical breakdown, <Erec /> metrics, compliance validation, and PDF/JSON export available in Tonnage Manifest.
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/manifest')}
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {t('disposition.viewManifest')} <ArrowRight size={13} style={{ marginLeft: 4 }} />
            </button>
          </div>
        </>
      )}

      {/* Recent Manifests */}
      <div className="card card-pad fade-in">
        <div className="section-title">
          <FileText size={16} className="icon" />
          {t('disposition.recentTitle')}
        </div>
        
        {recentManifests.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {t('disposition.noRecent')}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentManifests.map(m => (
              <div key={m.manifest_id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 8,
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{m.waste_type} ({m.weight_kg} kg)</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 10 }}>{m.manifest_id}</span>
                </div>
                <button
                  onClick={() => {
                    setManifestData(m);
                    navigate('/manifest');
                  }}
                  className="icon-btn"
                  title="View Manifest"
                >
                  <FileText size={14} style={{ color: 'var(--accent-teal)' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
