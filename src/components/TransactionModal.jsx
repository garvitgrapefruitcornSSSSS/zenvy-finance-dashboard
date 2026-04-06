import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import './TransactionModal.css';

const today = () => new Date().toISOString().split('T')[0];

const empty = { title: '', amount: '', category: 'Food', type: 'expense', date: today(), note: '' };

export default function TransactionModal() {
  const { addModalOpen, setAddModalOpen, addTransaction, updateTransaction, editingTransaction, setEditingTransaction } = useApp();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setForm({ ...editingTransaction, amount: editingTransaction.amount.toString() });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [editingTransaction, addModalOpen]);

  if (!addModalOpen) return null;

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const data = { ...form, amount: parseFloat(form.amount) };
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
    setSaving(false);
    close();
  };

  const close = () => {
    setAddModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="modal-close" onClick={close}>✕</button>
        </div>

        <div className="modal-body">
          <div className="type-toggle">
            <button className={`type-btn expense ${form.type === 'expense' ? 'active' : ''}`} onClick={() => set('type', 'expense')}>
              ↓ Expense
            </button>
            <button className={`type-btn income ${form.type === 'income' ? 'active' : ''}`} onClick={() => set('type', 'income')}>
              ↑ Income
            </button>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input className={`form-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Grocery Shopping" value={form.title} onChange={e => set('title', e.target.value)} />
            {errors.title && <span className="err-msg">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input className={`form-input ${errors.amount ? 'error' : ''}`} type="number" placeholder="0" value={form.amount} onChange={e => set('amount', e.target.value)} />
              {errors.amount && <span className="err-msg">{errors.amount}</span>}
            </div>
            <div className="form-group">
              <label>Date</label>
              <input className={`form-input ${errors.date ? 'error' : ''}`} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              {errors.date && <span className="err-msg">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Note (optional)</label>
            <textarea className="form-input form-textarea" placeholder="Add a note..." value={form.note} onChange={e => set('note', e.target.value)} rows={2} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={close}>Cancel</button>
          <button className="btn-save" onClick={handleSubmit} disabled={saving}>
            {saving ? <span className="spinner" /> : (editingTransaction ? 'Update' : 'Add Transaction')}
          </button>
        </div>
      </div>
    </div>
  );
}
