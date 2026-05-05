import { useEffect, useState } from 'react'
import { Badge, Card, Col, Row, Space, Tag, Typography } from 'antd'

const predictionInput = {
  gdp: [4000, 4200, 4100],
  imports: [4.5, 4.8, 4.6],
}

function KPIBlock({ title, value, subtitle, trend, trendColor = 'green', extra }) {
  return (
    <Card
      hoverable
      style={{
        height: '100%',
        borderRadius: 16,
        boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
      }}
      bodyStyle={{ padding: 20 }}
      extra={extra}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Typography.Text
          style={{
            color: '#64748b',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Typography.Text>

        <Typography.Title level={2} style={{ margin: 0, color: '#0f172a' }}>
          {value}
        </Typography.Title>

        <Typography.Text style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>
          {subtitle}
        </Typography.Text>

        {trend && (
          <Tag color={trendColor === 'green' ? 'green' : trendColor} style={{ width: 'fit-content', margin: 0 }}>
            {trend}
          </Tag>
        )}
      </Space>
    </Card>
  )
}

function KPICards() {
  const [totalWaste, setTotalWaste] = useState(0)
  const [reportCount, setReportCount] = useState(0)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const [reportsResponse, forecastResponse] = await Promise.all([
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

        if (!forecastResponse.ok) {
          throw new Error('Failed to load forecast.')
        }

        const reportsText = await reportsResponse.text()
        const reportsData = reportsText ? JSON.parse(reportsText) : []
        const reports = Array.isArray(reportsData) ? reportsData : []
        const total = reports.reduce((sum, report) => sum + (Number(report.quantity) || 0), 0)

        const forecastText = await forecastResponse.text()
        const forecastData = forecastText ? JSON.parse(forecastText) : {}
        const predictionValue = Number.parseFloat(forecastData.prediction ?? forecastData.value ?? 0) || 0

        if (!isMounted) {
          return
        }

        setTotalWaste(total)
        setReportCount(reports.length)
        setForecast(predictionValue)
      } catch {
        if (!isMounted) {
          return
        }

        setTotalWaste(0)
        setReportCount(0)
        setForecast(0)
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

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} xl={6}>
        <KPIBlock
          title="TOTAL E-WASTE (8 DISTRICTS)"
          value={loading ? 'Loading...' : `${totalWaste.toLocaleString()} MT`}
          subtitle="YTD Cumulative Log"
          trend="+12.4%"
          trendColor="green"
        />
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <KPIBlock
          title="NEXT MONTH FORECAST"
          value={loading ? 'Loading...' : `${(forecast ?? 0).toFixed(2)} MT`}
          subtitle="BiLSTM Prediction"
          trend="+5.2%"
          trendColor="green"
        />
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <KPIBlock
          title="ACTIVE CITIZEN REPORTS"
          value={loading ? 'Loading...' : reportCount.toLocaleString()}
          subtitle="Pending Collection"
          extra={
            <Badge
              count="New"
              style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                boxShadow: 'none',
              }}
            />
          }
        />
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <KPIBlock
          title="SURGE ALERTS"
          value="3 Active"
          subtitle="Resource Allocation"
          extra={<Tag color="orange" style={{ margin: 0 }}>Watching</Tag>}
        />
      </Col>
    </Row>
  )
}

export default KPICards
