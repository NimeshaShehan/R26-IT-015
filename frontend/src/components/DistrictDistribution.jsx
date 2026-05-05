import { Card, Space, Tag, Typography } from 'antd'

const districts = [
  { name: 'Colombo', value: 24800 },
  { name: 'Gampaha', value: 14300 },
  { name: 'Kalutara', value: 8200 },
  { name: 'Kandy', value: 11400 },
  { name: 'Kurunegala', value: 6900 },
  { name: 'Galle', value: 5300 },
  { name: 'Ratnapura', value: 4700 },
  { name: 'Matara', value: 3800 },
]

function DistrictDistribution() {
  const maxValue = Math.max(...districts.map((district) => district.value))

  return (
    <Card
      title={
        <Space size={8}>
          <span role="img" aria-label="location">
            📍
          </span>
          <span>District Distribution</span>
        </Space>
      }
      extra={<Tag color="blue">Active waste volume by municipality</Tag>}
      style={{
        borderRadius: 16,
        boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ maxHeight: 280, overflowY: 'auto', paddingRight: 6 }}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {districts.map((district) => {
            const width = (district.value / maxValue) * 100
            const opacity = 0.45 + (width / 100) * 0.55

            return (
              <div
                key={district.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(110px, 1fr) minmax(140px, 2fr) auto',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Space size={8}>
                  <span role="img" aria-label="location">
                    📍
                  </span>
                  <Typography.Text strong style={{ color: '#0f172a' }}>
                    {district.name}
                  </Typography.Text>
                </Space>

                <div
                  style={{
                    height: 8,
                    borderRadius: 8,
                    background: '#eee',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${width}%`,
                      height: '100%',
                      borderRadius: 8,
                      background: `rgba(46, 125, 50, ${opacity.toFixed(2)})`,
                    }}
                  />
                </div>

                <Typography.Text style={{ color: '#475569', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {district.value.toLocaleString()} MT
                </Typography.Text>
              </div>
            )
          })}
        </Space>
      </div>

      <Typography.Text style={{ display: 'block', marginTop: 14, color: '#94a3b8', fontSize: 12 }}>
        Western province contributes 47% of total e-waste
      </Typography.Text>
    </Card>
  )
}

export default DistrictDistribution
