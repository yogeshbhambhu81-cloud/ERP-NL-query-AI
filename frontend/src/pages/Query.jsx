import React, { useState, useRef, useCallback } from 'react';
import { IoSend, IoCodeSlash, IoSparkles } from 'react-icons/io5';
import { erpService } from '../services/apiClient';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ExportButton from '../components/ui/ExportButton';
import { exportTableToCSV } from '../utils/csvExport';

const SUGGESTED_QUERIES = [
  'Show me total revenue by supplier',
  'Find garments with fabric containing Cotton and price under 20',
  'List top buyers by ordered stock',
  'What is the average price of heavy garments (GSM > 300)?',
];

function QueryMessage({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="query-msg query-msg-user">
        <div className="query-bubble-user">{msg.text}</div>
      </div>
    );
  }

  if (msg.role === 'loading') {
    return (
      <div className="query-msg query-msg-ai">
        <div className="query-bubble-ai query-bubble-loading">
          <Spinner size="sm" /> <span style={{ marginLeft: 8, color: 'var(--text-muted)' }}>Thinking…</span>
        </div>
      </div>
    );
  }

  if (msg.role === 'error') {
    return (
      <div className="query-msg query-msg-ai">
        <div className="query-bubble-error">{msg.text}</div>
      </div>
    );
  }

  // AI Response
  const { sql, headers, rows, aiResponse } = msg;
  return (
    <div className="query-msg query-msg-ai">
      {/* SQL Block */}
      {sql && (
        <div className="query-sql-block">
          <div className="query-sql-header">
            <IoCodeSlash size={14} />
            <span>Generated SQL</span>
          </div>
          <pre className="query-sql-code"><code>{sql}</code></pre>
        </div>
      )}

      {/* Result Table */}
      {headers && rows && (
        <div className="wfx-table-container" style={{ marginTop: '0.75rem' }}>
          <table className="wfx-table">
            <thead>
              <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Export button for SQL results */}
      {headers && rows && rows.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <ExportButton
            onExport={() => exportTableToCSV(headers, rows, 'sql_query_results')}
            disabled={false}
            label="Export Results"
          />
        </div>
      )}

      {/* AI Summary */}
      {aiResponse && (
        <div className="query-ai-response">
          <IoSparkles size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}

function Query() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleSubmit = useCallback(async (queryText) => {
    const q = queryText || input.trim();
    if (!q || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: q }, { role: 'loading' }]);
    setLoading(true);
    scrollToBottom();

    // Abort any in-progress request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await erpService.submitNLQuery(q, controller.signal);
      setMessages((prev) => {
        const updated = prev.filter((m) => m.role !== 'loading');
        return [...updated, { role: 'ai', ...result }];
      });
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMessages((prev) => {
        const updated = prev.filter((m) => m.role !== 'loading');
        return [...updated, { role: 'error', text: `Error: ${err.message}` }];
      });
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [input, loading]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="query-page">
      {/* Chat window */}
      <div className="query-chat-window">
        {messages.length === 0 ? (
          <div className="query-empty">
            <EmptyState
              icon={<IoSparkles />}
              title="Ask anything about your ERP data"
              description="Type a business question in plain English. The AI will generate SQL, run the query, and explain the result."
            />
            <div className="query-suggestions">
              <p className="suggestions-label">Try these questions:</p>
              <div className="suggestions-grid">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    className="suggestion-chip"
                    onClick={() => handleSubmit(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="query-messages">
            {messages.map((msg, i) => (
              <QueryMessage key={i} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="query-input-area">
        <div className="query-input-wrapper">
          <textarea
            id="nl-query-input"
            className="query-textarea"
            rows={1}
            placeholder="e.g. Show me top 5 suppliers by revenue this month…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            aria-label="Natural language query input"
            disabled={loading}
          />
          <button
            id="nl-query-submit"
            className="wfx-btn wfx-btn-primary query-send-btn"
            onClick={() => handleSubmit()}
            disabled={!input.trim() || loading}
            aria-label="Submit query"
          >
            {loading ? <Spinner size="sm" color="white" /> : <IoSend />}
          </button>
        </div>
        <p className="query-input-hint">Press Enter to submit · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

export default Query;
