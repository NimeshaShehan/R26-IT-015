import { useState } from 'react'
import { Button, Card, Space, Tag, Typography } from 'antd'
import {
  Area,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { month: 'Feb', actual: 5630, forecast: 5400 },
  { month: 'Apr', actual: 8920, forecast: 8380 },
  { month: 'Jun', actual: 7450, forecast: 7300 },
  { month: 'Aug', actual: 7880, forecast: 7700 },
  { month: 'Oct', actual: 7340, forecast: 7450 },
  { month: 'Dec', actual: 8120, forecast: 7950 },
]

function ForecastChart() {
  const [visibleSeries, setVisibleSeries] = useState({
    actual: true,
    forecast: true,
  })

  const tooltipContent = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
      return null
    }

    const actualPoint = payload.find((entry) => entry.dataKey === 'actual')
    const forecastPoint = payload.find((entry) => entry.dataKey === 'forecast')

    return (
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #dbe4ee',
          borderRadius: 12,
          padding: '10px 12px',
          boxShadow: '0 14px 28px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Typography.Text strong style={{ display: 'block', marginBottom: 6, color: '#0f172a' }}>
          {label}
        </Typography.Text>
        {actualPoint && <div style={{ color: '#475569', fontSize: 12 }}>Actual MT: {actualPoint.value}</div>}
        {forecastPoint && <div style={{ color: '#475569', fontSize: 12 }}>Forecast MT: {forecastPoint.value}</div>}
      </div>
    )
  }

  return (
    <Card
      title="National Forecast Trend"
      extra={<Tag color="blue">Actual vs BiLSTM AI Prediction</Tag>}
      style={{
        borderRadius: 16,
        boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 6 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#dbe4ee' }} />
            <YAxis
              domain={[4000, 10000]}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#dbe4ee' }}
              label={{
                value: 'Metric Tons (MT)',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
                style: { textAnchor: 'middle', fontSize: 12, fontWeight: 600 },
              }}
            />
            <Tooltip content={tooltipContent} />
            <Legend
              content={() => (
                <Space wrap size={8} style={{ marginTop: 10 }}>
                  <Button
                    size="small"
                    type={visibleSeries.actual ? 'primary' : 'default'}
                    onClick={() =>
                      setVisibleSeries((current) => ({
                        ...current,
                        actual: !current.actual,
                      }))
                    }
                  >
                    Actual MT
                  </Button>
                  <Button
                    size="small"
                    type={visibleSeries.forecast ? 'primary' : 'default'}
                    onClick={() =>
                      setVisibleSeries((current) => ({
                        ...current,
                        forecast: !current.forecast,
                      }))
                    }
                  >
                    AI Forecast
                  </Button>
                </Space>
              )}
            />
            <ReferenceLine x="Apr" stroke="#d32f2f" label={{ value: 'Avurudu Spike +18%', fill: '#d32f2f', fontSize: 12 }} />
            {visibleSeries.actual && (
              <>
                <Area type="monotone" dataKey="actual" stroke="none" fill="#2e7d32" fillOpacity={0.1} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#2e7d32"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ffffff', stroke: '#2e7d32', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </>
            )}
            {visibleSeries.forecast && (
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#ff9800"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#ffffff', stroke: '#ff9800', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default ForecastChart
