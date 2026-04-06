import { createContext, useContext, useState, useEffect } from 'react';
import { initialTransactions, generateId, computeSummary } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('zenvy-theme') || 'dark');
  const [role, setRole] = useState(() => localStorage.getItem('zenvy-role') || 'admin');
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('zenvy-transactions');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch { return initialTransactions; }
  });
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zenvy-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zenvy-role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('zenvy-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (data) => {
    const t = { ...data, id: generateId() };
    setTransactions(prev => [t, ...prev]);
  };

  const updateTransaction = (id, data) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const resetData = () => {
    setTransactions(initialTransactions);
  };

  const summary = computeSummary(transactions);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, role, setRole,
      transactions, addTransaction, updateTransaction, deleteTransaction, resetData,
      activePage, setActivePage,
      sidebarCollapsed, setSidebarCollapsed,
      aiOpen, setAiOpen,
      addModalOpen, setAddModalOpen,
      editingTransaction, setEditingTransaction,
      summary
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
