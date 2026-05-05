import { useState } from 'react'
import { Card, ConfigProvider, Layout, Typography } from 'antd'
import Dashboard from './components/Dashboard.jsx'
import Header from './components/Header.jsx'
import ReportWaste from './components/ReportWaste.jsx'
import Sidebar from './components/Sidebar.jsx'

const { Content, Footer } = Layout

function App() {
  const [selectedKey, setSelectedKey] = useState('report')

  const renderPage = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />
      case 'report':
        return <ReportWaste />
      default:
        return (
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Typography.Title level={3} style={{ marginTop: 0 }}>
              Coming Soon
            </Typography.Title>
            <Typography.Text type="secondary">
              This section is connected to the sidebar but has not been built yet.
            </Typography.Text>
          </Card>
        )
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2e7d32',
          borderRadius: 12,
          colorBgLayout: '#f5f7fa',
          colorText: '#0f172a',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <Sidebar selectedKey={selectedKey} onSelect={setSelectedKey} />

        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
          <Content style={{ padding: 24, overflow: 'auto' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              {selectedKey === 'dashboard' ? <Header /> : null}
              <div
                style={{
                  marginTop: selectedKey === 'dashboard' ? 18 : 0,
                }}
              >
                {renderPage()}
              </div>
            </div>
          </Content>

          <Footer style={{ textAlign: 'center', background: 'transparent', color: '#94a3b8' }}>
            EcoTrack SL National Monitoring Unit
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App
