import { ConfigProvider, Layout } from 'antd'
import Dashboard from './components/Dashboard.jsx'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'

const { Content, Footer } = Layout

function App() {
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
        <Sidebar />

        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
          <Layout.Header
            style={{
              height: 'auto',
              lineHeight: 'normal',
              padding: '24px 24px 0',
              background: 'transparent',
            }}
          >
            <Header />
          </Layout.Header>

          <Content style={{ padding: '24px', overflow: 'initial' }}>
            <Dashboard />
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
