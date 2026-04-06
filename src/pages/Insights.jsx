import { useApp } from '../context/AppContext';
import { getCategoryBreakdown, getMonthlyData, CATEGORY_COLORS } from '../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import './Insights.css';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function Insights() {
  const { transactions, summary } = useApp();
  const catData = getCategoryBreakdown(transactions);
  const monthlyData = getMonthlyData(transactions);
  const topCat = catData[0];
  const avgExpense = summary.expenses > 0
    ? Math.round(summary.expenses / transactions.filter(t => t.type === 'expense').length)
    : 0;

  const insightCards = [
    {
      icon: '🔥', label: 'Highest Spending', value: topCat?.name || 'N/A',
      sub: fmt(topCat?.value || 0) + ' spent', color: '#ef4444'
    },
    {
      icon: '💚', label: 'Savings Rate', value: `${summary.savingsRate}%`,
      sub: summary.savingsRate >= 20 ? 'Above recommended 20%' : 'Below target, save more!',
      color: summary.savingsRate >= 20 ? '#22c55e' : '#f59e0b'
    },
    {
      icon: '📊', label: 'Avg Transaction', value: fmt(avgExpense),
      sub: 'Per expense transaction', color: '#3b82f6'
    },
    {
      icon: '💰', label: 'Net Worth Trend', value: summary.balance >= 0 ? 'Positive' : 'Negative',
      sub: fmt(Math.abs(summary.balance)) + (summary.balance >= 0 ? ' surplus' : ' deficit'),
      color: summary.balance >= 0 ? '#22c55e' : '#ef4444'
    },
  ];

  return (
    <div className="page insights-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Insights</h1>
          <p className="page-sub">Smart analysis of your financial data</p>
        </div>
      </div>

      <div className="insights-grid">
        {insightCards.map((c, i) => (
          <div key={i} className="insight-card" style={{ '--ic': c.color }}>
            <div className="ic-icon" style={{ background: c.color + '20', color: c.color }}>{c.icon}</div>
            <div className="ic-label">{c.label}</div>
            <div className="ic-value">{c.value}</div>
            <div className="ic-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Income vs Expenses</h3>
            <span className="chart-sub">Monthly comparison</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + (v/1000).toFixed(0) + 'k'} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar dataKey="income" fill="#22c55e" radius={[6,6,0,0]} name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[6,6,0,0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Spending Breakdown</h3>
            <span className="chart-sub">By category</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={catData} cx="45%" cy="50%" innerRadius={55} outerRadius={88} dataKey="value" paddingAngle={2} stroke="none">
                {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="cat-breakdown-card">
        <div className="chart-header">
          <h3>Category Breakdown</h3>
          <span className="chart-sub">All expenses</span>
        </div>
        <div className="cat-bars">
          {catData.map((c, i) => {
            const pct = catData[0] ? Math.round((c.value / catData[0].value) * 100) : 0;
            return (
              <div key={i} className="cat-bar-row">
                <div className="cat-bar-label">
                  <span className="cat-dot" style={{ background: c.color }} />
                  <span>{c.name}</span>
                </div>
                <div className="cat-bar-track">
                  <div className="cat-bar-fill" style={{ width: `${pct}%`, background: c.color + 'aa' }} />
                </div>
                <div className="cat-bar-value">{fmt(c.value)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
