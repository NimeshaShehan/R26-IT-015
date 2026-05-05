import { useState } from 'react'

function PredictForm({ onPredictionResult }) {
  const [prediction, setPrediction] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const cardStyles = {
    background: '#ffffff',
    border: '1px solid #dbe4ee',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.08)',
  }

  const sectionTitleStyles = {
    margin: '0 0 6px',
    color: '#0f172a',
    fontSize: '1.3rem',
  }

  const sectionTextStyles = {
    margin: '0 0 18px',
    color: '#64748b',
  }

  const buttonStyles = {
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    font: 'inherit',
    fontWeight: 700,
    cursor: 'pointer',
    color: '#0f172a',
    background: '#e2e8f0',
  }

  const resultStyles = {
    marginTop: '16px',
    padding: '14px',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    color: '#0f172a',
  }

  const labelStyles = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.85rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#64748b',
  }

  const handlePrediction = async () => {
    setIsRunning(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gdp: [4000, 4200, 4100],
          imports: [4.5, 4.8, 4.6],
        }),
      })

      const responseText = await response.text()
      const data = responseText ? JSON.parse(responseText) : {}
      if (!response.ok) {
        throw new Error(data.message ?? 'Prediction request failed.')
      }
      const result =
        data.prediction ?? data.result ?? data.value ?? data.message ?? 'No prediction returned.'

      const nextPrediction = String(result)
      setPrediction(nextPrediction)
      if (onPredictionResult) {
        onPredictionResult(nextPrediction)
      }
    } catch (error) {
      setPrediction('Prediction failed.')
      if (onPredictionResult) {
        onPredictionResult('Prediction failed.')
      }
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div style={cardStyles}>
      <div style={sectionTextStyles}>
        <h2 style={sectionTitleStyles}>Prediction</h2>
        <p style={{ margin: 0 }}>Send static GDP and imports values to the prediction service.</p>
      </div>

      <button style={buttonStyles} type="button" onClick={handlePrediction} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Prediction'}
      </button>

      <div style={resultStyles} aria-live="polite">
        <span style={labelStyles}>Prediction Result</span>
        <strong>{prediction || 'No prediction yet.'}</strong>
      </div>
    </div>
  )
}

export default PredictForm
