import { useEffect, useState } from 'react'
import { Card, Col, Row, Space, Typography } from 'antd'
import KPICards from './KPICards.jsx'
import ForecastChart from './ForecastChart.jsx'
import DistrictDistribution from './DistrictDistribution.jsx'
import ForecastAlerts from './ForecastAlerts.jsx'

function Dashboard() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <KPICards />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <ForecastChart />
        </Col>
        <Col xs={24} xl={8}>
          <DistrictDistribution />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <ForecastAlerts />
        </Col>
        <Col xs={24} xl={8}>
          <Card
            title="Model Intelligence"
            style={{
              borderRadius: 16,
              boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                  Architecture
                </Typography.Text>
                <Typography.Title level={5} style={{ margin: '4px 0 0' }}>
                  BiLSTM + Attention
                </Typography.Title>
              </div>

              <div>
                <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                  Nodes Active
                </Typography.Text>
                <Typography.Title level={5} style={{ margin: '4px 0 0' }}>
                  5 / 8
                </Typography.Title>
              </div>

              <div>
                <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                  Aggregation
                </Typography.Text>
                <Typography.Title level={5} style={{ margin: '4px 0 0' }}>
                  FedAvg Protocol
                </Typography.Title>
              </div>

              <div>
                <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                  Last Update
                </Typography.Text>
                <Typography.Title level={5} style={{ margin: '4px 0 0' }}>
                  2 hours ago
                </Typography.Title>
              </div>

              <Typography.Text type="secondary">Live clock: {now.toLocaleString()}</Typography.Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default Dashboard
