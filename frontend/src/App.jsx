import Dashboard from './components/Dashboard.jsx'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'

function App() {
  const appStyles = {
    minHeight: '100vh',
    display: 'flex',
    flexWrap: 'wrap',
    background: '#eaf1f5',
    color: '#0f172a',
  }

  const mainStyles = {
    flex: '1 1 0',
    minWidth: '0',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box',
  }

  return (
    <div style={appStyles}>
      <Sidebar />

      <main style={mainStyles}>
        <Header title="Command Dashboard" />
        <Dashboard />
      </main>
    </div>
  )
}

export default App
