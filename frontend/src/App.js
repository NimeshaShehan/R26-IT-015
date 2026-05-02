import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('contamination');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const url = activeTab === 'contamination'
        ? 'http://127.0.0.1:8001/api/contamination/analyze'
        : 'http://127.0.0.1:8002/api/hazard/analyze';

      const response = await fetch(url, { method: 'POST', body: formData });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'API connection failed!' });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ background: '#1e293b', padding: '20px', textAlign: 'center', borderBottom: '1px solid #334155' }}>
        <h1 style={{ margin: 0, color: '#38bdf8', fontSize: '24px' }}>
          ♻️ AI Waste Segregation System
        </h1>
        <p style={{ margin: '5px 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Powered by ResNet50 + YOLOv8
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px' }}>
        <button
          onClick={() => { setActiveTab('contamination'); setResult(null); }}
          style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'contamination' ? '#38bdf8' : '#1e293b',
            color: activeTab === 'contamination' ? '#0f172a' : '#94a3b8',
            fontWeight: 'bold', fontSize: '14px'
          }}>
          🔬 Contamination Detection
        </button>
        <button
          onClick={() => { setActiveTab('hazard'); setResult(null); }}
          style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'hazard' ? '#f97316' : '#1e293b',
            color: activeTab === 'hazard' ? '#0f172a' : '#94a3b8',
            fontWeight: 'bold', fontSize: '14px'
          }}>
          ⚠️ Hazard Detection
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 40px' }}>

        {/* Upload Area */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 16px', color: '#e2e8f0' }}>Upload Waste Image</h3>
          <input type="file" accept="image/*" onChange={handleImageChange}
            style={{ display: 'block', marginBottom: '16px', color: '#94a3b8' }} />

          {preview && (
            <img src={preview} alt="preview"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', marginBottom: '16px' }} />
          )}

          <button onClick={handleAnalyze} disabled={!image || loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
              background: loading ? '#334155' : (activeTab === 'contamination' ? '#38bdf8' : '#f97316'),
              color: '#0f172a', fontWeight: 'bold', fontSize: '16px', cursor: image ? 'pointer' : 'not-allowed'
            }}>
            {loading ? '🔄 Analyzing...' : '🔍 Analyze'}
          </button>
        </div>

        {/* Results */}
        {result && !result.error && activeTab === 'contamination' && (
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#e2e8f0' }}>📊 Contamination Result</h3>
            <div style={{
              background: result.color === 'green' ? '#052e16' : result.color === 'orange' ? '#431407' : '#450a0a',
              borderRadius: '8px', padding: '16px', marginBottom: '16px',
              border: `1px solid ${result.color === 'green' ? '#16a34a' : result.color === 'orange' ? '#ea580c' : '#dc2626'}`
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: result.color === 'green' ? '#4ade80' : result.color === 'orange' ? '#fb923c' : '#f87171' }}>
                Grade {result.grade}
              </div>
              <div style={{ fontSize: '18px', margin: '8px 0', color: '#e2e8f0' }}>{result.label}</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Confidence: {result.confidence}%</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '16px' }}>
              <strong style={{ color: '#38bdf8' }}>Recommended Action:</strong>
              <p style={{ margin: '8px 0 0', color: '#e2e8f0' }}>{result.action}</p>
            </div>
          </div>
        )}

        {result && !result.error && activeTab === 'hazard' && (
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#e2e8f0' }}>⚠️ Hazard Assessment Report</h3>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f97316' }}>
                {result.hazard_icon} {result.device}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>Confidence: {result.confidence}%</div>
              <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#fbbf24' }}>
                Hazard Level: {result.overall_hazard_level}
              </div>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
              <strong style={{ color: '#38bdf8' }}>🔬 Materials:</strong>
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.materials?.map((m, i) => (
                  <span key={i} style={{ background: '#1e293b', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', color: '#e2e8f0' }}>{m}</span>
                ))}
              </div>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
              <strong style={{ color: '#38bdf8' }}>🦺 PPE Required:</strong>
              {result.ppe_required?.map((p, i) => (
                <div key={i} style={{ marginTop: '6px', color: '#e2e8f0', fontSize: '14px' }}>✅ {p}</div>
              ))}
            </div>

            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '16px' }}>
              <strong style={{ color: '#38bdf8' }}>📋 Handling Instructions:</strong>
              {result.handling_instructions?.map((h, i) => (
                <div key={i} style={{ marginTop: '6px', color: '#e2e8f0', fontSize: '14px' }}>{i + 1}. {h}</div>
              ))}
            </div>

            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '16px', marginTop: '12px' }}>
              <strong style={{ color: '#38bdf8' }}>♻️ Recovery Value:</strong>
              <p style={{ margin: '8px 0 0', color: '#4ade80' }}>{result.recovery_value}</p>
            </div>
          </div>
        )}

        {result?.error && (
          <div style={{ background: '#450a0a', borderRadius: '12px', padding: '24px', color: '#f87171' }}>
            ❌ {result.error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;