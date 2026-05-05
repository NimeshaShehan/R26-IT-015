import { useEffect, useState } from 'react'
import { Card, Space, Tag, Typography } from 'antd'
import { CheckCircleFilled, ClockCircleOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

function formatDateTime(date) {
  const dateLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)

  const timeLabel = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)

  return { dateLabel, timeLabel }
}

function Header() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const { dateLabel, timeLabel } = formatDateTime(now)

  return (
    <Card
      bodyStyle={{ padding: 20 }}
      style={{
        borderRadius: 16,
        boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
        border: '1px solid rgba(148, 163, 184, 0.18)',
      }}
    >
      <Space
        align="center"
        style={{
          width: '100%',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <Space align="center" size={14}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '999px',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
              color: '#ffffff',
              boxShadow: '0 10px 18px rgba(46, 125, 50, 0.22)',
            }}
          >
            <CheckCircleFilled />
          </div>

          <div>
            <Title level={3} style={{ margin: 0, color: '#0f172a' }}>
              EcoTrack SL
            </Title>
            <Text
              style={{
                display: 'block',
                color: '#64748b',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              E-WASTE GOV {"\u00b7"} National Monitoring Unit
            </Text>
          </div>
        </Space>

        <Space direction="vertical" align="end" size={4}>
          <Tag color="green" style={{ margin: 0, padding: '6px 10px', borderRadius: 999 }}>
            CEA Official Terminal v2.4.1
          </Tag>
          <Text style={{ color: '#475569', fontWeight: 600 }}>
            <ClockCircleOutlined style={{ marginRight: 6 }} />
            {dateLabel} {"\u00b7"} {timeLabel}
          </Text>
        </Space>
      </Space>
    </Card>
  )
}

export default Header
