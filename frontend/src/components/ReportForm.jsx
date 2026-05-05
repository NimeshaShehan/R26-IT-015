import { useState } from 'react'

const districts = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala']

function ReportForm() {
  const [district, setDistrict] = useState('Colombo')
  const [itemType, setItemType] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reports, setReports] = useState([])
  const [isLoadingReports, setIsLoadingReports] = useState(false)

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

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  }

  const fieldStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: '#0f172a',
    fontWeight: 600,
  }

  const inputStyles = {
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '12px 14px',
    font: 'inherit',
    background: '#ffffff',
    color: '#0f172a',
  }

  const buttonRowStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '4px',
  }

  const buttonStyles = {
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    font: 'inherit',
    fontWeight: 700,
    cursor: 'pointer',
  }

  const primaryButtonStyles = {
    ...buttonStyles,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #0f766e, #0ea5e9)',
    flex: '1 1 160px',
  }

  const secondaryButtonStyles = {
    ...buttonStyles,
    color: '#0f172a',
    background: '#e2e8f0',
    flex: '1 1 160px',
  }

  const reportListStyles = {
    marginTop: '18px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  }

  const listStyles = {
    margin: 0,
    paddingLeft: '18px',
    color: '#334155',
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('http://127.0.0.1:8001/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          district,
          item_type: itemType,
          quantity: Number(quantity),
        }),
      })

      const responseText = await response.text()
      const data = responseText ? JSON.parse(responseText) : {}
      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to submit report.')
      }
      const message = data.message ?? 'Report submitted successfully.'
      alert(message)
    } catch {
      alert('Failed to submit report.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadReports = async () => {
    setIsLoadingReports(true)

    try {
      const response = await fetch('http://127.0.0.1:8001/reports')
      const responseText = await response.text()
      const data = responseText ? JSON.parse(responseText) : []

      if (!response.ok) {
        throw new Error('Failed to load reports.')
      }

      setReports(Array.isArray(data) ? data : [])
    } catch {
      alert('Failed to load reports.')
    } finally {
      setIsLoadingReports(false)
    }
  }

  return (
    <div style={cardStyles}>
      <div style={sectionTextStyles}>
        <h2 style={sectionTitleStyles}>Report E-Waste</h2>
        <p style={{ margin: 0 }}>Send a waste report to the report service.</p>
      </div>

      <form onSubmit={handleSubmit} style={formStyles}>
        <label style={fieldStyles}>
          <span>District</span>
          <select style={inputStyles} value={district} onChange={(event) => setDistrict(event.target.value)}>
            {districts.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label style={fieldStyles}>
          <span>Item Type</span>
          <input
            style={inputStyles}
            type="text"
            value={itemType}
            onChange={(event) => setItemType(event.target.value)}
            placeholder="e.g. phone, laptop, battery"
            required
          />
        </label>

        <label style={fieldStyles}>
          <span>Quantity</span>
          <input
            style={inputStyles}
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </label>

        <div style={buttonRowStyles}>
          <button style={primaryButtonStyles} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>

          <button style={secondaryButtonStyles} type="button" onClick={loadReports} disabled={isLoadingReports}>
            {isLoadingReports ? 'Loading...' : 'Load Reports'}
          </button>
        </div>
      </form>

      <div style={reportListStyles}>
        <h3 style={{ margin: '0 0 12px', color: '#0f172a' }}>Saved Reports</h3>

        {reports.length === 0 ? (
          <p style={{ margin: 0, color: '#64748b' }}>No reports loaded yet.</p>
        ) : (
          <ul style={listStyles}>
            {reports.map((report, index) => (
              <li key={`${report.district ?? 'report'}-${index}`}>
                {report.district} - {report.item_type} ({report.quantity})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ReportForm
