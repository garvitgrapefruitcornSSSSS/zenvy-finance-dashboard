import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { computeSummary, getCategoryBreakdown } from "../data/mockData";
import "./AIPanel.css";

const QUICK_PROMPTS = [
  "Where am I overspending?",
  "How can I save more?",
  "Summarize my finances",
  "What's my biggest expense?",
  "Am I on track this month?",
];

const buildContext = (transactions, summary) => {
  const catBreakdown = getCategoryBreakdown(transactions)
    .slice(0, 5)
    .map((c) => `${c.name}: ₹${c.value.toLocaleString("en-IN")}`)
    .join(", ");
  return `You are Zenvy AI, a personal finance assistant for an Indian user. 
Financial snapshot:
- Total Balance: ₹${summary.balance.toLocaleString("en-IN")}
- Total Income: ₹${summary.income.toLocaleString("en-IN")}
- Total Expenses: ₹${summary.expenses.toLocaleString("en-IN")}
- Savings Rate: ${summary.savingsRate}%
- Top spending categories: ${catBreakdown}
- Total transactions: ${transactions.length}

Give short, helpful, actionable financial advice based on this data. Use ₹ for currency. Keep responses concise (2-4 sentences). Be friendly and encouraging.`;
};

export default function AIPanel() {
  const { aiOpen, setAiOpen, transactions, summary } = useApp();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Zenvy AI assistant 👋 Ask me anything about your finances or pick a quick prompt below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (aiOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [aiOpen]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const systemPrompt = buildContext(transactions, summary);
      const history = messages
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: buildContext(transactions, summary) }],
            },
            contents: [
              ...history.map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
              { role: "user", parts: [{ text: userMsg }] },
            ],
          }),
        },
      );

      const data = await res.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }
    setLoading(false);
  };

  if (!aiOpen) return null;

  return (
    <div
      className="ai-overlay"
      onClick={(e) => e.target === e.currentTarget && setAiOpen(false)}
    >
      <div className="ai-panel">
        <div className="ai-header">
          <div className="ai-title">
            <div className="ai-avatar">✦</div>
            <div>
              <div className="ai-name">Zenvy AI</div>
              <div className="ai-status">
                <span className="status-dot" />
                Online
              </div>
            </div>
          </div>
          <button className="ai-close" onClick={() => setAiOpen(false)}>
            ✕
          </button>
        </div>

        <div className="ai-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg-wrap ${m.role}`}>
              {m.role === "assistant" && <div className="msg-avatar">✦</div>}
              <div className={`msg-bubble ${m.role}`}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="msg-wrap assistant">
              <div className="msg-avatar">✦</div>
              <div className="msg-bubble assistant typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div className="quick-prompts">
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                className="quick-btn"
                onClick={() => sendMessage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="ai-input-bar">
          <input
            ref={inputRef}
            className="ai-input"
            placeholder="Ask about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            className="ai-send"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
