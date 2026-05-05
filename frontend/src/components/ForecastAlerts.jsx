import { useEffect, useMemo, useState } from 'react'
import { Card, List, Space, Tag, Typography } from 'antd'

const predictionInput = {
  gdp: [4000, 4200, 4100],
  imports: [4.5, 4.8, 4.6],
}

function ForecastAlerts() {
  const [reports, setReports] = useState([])
  const [prediction, setPrediction] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [reportsResponse, predictionResponse] = await Promise.all([
          fetch('http://127.0.0.1:8001/reports'),
          fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(predictionInput),
          }),
        ])

        if (!reportsResponse.ok) {
          throw new Error('Failed to load reports.')
        }

        if (!predictionResponse.ok) {
          throw new Error('Failed to load prediction.')
        }

        const reportsText = await reportsResponse.text()
        const reportsData = reportsText ? JSON.parse(reportsText) : []

        const predictionText = await predictionResponse.text()
        const predictionData = predictionText ? JSON.parse(predictionText) : {}

        if (!isMounted) {
          return
        }

        setReports(Array.isArray(reportsData) ? reportsData : [])
        setPrediction(Number.parseFloat(predictionData.prediction ?? predictionData.value ?? 0) || 0)
      } catch {
        if (!isMounted) {
          return
        }

        setReports([])
        setPrediction(0)
        setError('Could not load alert data.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const alerts = useMemo(() => {
    const districtCounts = reports.reduce((accumulator, report) => {
      const district = report.district ?? 'Unknown'
      accumulator[district] = (accumulator[district] || 0) + 1
      return accumulator
    }, {})

    const rankedDistricts = Object.entries(districtCounts)
      .map(([district, count]) => ({ district, count }))
      .sort((left, right) => {
        if (right.count !== left.count) {
          return right.count - left.count
        }

        return left.district.localeCompare(right.district)
      })

    const highestDistrict = rankedDistricts[0]?.district ?? 'Colombo'
    const secondHighestDistrict = rankedDistricts[1]?.district ?? 'Gampaha'
    const reportCount = reports.length

    const nextAlerts = []

    if (prediction > 4000000) {
      nextAlerts.push({
        district: highestDistrict,
        message: 'High surge expected next fortnight',
        severity: 'CRITICAL',
        icon: '🏙️',
      })
    }

    if (reportCount > 5) {
      nextAlerts.push({
        district: secondHighestDistrict,
        message: 'E-waste increasing trend detected',
        severity: 'Warning',
        icon: '🌳',
      })
    }

    nextAlerts.push(
      {
        district: 'Kurunegala',
        message: 'Potential overload predicted',
        severity: 'Warning',
        icon: '🚜',
      },
      {
        district: 'Galle & Ratnapura',
        message: 'Collection inefficiency alerts active',
        severity: 'Warning',
        icon: '🌊',
      },
    )

    return nextAlerts
  }, [prediction, reports])

  return (
    <Card
      title="Regional Forecast Alerts"
      style={{
        borderRadius: 16,
        boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
      }}
      bodyStyle={{ padding: 20 }}
    >
      {loading ? (
        <Typography.Text type="secondary">Loading alert data...</Typography.Text>
      ) : error ? (
        <Typography.Text type="secondary">{error}</Typography.Text>
      ) : (
        <List
          dataSource={alerts}
          renderItem={(alert) => (
            <List.Item style={{ padding: 0, border: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: 12,
                  marginBottom: 10,
                  borderLeft: `5px solid ${alert.severity === 'CRITICAL' ? '#b91c1c' : '#f59e0b'}`,
                  borderRadius: 12,
                  background: '#f8fafc',
                  boxShadow: '0 8px 18px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 999,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    flex: '0 0 auto',
                  }}
                >
                  {alert.icon}
                </div>

                <Space direction="vertical" size={2} style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <Typography.Text strong style={{ color: '#0f172a' }}>
                    {alert.district}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#475569' }}>{alert.message}</Typography.Text>
                </Space>

                <Tag color={alert.severity === 'CRITICAL' ? 'red' : 'orange'} style={{ margin: 0 }}>
                  {alert.severity}
                </Tag>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}

export default ForecastAlerts
