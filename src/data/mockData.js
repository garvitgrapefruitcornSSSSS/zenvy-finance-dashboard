export const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities',
  'Healthcare', 'Education', 'Freelance', 'Investment', 'Salary',
  'Rent', 'Subscriptions', 'Other'
];

export const CATEGORY_COLORS = {
  Food: '#f59e0b', Transport: '#3b82f6', Shopping: '#ec4899',
  Entertainment: '#a855f7', Utilities: '#06b6d4', Healthcare: '#ef4444',
  Education: '#10b981', Freelance: '#6366f1', Investment: '#8b5cf6',
  Salary: '#22c55e', Rent: '#f97316', Subscriptions: '#14b8a6', Other: '#94a3b8'
};

let idCounter = 100;
const newId = () => `t${++idCounter}`;

export const initialTransactions = [
  { id: newId(), title: 'Monthly Salary', category: 'Salary', type: 'income', amount: 85000, date: '2025-04-01', note: 'April salary' },
  { id: newId(), title: 'Freelance Project', category: 'Freelance', type: 'income', amount: 28000, date: '2025-04-03', note: 'Web design project' },
  { id: newId(), title: 'Grocery Store', category: 'Food', type: 'expense', amount: 3800, date: '2025-04-02', note: '' },
  { id: newId(), title: 'Stock Purchase', category: 'Investment', type: 'expense', amount: 12000, date: '2025-04-02', note: 'NIFTY50 ETF' },
  { id: newId(), title: 'Online Course', category: 'Education', type: 'expense', amount: 1999, date: '2025-04-03', note: '' },
  { id: newId(), title: 'Uber Rides', category: 'Transport', type: 'expense', amount: 1400, date: '2025-04-04', note: '' },
  { id: newId(), title: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 2200, date: '2025-04-05', note: '' },
  { id: newId(), title: 'New Sneakers', category: 'Shopping', type: 'expense', amount: 4999, date: '2025-04-06', note: 'Nike Air Max' },
  { id: newId(), title: 'Movie Night', category: 'Entertainment', type: 'expense', amount: 850, date: '2025-04-07', note: '' },
  { id: newId(), title: 'Dentist Visit', category: 'Healthcare', type: 'expense', amount: 3500, date: '2025-04-08', note: '' },
  { id: newId(), title: 'Restaurant Dinner', category: 'Food', type: 'expense', amount: 2200, date: '2025-04-09', note: 'Family dinner' },
  { id: newId(), title: 'Gas Bill', category: 'Utilities', type: 'expense', amount: 1100, date: '2025-04-10', note: '' },
  { id: newId(), title: 'Rent', category: 'Rent', type: 'expense', amount: 22000, date: '2025-03-01', note: 'March rent' },
  { id: newId(), title: 'Monthly Salary', category: 'Salary', type: 'income', amount: 85000, date: '2025-03-01', note: 'March salary' },
  { id: newId(), title: 'Swiggy & Zomato', category: 'Food', type: 'expense', amount: 3200, date: '2025-03-05', note: '' },
  { id: newId(), title: 'Netflix + Spotify', category: 'Subscriptions', type: 'expense', amount: 999, date: '2025-03-06', note: '' },
  { id: newId(), title: 'Metro Card Recharge', category: 'Transport', type: 'expense', amount: 500, date: '2025-03-08', note: '' },
  { id: newId(), title: 'Freelance Design', category: 'Freelance', type: 'income', amount: 15000, date: '2025-03-12', note: 'Logo design' },
  { id: newId(), title: 'Medical Checkup', category: 'Healthcare', type: 'expense', amount: 2500, date: '2025-03-15', note: '' },
  { id: newId(), title: 'Mutual Fund SIP', category: 'Investment', type: 'expense', amount: 5000, date: '2025-03-16', note: '' },
  { id: newId(), title: 'Books', category: 'Education', type: 'expense', amount: 1200, date: '2025-03-20', note: '' },
  { id: newId(), title: 'Weekend Trip', category: 'Entertainment', type: 'expense', amount: 8500, date: '2025-03-22', note: 'Goa trip' },
  { id: newId(), title: 'Clothing', category: 'Shopping', type: 'expense', amount: 6500, date: '2025-03-25', note: '' },
  { id: newId(), title: 'Water Bill', category: 'Utilities', type: 'expense', amount: 450, date: '2025-03-28', note: '' },
  { id: newId(), title: 'Monthly Salary', category: 'Salary', type: 'income', amount: 85000, date: '2025-02-01', note: 'February salary' },
  { id: newId(), title: 'Rent', category: 'Rent', type: 'expense', amount: 22000, date: '2025-02-01', note: '' },
  { id: newId(), title: 'Grocery Store', category: 'Food', type: 'expense', amount: 4200, date: '2025-02-03', note: '' },
  { id: newId(), title: 'Freelance Project', category: 'Freelance', type: 'income', amount: 20000, date: '2025-02-10', note: '' },
  { id: newId(), title: 'Gym Membership', category: 'Healthcare', type: 'expense', amount: 2000, date: '2025-02-12', note: '' },
  { id: newId(), title: 'Mobile Recharge', category: 'Utilities', type: 'expense', amount: 599, date: '2025-02-14', note: '' },
  { id: newId(), title: 'Amazon Shopping', category: 'Shopping', type: 'expense', amount: 3999, date: '2025-02-18', note: '' },
  { id: newId(), title: 'IPL Tickets', category: 'Entertainment', type: 'expense', amount: 5000, date: '2025-02-22', note: '' },
];

export const generateId = () => `t${Date.now()}${Math.random().toString(36).substr(2,5)}`;

export const getMonthlyData = (transactions) => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const monthMap = { 10: 'Oct', 11: 'Nov', 0: 'Dec', 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr' };
  const result = months.map(m => ({ month: m, income: 0, expenses: 0 }));

  transactions.forEach(t => {
    const d = new Date(t.date);
    const mKey = d.getMonth();
    const mName = monthMap[mKey];
    const entry = result.find(r => r.month === mName);
    if (entry) {
      if (t.type === 'income') entry.income += t.amount;
      else entry.expenses += t.amount;
    }
  });

  return result.map(r => ({ ...r, balance: r.income - r.expenses }));
};

export const getCategoryBreakdown = (transactions) => {
  const map = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#94a3b8' }))
    .sort((a, b) => b.value - a.value);
};

export const computeSummary = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  return { income, expenses, balance, savingsRate };
};
