import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import KPIcard from './KPIcard.jsx'

const predictionInput = {
  gdp: [4000, 4200, 4100],
  imports: [4.5, 4.8, 4.6],
}

const trendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const actualTrend = [92, 96, 101, 108, 114, 120]
const alertCards = [
  {
    priority: 'HIGH PRIORITY',
    title: 'Colombo Surge Expected',
    description: 'Predicted increase in e-waste next month',
    borderColor: '#dc2626',
  },
  {
    priority: 'MEDIUM PRIORITY',
    title: 'Gampaha Rise Predicted',
    description: 'Monitoring a steady growth trend in reports',
    borderColor: '#ca8a04',
  },
  {
    priority: 'LOW PRIORITY',
    title: 'Kandy Seasonal Increase',
    description: 'Mild seasonal uplift is expected soon',
    borderColor: '#2563eb',
  },
]

function Dashboard() {
  const [reports, setReports] = useState([])
  const [forecast, setForecast] = useState(null)
  const [reportError, setReportError] = useState('')
  const [forecastError, setForecastError] = useState('')
  const [loadingReports, setLoadingReports] = useState(true)
  const [loadingForecast, setLoadingForecast] = useState(true)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  useEffect(() => {
    const loadReports = async () => {
      setLoadingReports(true)
      setReportError('')

      try {
        const response = await fetch('http://127.0.0.1:8001/reports')
        const responseText = await response.text()
        const data = responseText ? JSON.parse(responseText) : []

        if (!response.ok) {
          throw new Error('Failed to load reports.')
        }

        setReports(Array.isArray(data) ? data : [])
      } catch {
        setReportError('Could not load report data.')
      } finally {
        setLoadingReports(false)
      }
    }

    loadReports()
  }, [])

  useEffect(() => {
    const loadForecast = async () => {
      setLoadingForecast(true)
      setForecastError('')

      try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(predictionInput),
        })

        const responseText = await response.text()
        const data = responseText ? JSON.parse(responseText) : {}

        if (!response.ok) {
          throw new Error('Failed to load forecast.')
        }

        const nextForecast = Number.parseFloat(data.prediction ?? data.value ?? 0) || 0
        setForecast(nextForecast)
      } catch {
        setForecastError('Could not load forecast data.')
      } finally {
        setLoadingForecast(false)
      }
    }

    loadForecast()
  }, [])

  const totals = useMemo(() => {
    return reports.reduce(
      (accumulator, report) => {
        const district = report.district ?? 'Unknown'
        const quantity = Number(report.quantity) || 0

        accumulator.totalWaste += quantity
        accumulator.count += 1
        accumulator.byDistrict[district] = (accumulator.byDistrict[district] || 0) + quantity

        return accumulator
      },
      {
        totalWaste: 0,
        count: 0,
        byDistrict: {},
      },
    )
  }, [reports])

  const districtChartData = useMemo(() => {
    return Object.entries(totals.byDistrict)
      .map(([district, totalQuantity]) => ({
        district,
        totalQuantity,
      }))
      .sort((left, right) => left.district.localeCompare(right.district))
  }, [totals.byDistrict])

  const lineChartData = useMemo(() => {
    const forecastEnd = forecast ?? 125
    const forecastStart = Math.max(forecastEnd - 18, 82)
    const forecastStep = (forecastEnd - forecastStart) / (trendLabels.length - 1)

    return trendLabels.map((month, index) => ({
      month,
      actual: actualTrend[index],
      prediction: Math.round(forecastStart + forecastStep * index),
    }))
  }, [forecast])

  const dashboardStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  }

  const sectionStyles = {
    background: '#ffffff',
    border: '1px solid #d9e3ec',
    borderRadius: '18px',
    padding: '22px',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
  }

  const sectionHeaderStyles = {
    marginBottom: '18px',
  }

  const sectionTitleStyles = {
    margin: '0 0 6px',
    color: '#0f172a',
    fontSize: '1.2rem',
  }

  const sectionTextStyles = {
    margin: 0,
    color: '#64748b',
  }

  const kpiGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '16px',
  }

  const chartsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '16px',
  }

  const bottomGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
  }

  const chartCardStyles = {
    minHeight: '360px',
    padding: '20px',
    borderRadius: '18px',
    border: '1px solid #d9e3ec',
    background: '#fbfdff',
    boxShadow: '0 10px 22px rgba(15, 23, 42, 0.05)',
  }

  const chartTitleStyles = {
    margin: '0 0 14px',
    color: '#0f172a',
    fontSize: '1.05rem',
  }

  const messageStyles = {
    margin: 0,
    color: '#64748b',
  }

  const alertsCardStyles = {
    ...chartCardStyles,
    minHeight: 'auto',
  }

  const alertListStyles = {
    display: 'grid',
    gap: '12px',
  }

  const alertItemBaseStyles = {
    padding: '14px 16px',
    borderRadius: '14px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderLeftWidth: '5px',
    borderLeftStyle: 'solid',
    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.05)',
  }

  const modelCardStyles = {
    ...chartCardStyles,
    minHeight: 'auto',
    background: 'linear-gradient(180deg, #0f172a 0%, #08111f 100%)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  }

  const modelLabelStyles = {
    margin: '0 0 8px',
    color: '#93c5fd',
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  }

  const modelValueStyles = {
    margin: 0,
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 700,
  }

  const modelMetaStyles = {
    display: 'grid',
    gap: '12px',
  }

  const forecastValue = loadingForecast
    ? 'Loading...'
    : forecast != null
      ? `${forecast.toFixed(2)} MT`
      : 'N/A'

  return (
    <div style={dashboardStyles}>
      <section style={sectionStyles}>
        <div style={sectionHeaderStyles}>
          <h2 style={sectionTitleStyles}>Key Metrics</h2>
          <p style={sectionTextStyles}>Live values from the report and prediction services.</p>
        </div>

        <div style={kpiGridStyles}>
          <KPIcard
            title="Total E-Waste"
            value={loadingReports ? 'Loading...' : totals.totalWaste.toLocaleString()}
            subtitle="Sum of all report quantities"
            tone="green"
          />
          <KPIcard
            title="Next Month Forecast"
            value={forecastValue}
            subtitle={forecastError || 'From the prediction service'}
            tone="blue"
          />
          <KPIcard
            title="Total Reports"
            value={loadingReports ? 'Loading...' : totals.count.toLocaleString()}
            subtitle={reportError || 'Count of saved reports'}
            tone="dark"
          />
          <KPIcard title="Alerts" value="3 Active" subtitle="Static monitoring status" tone="amber" />
        </div>

        {(reportError || forecastError) && (
          <p style={{ ...messageStyles, marginTop: '14px' }}>
            {reportError || forecastError}
          </p>
        )}
      </section>

      <section style={chartsGridStyles}>
        <div style={chartCardStyles}>
          <h3 style={chartTitleStyles}>National Forecast Trend</h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#0f766e" strokeWidth={3} dot />
                <Line type="monotone" dataKey="prediction" stroke="#1d4ed8" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={chartCardStyles}>
          <h3 style={chartTitleStyles}>District Distribution</h3>
          <div style={{ width: '100%', height: '280px' }}>
            {loadingReports ? (
              <p style={messageStyles}>Loading district data...</p>
            ) : districtChartData.length === 0 ? (
              <p style={messageStyles}>No district data available yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="district" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="totalQuantity" fill="#0f766e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <section style={bottomGridStyles}>
        <div style={alertsCardStyles}>
          <div style={sectionHeaderStyles}>
            <h2 style={sectionTitleStyles}>Regional Forecast Alerts</h2>
            <p style={sectionTextStyles}>Priority alerts based on recent forecast signals.</p>
          </div>

          <div style={alertListStyles}>
            {alertCards.map((alert) => (
              <article
                key={alert.title}
                style={{
                  ...alertItemBaseStyles,
                  borderLeftColor: alert.borderColor,
                }}
              >
                <p
                  style={{
                    margin: '0 0 6px',
                    color: alert.borderColor,
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {alert.priority}
                </p>
                <h3 style={{ margin: '0 0 6px', color: '#0f172a', fontSize: '1.02rem' }}>
                  {alert.title}
                </h3>
                <p style={{ margin: '0 0 8px', color: '#475569' }}>{alert.description}</p>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Just now</p>
              </article>
            ))}
          </div>
        </div>

        <div style={modelCardStyles}>
          <div style={sectionHeaderStyles}>
            <h2 style={{ ...sectionTitleStyles, color: '#ffffff' }}>Model Intelligence</h2>
            <p style={{ ...sectionTextStyles, color: '#cbd5e1' }}>Current training and deployment summary.</p>
          </div>

          <div style={modelMetaStyles}>
            <div>
              <p style={modelLabelStyles}>Architecture</p>
              <p style={modelValueStyles}>BiLSTM + Attention</p>
            </div>
            <div>
              <p style={modelLabelStyles}>Nodes</p>
              <p style={modelValueStyles}>5 / 8 Active</p>
            </div>
            <div>
              <p style={modelLabelStyles}>Aggregation</p>
              <p style={modelValueStyles}>FedAvg Protocol</p>
            </div>
            <div>
              <p style={modelLabelStyles}>Last Update</p>
              <p style={modelValueStyles}>{now.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
