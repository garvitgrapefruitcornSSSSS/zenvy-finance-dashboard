import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AIPanel from './components/AIPanel';
import TransactionModal from './components/TransactionModal';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import './App.css';

function Layout() {
  const { activePage, sidebarCollapsed, role, setAddModalOpen, setEditingTransaction } = useApp();

  const pages = {
    dashboard: <Dashboard />,
    transactions: <Transactions />,
    insights: <Insights />,
    settings: <Settings />,
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className={`main-area ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <main className="content-area">
          {pages[activePage] || <Dashboard />}
        </main>
      </div>

      {role === 'admin' && activePage !== 'settings' && (
        <button
          className="fab"
          onClick={() => { setEditingTransaction(null); setAddModalOpen(true); }}
          title="Add Transaction"
        >
          +
        </button>
      )}

      <TransactionModal />
      <AIPanel />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
