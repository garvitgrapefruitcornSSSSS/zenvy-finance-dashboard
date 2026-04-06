import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS, CATEGORIES } from '../data/mockData';
import './Transactions.css';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function Transactions() {
  const { transactions, deleteTransaction, setEditingTransaction, setAddModalOpen, role } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('');
  const [sort, setSort] = useState('date-desc');

  const filtered = transactions
    .filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === 'income' && t.type !== 'income') return false;
      if (filter === 'expense' && t.type !== 'expense') return false;
      if (catFilter && t.category !== catFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sort === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sort === 'amount-desc') return b.amount - a.amount;
      if (sort === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const handleEdit = (t) => {
    setEditingTransaction(t);
    setAddModalOpen(true);
  };

  return (
    <div className="page txn-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-sub">{transactions.length} total transactions</p>
        </div>
        {role === 'admin' && (
          <button className="add-txn-btn" onClick={() => { setEditingTransaction(null); setAddModalOpen(true); }}>
            + Add Transaction
          </button>
        )}
      </div>

      <div className="txn-controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-chips">
          {['all', 'income', 'expense'].map(f => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>

        <select className="sort-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or add a new transaction</p>
        </div>
      ) : (
        <div className="txn-table-wrap">
          <table className="txn-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="txn-row">
                  <td className="txn-date">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="txn-title-cell">
                    <div className="txn-name">{t.title}</div>
                    {t.note && <div className="txn-note">{t.note}</div>}
                  </td>
                  <td>
                    <span className="cat-badge" style={{ background: (CATEGORY_COLORS[t.category] || '#94a3b8') + '20', color: CATEGORY_COLORS[t.category] || '#94a3b8' }}>
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <span className={`type-badge ${t.type}`}>
                      {t.type === 'income' ? '↑' : '↓'} {t.type}
                    </span>
                  </td>
                  <td className={`txn-amount ${t.type === 'income' ? 'pos' : 'neg'}`}>
                    {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                  </td>
                  {role === 'admin' && (
                    <td className="txn-actions">
                      <button className="action-btn edit" onClick={() => handleEdit(t)} title="Edit">✏</button>
                      <button className="action-btn del" onClick={() => deleteTransaction(t.id)} title="Delete">🗑</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
