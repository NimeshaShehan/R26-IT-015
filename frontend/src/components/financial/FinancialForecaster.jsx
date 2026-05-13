import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import { getMetals, predictForecast } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { useManifest } from '../../context/ManifestContext';
import ForecastChart from './ForecastChart';
import MarketOverviewCard from './MarketOverviewCard';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function FinancialForecaster() {
  const [metals, setMetals]       = useState([]);
  const location = useLocation();
  const { t } = useLanguage();
  const [selectedMetal, setMetal] = useState(location.state?.selectedMetal || '');
  const [weight, setWeight]       = useState('');

  const weightRef = useRef(null);

  useEffect(() => {
    if (location.state?.selectedMetal) {
      setMetal(location.state.selectedMetal);
      setTimeout(() => weightRef.current?.focus(), 150);
    }
  }, [location.state?.selectedMetal]);
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [metaError, setMetaError] = useState(false);
  const { format } = useCurrency();
  const { setForecastData } = useManifest();

  useEffect(() => {
    getMetals()
      .then(r => { 
        setMetals(r.data.metals); 
        if (!location.state?.selectedMetal) {
          setMetal(r.data.metals[0]?.value || ''); 
        }
      })
      .catch(() => setMetaError(true));
  }, [location.state?.selectedMetal]);

  const handleSubmit = async () => {
    if (!selectedMetal || !weight || parseFloat(weight) <= 0) {
      toast.error(t('financial.toastSelect'));
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await predictForecast(selectedMetal, parseFloat(weight));
      setResult(res.data);
      setForecastData(res.data); // Save to manifest context
      toast.success(t('financial.toastSuccess'));
    } catch {
      toast.error(t('financial.toastError'));
    } finally {
      setLoading(false);
    }
  };

  const selectedObj = metals.find(m => m.value === selectedMetal);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>{t('financial.title')}</h1>
        <p style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-secondary)', margin: 0, marginTop: 4 }}>{t('financial.subtitle')}</p>
      </div>

      {/* Input Panel — ALL FIELDS IN ONE ROW */}
      <div className="card card-pad fade-in">
        <div className="section-title">
          <TrendingUp size={16} className="icon" />
          {t('financial.inputTitle')}
        </div>

        {metaError && (
          <div className="error-banner" style={{ marginBottom: 12 }}>
            <AlertTriangle size={15} /> {t('financial.errorLoad')}
          </div>
        )}

        {/* SINGLE ROW — all inputs + button */}
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 12, alignItems: 'flex-end' }}>

          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <label className="form-label">{t('financial.metalTypeLabel')}</label>
            <div style={{ position: 'relative' }}>
              <select className="form-select" value={selectedMetal} onChange={e => setMetal(e.target.value)}>
                {metals.map(m => (
                  <option key={m.value} value={m.value}>{m.label} ({m.symbol})</option>
                ))}
              </select>
              <span style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none', color: 'var(--text-muted)', fontSize: 9,
              }}>▼</span>
            </div>
          </div>

          <div style={{ flex: '1 1 140px', minWidth: 0 }}>
            <label className="form-label">{t('financial.weightLabel')}</label>
            <input
              ref={weightRef}
              type="number" min="0.01" step="0.01"
              className="form-input"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 150"
            />
          </div>

          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <label className="form-label">{t('financial.modelLabel')}</label>
            <input className="form-input" value="ARIMA + LSTM Ensemble" readOnly
                   style={{ color: 'var(--text-muted)', cursor: 'default' }} />
          </div>

          <div style={{ flexShrink: 0 }}>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}
                    style={{ height: 40, whiteSpace: 'nowrap', paddingLeft: 20, paddingRight: 20 }}>
              {loading ? <LoadingSpinner size={14} /> : <Zap size={14} />}
              {loading ? t('financial.forecasting') : t('financial.generateBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <MarketOverviewCard result={result} metalObj={selectedObj} />
          <div className="card card-pad fade-in">
            <div className="section-title">
              <TrendingUp size={16} className="icon" />
              {t('financial.forecastTitle')} {selectedObj?.label}
              <span style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>
                <span>{t('financial.model')} <strong style={{ color: 'var(--text-primary)' }}>{result.model_used}</strong></span>
                <span>MAPE: <strong style={{ color: result.mape < 15 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{result.mape}%</strong></span>
                <span>RMSE: <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{format(result.rmse, 4)}</strong></span>
              </span>
            </div>
            <ForecastChart data={result.forecast_90d} currentPrice={result.current_price} />
          </div>
        </>
      )}
    </div>
  );
}
