import { useApp } from '../context/AppContext';
import { getMonthlyData, getCategoryBreakdown, CATEGORY_COLORS } from '../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

const SummaryCard = ({ title, value, icon, trend, trendUp, color }) => (
  <div className="summary-card" style={{ '--card-accent': color }}>
    <div className="card-header">
      <div className="card-icon" style={{ background: color + '20', color }}>{icon}</div>
      <div className={`card-trend ${trendUp ? 'up' : 'down'}`}>
        {trendUp ? '↑' : '↓'} {trend}
      </div>
    </div>
    <div className="card-value">{value}</div>
    <div className="card-title">{title}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="tooltip-row" style={{ color: p.color }}>
            <span>{p.name}:</span> <strong>{fmt(p.value)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { transactions, summary, setAddModalOpen, role } = useApp();
  const monthlyData = getMonthlyData(transactions);
  const categoryData = getCategoryBreakdown(transactions).slice(0, 7);

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Your financial summary at a glance</p>
        </div>
        {role === 'admin' && (
          <button className="add-txn-btn" onClick={() => setAddModalOpen(true)}>
            + Add Transaction
          </button>
        )}
      </div>

      <div className="summary-grid">
        <SummaryCard title="Total Balance" value={fmt(summary.balance)} icon="₹" trend="12%" trendUp={true} color="#6366f1" />
        <SummaryCard title="Total Income" value={fmt(summary.income)} icon="↑" trend="8%" trendUp={true} color="#22c55e" />
        <SummaryCard title="Total Expenses" value={fmt(summary.expenses)} icon="↓" trend="3%" trendUp={false} color="#ef4444" />
        <SummaryCard title="Savings Rate" value={`${summary.savingsRate}%`} icon="◎" trend="5%" trendUp={true} color="#8b5cf6" />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Balance Trend</h3>
            <span className="chart-sub">Income vs Expenses</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + (v/1000).toFixed(0) + 'k'} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Spending by Category</h3>
            <span className="chart-sub">This period</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} cx="45%" cy="50%" innerRadius={60} outerRadius={90}
                dataKey="value" paddingAngle={3} stroke="none">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <button className="see-all" onClick={() => {}}>See all →</button>
        </div>
        <div className="recent-list">
          {transactions.slice(0, 5).map(t => (
            <div key={t.id} className="recent-item">
              <div className="recent-icon" style={{ background: CATEGORY_COLORS[t.category] + '20', color: CATEGORY_COLORS[t.category] }}>
                {t.category[0]}
              </div>
              <div className="recent-info">
                <div className="recent-title">{t.title}</div>
                <div className="recent-cat">{t.category} • {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
              </div>
              <div className={`recent-amount ${t.type === 'income' ? 'pos' : 'neg'}`}>
                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
