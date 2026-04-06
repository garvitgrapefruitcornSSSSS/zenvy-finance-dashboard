import { useApp } from '../context/AppContext';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'transactions', label: 'Transactions', icon: '⇄' },
  { id: 'insights', label: 'Insights', icon: '💡' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarCollapsed, setSidebarCollapsed, role, setRole } = useApp();

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">Z</div>
        {!sidebarCollapsed && <span className="logo-text">Zenvy</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
            title={sidebarCollapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {!sidebarCollapsed && (
          <div className="role-switcher">
            <div className="role-label">Role</div>
            <button
              className={`role-btn ${role === 'viewer' ? 'active' : ''}`}
              onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
            >
              {role === 'admin' ? '🛡 Admin' : '👁 Viewer'}
            </button>
          </div>
        )}
        <button className="collapse-btn" onClick={() => setSidebarCollapsed(c => !c)}>
          {sidebarCollapsed ? '›' : '‹'}
        </button>
      </div>
    </aside>
  );
}
