 Zenvy-Personal Finance Dashboard

A premium, modern personal finance dashboard built with React. Zenvy helps you understand your money through clean visuals, smart insights, and an AI-powered chat assistant — all in a polished SaaS-style interface.

---

## ✨ Features

- **Dashboard** — Summary cards (balance, income, expenses, savings rate), area chart for balance trend, donut chart for spending by category, and recent transactions list
- **Transactions** — Full table with search, filter chips, category filter, sort options, and inline edit/delete (Admin only)
- **Insights** — Smart analysis cards, monthly income vs expenses bar chart, spending breakdown by category with visual progress bars
- **Settings** — Dark/light theme toggle, role switcher, and data reset
- **Add/Edit Modal** — Clean form with income/expense toggle, inline validation, and smooth animations
- **AI Chat Assistant** — Powered by Google Gemini (or Claude), uses your live financial data as context for personalized advice
- **Role-Based UI** — Admin (full access) and Viewer (read-only) modes
- **Persistent State** — Theme, role, and transactions saved to `localStorage`
- **Responsive** — Works on desktop, tablet, and mobile

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| Recharts | Charts (area, bar, pie/donut) |
| Lucide React | Icons |
| CSS Variables | Theming (dark/light mode) |
| localStorage | Data persistence |
| Google Gemini API | AI chat assistant |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Google Gemini API key ([get one free at Google AI Studio](https://aistudio.google.com))

### Installation

```bash
# 1. Clone or unzip the project
cd zenvy

# 2. Install dependencies
npm install

# 3. Set up your environment variables (see below)

# 4. Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Important:** Vite requires the `VITE_` prefix for env variables to be accessible in the browser via `import.meta.env.VITE_GEMINI_API_KEY`. Never commit your `.env` file — it is already listed in `.gitignore`.

---

## 🤖 AI Assistant Setup (Google Gemini)

The AI panel calls the Gemini API with your live dashboard data as context. To enable it:

1. Get a free API key from [aistudio.google.com](https://aistudio.google.com)
2. Add it to your `.env` file as shown above
3. Open the app and click **"Ask AI"** in the top-right header

The assistant is aware of your balance, income, expenses, savings rate, and top spending categories, and gives personalized financial advice based on them.

### Gemini API call (inside `src/components/AIPanel.jsx`)

```js
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildContext(transactions, summary) }] },
      contents: [
        ...history.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        { role: 'user', parts: [{ text: userMsg }] }
      ]
    })
  }
);
const data = await res.json();
const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
```

### Switching to Anthropic Claude instead

Update the fetch call in `AIPanel.jsx` and add to `.env`:

```env
VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
```

```js
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [...history, { role: 'user', content: userMsg }]
  })
});
const data = await res.json();
const reply = data.content?.[0]?.text;
```

---

## 📁 Project Structure

```
zenvy/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AIPanel.jsx          # AI chat assistant panel
│   │   ├── AIPanel.css
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── Header.css
│   │   ├── Sidebar.jsx          # Collapsible sidebar navigation
│   │   ├── Sidebar.css
│   │   ├── TransactionModal.jsx # Add/edit transaction modal
│   │   └── TransactionModal.css
│   ├── context/
│   │   └── AppContext.jsx       # Global state (React Context)
│   ├── data/
│   │   └── mockData.js          # Mock transactions + data helpers
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main dashboard page
│   │   ├── Dashboard.css
│   │   ├── Insights.jsx         # Financial insights page
│   │   ├── Insights.css
│   │   ├── Settings.jsx         # Settings page
│   │   ├── Settings.css
│   │   ├── Transactions.jsx     # Transactions list page
│   │   └── Transactions.css
│   ├── App.jsx                  # Root layout component
│   ├── App.css
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles + CSS variables
├── .env                         # Your API keys (gitignored)
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Design System

Zenvy uses CSS custom properties for theming, so switching between dark and light mode is instant and smooth.

### Key CSS Variables

```css
--bg-primary        /* Page background */
--bg-card           /* Card background */
--text-primary      /* Primary text */
--text-secondary    /* Muted/secondary text */
--accent            /* Purple (#6366f1) — buttons, active states */
--accent-2          /* Violet (#8b5cf6) — gradient end */
--green             /* Income colour (#22c55e) */
--red               /* Expense colour (#ef4444) */
```

---

## 👤 Roles

| Feature | Admin | Viewer |
|---------|-------|--------|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |
| Floating "+" button | ✅ | ❌ |
| Read Only badge | ❌ | ✅ |

Switch roles anytime from the header dropdown or the Settings page.

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Deploy it to any static host:

```bash
# Preview the production build locally
npm run preview
```

### Deployment Options

**Vercel**
```bash
vercel deploy
```
Add `VITE_GEMINI_API_KEY` in the Vercel dashboard under Project → Settings → Environment Variables.

**Netlify**
Drag and drop the `dist/` folder at [app.netlify.com](https://app.netlify.com), then add env vars under Site Settings → Environment Variables.

**GitHub Pages**
Install `gh-pages`, set `base` in `vite.config.js` to your repo name, then:
```bash
npm run build && npx gh-pages -d dist
```

> When deploying, always add your API key as an environment variable in the hosting dashboard — never commit `.env` to version control.

---

## 💰 Mock Data

The app ships with realistic Indian financial mock data in `src/data/mockData.js`, including:

- Monthly salary credits
- Freelance project income
- Rent, utilities, grocery expenses
- Mutual fund SIP and stock investments
- Food delivery, entertainment, transport, healthcare

All amounts are in **Indian Rupees (₹)** formatted with the `en-IN` locale.

To reset to original mock data, go to **Settings → Reset to mock data**.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

Built with 💜 using React + Vite
