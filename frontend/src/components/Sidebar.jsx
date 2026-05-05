import { useState } from 'react'
import { Avatar, Layout, Menu, Space, Typography } from 'antd'
import {
  BarChartOutlined,
  DashboardOutlined,
  GlobalOutlined,
  LineChartOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Sider } = Layout
const { Text, Title } = Typography

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: 'report', icon: <ProfileOutlined />, label: 'Report Waste' },
  { key: 'predictions', icon: <LineChartOutlined />, label: 'Predictions' },
  { key: 'insights', icon: <BarChartOutlined />, label: 'Data Insights' },
  { key: 'hubs', icon: <GlobalOutlined />, label: 'Network Hubs' },
  { key: 'settings', icon: <SettingOutlined />, label: 'System Settings' },
]

function Sidebar() {
  const [selectedKey, setSelectedKey] = useState('dashboard')

  return (
    <Sider
      width={240}
      theme="dark"
      style={{
        background: '#0a2a1f',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <Space direction="vertical" size={4} style={{ marginBottom: 24 }}>
          <Space align="center" size={10}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '999px',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
                color: '#ffffff',
                boxShadow: '0 10px 18px rgba(46, 125, 50, 0.3)',
              }}
            >
              <DashboardOutlined />
            </div>
            <Title level={4} style={{ margin: 0, color: '#f2fff8' }}>
              EcoTrack SL
            </Title>
          </Space>
          <Text style={{ color: '#9cc9b2', letterSpacing: '0.12em', fontSize: 12, fontWeight: 700 }}>
            E-WASTE GOV
          </Text>
        </Space>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          items={menuItems}
          style={{
            background: 'transparent',
            borderInlineEnd: 'none',
            flex: '1 1 auto',
            minHeight: 0,
          }}
        />

        <div
          style={{
            marginTop: 20,
            paddingTop: 18,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Space align="center" size={12}>
            <Avatar
              icon={<UserOutlined />}
              style={{
                background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
                color: '#ffffff',
              }}
            />
            <Space direction="vertical" size={0}>
              <Text style={{ color: '#f2fff8', fontWeight: 800 }}>A. Siriwardana</Text>
              <Text
                style={{
                  color: '#9cc9b2',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Senior Analyst
              </Text>
            </Space>
          </Space>
        </div>
      </div>
    </Sider>
  )
}

export default Sidebar
