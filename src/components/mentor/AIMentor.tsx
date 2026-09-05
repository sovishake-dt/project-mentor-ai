import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { Bot, Send, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export const AIMentor: React.FC = () => {
  const { profile, selectedProject, mentorMessages, setMentorMessages } = useProject();

  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentorMessages]);

  const handleSend = async (textToSend?: string) => {
    const msgText = (textToSend || inputMessage).trim();
    if (!msgText || sending) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...mentorMessages, userMsg];
    setMentorMessages(newHistory);
    setInputMessage('');
    setSending(true);

    try {
      const historyForApi = newHistory.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await api.sendMentorMessage(profile, selectedProject, historyForApi, msgText);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai' as const,
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMentorMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai' as const,
        text: `Sorry, I encountered an issue: ${err?.message || 'Unable to process chat.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMentorMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    'How should I organize my database schemas for scalability?',
    'What are the most common viva questions for this project?',
    'How can I optimize Gemini API token costs for production?',
    'What security measures should I implement for API routes?',
  ];

  return (
    <div className="space-y-4 py-2 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Context-Aware AI Mentor</h2>
          </div>
          <p className="text-xs text-slate-500">
            {selectedProject
              ? `Mentoring for: ${selectedProject.title}`
              : 'General engineering & final-year project guidance.'}
          </p>
        </div>

        <button
          onClick={() =>
            setMentorMessages([
              {
                id: 'init-1',
                sender: 'ai',
                text: 'Hello! Chat cleared. What technical or architectural question can I help you with today?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2 text-xs">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors text-left font-medium"
          >
            <Sparkles className="w-3 h-3 text-indigo-600 inline mr-1" />
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 h-[480px] overflow-y-auto space-y-4 flex flex-col">
        {mentorMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                msg.sender === 'user' ? 'bg-slate-900' : 'bg-indigo-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <span
                className={`text-[10px] block text-right font-medium ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold bg-indigo-50 p-3 rounded-xl max-w-xs">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>AI Mentor is thinking...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask AI Mentor anything about architecture, code, algorithms, or viva presentation..."
          className="flex-1 px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || sending}
          className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
