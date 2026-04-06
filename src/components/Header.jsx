import { useApp } from '../context/AppContext';
import './Header.css';

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function Header() {
  const { role, setRole, toggleTheme, theme, setAiOpen, setActivePage } = useApp();

  return (
    <header className="header">
      <div className="header-left">
        <div className="greeting-block">
          <h2 className="greeting">{greet()} 👋</h2>
          <p className="greeting-sub">Here's your financial overview</p>
        </div>
      </div>

      <div className="header-right">
        {role === 'viewer' && (
          <div className="read-only-badge">
            <span className="badge-dot" />
            Read Only
          </div>
        )}

        <div className="role-dropdown">
          <button className="role-select" onClick={() => setRole(r => r === 'admin' ? 'viewer' : 'admin')}>
            {role === 'admin' ? '🛡' : '👁'} {role.charAt(0).toUpperCase() + role.slice(1)}
            <span className="chevron">▾</span>
          </button>
        </div>

        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀' : '🌙'}
        </button>

        <button className="ask-ai-btn" onClick={() => setAiOpen(true)}>
          <span>✦</span> Ask AI
        </button>
      </div>
    </header>
  );
}
