import { useApp } from '../context/AppContext';
import './Settings.css';

export default function Settings() {
  const { theme, toggleTheme, role, setRole, resetData } = useApp();

  return (
    <div className="page settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Manage your preferences</p>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-title">Appearance</h2>
        <div className="settings-options">
          <button className={`settings-option ${theme === 'light' ? 'active' : ''}`} onClick={() => theme !== 'light' && toggleTheme()}>
            <span className="opt-icon">☀️</span>
            <div>
              <div className="opt-name">Light</div>
              <div className="opt-desc">Clean and bright</div>
            </div>
          </button>
          <button className={`settings-option ${theme === 'dark' ? 'active' : ''}`} onClick={() => theme !== 'dark' && toggleTheme()}>
            <span className="opt-icon">🌙</span>
            <div>
              <div className="opt-name">Dark</div>
              <div className="opt-desc">Easy on the eyes</div>
            </div>
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-title">Role</h2>
        <div className="settings-options">
          <button className={`settings-option ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>
            <span className="opt-icon">🛡</span>
            <div>
              <div className="opt-name">Admin</div>
              <div className="opt-desc">Full access</div>
            </div>
          </button>
          <button className={`settings-option ${role === 'viewer' ? 'active' : ''}`} onClick={() => setRole('viewer')}>
            <span className="opt-icon">👁</span>
            <div>
              <div className="opt-name">Viewer</div>
              <div className="opt-desc">Read-only access</div>
            </div>
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-title">Data</h2>
        <button className="reset-btn" onClick={() => { if (window.confirm('Reset to mock data?')) resetData(); }}>
          ↺ Reset to mock data
        </button>
      </div>
    </div>
  );
}
