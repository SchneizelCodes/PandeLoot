'use client';

import React, { useState } from 'react';
import { Sparkles, Mic, Send, Bot, X, ChevronRight, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentPromptInputProps {
  onAskAgent?: (query: string) => void;
}

export const AgentPromptInput: React.FC<AgentPromptInputProps> = ({ onAskAgent }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: userText }),
      });
      const data = await res.json();
      setIsLoading(false);
      setAgentResponse(data.text || "Fresh out of the oven! Subukan mo mag-roll sa Celebration Jackpot para sa Whole Yema Cake.");
      onAskAgent?.(userText);
    } catch {
      setIsLoading(false);
      setAgentResponse("Laging mainit ang oven sa Manay's Panaderia! Try mo ang aming Cheese Ensaymada at Golden Egg Pie.");
    }
  };

  const handleMicToggle = () => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      // Synthetic mic simulation
      setQuery('Ano ang bagong hurno ngayon sa Manay\'s?');
      setTimeout(() => {
        setIsListening(false);
      }, 1500);
    }
  };

  return (
    <div className="w-full relative z-30 mb-4 px-4">
      {/* Response Card with Progressive Disclosure */}
      <AnimatePresence>
        {agentResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="mb-2.5 p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-md text-xs text-slate-800"
          >
            <div className="flex items-center justify-between pb-2 border-b border-amber-100 mb-2">
              <div className="flex items-center gap-1.5 font-black text-amber-800">
                <Bot className="w-4 h-4 text-amber-600" />
                <span>Manay&apos;s Bakery Assistant</span>
              </div>
              <button
                onClick={() => setAgentResponse(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {agentResponse}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Store className="w-3 h-3 text-amber-600" /> Live from Manay&apos;s Panaderia
              </span>
              <span className="text-amber-700 font-bold flex items-center">
                Ask more <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elevated Prompt Input Capsule */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white/95 backdrop-blur-md border border-amber-900/10 rounded-full px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center gap-2.5 transition-all focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/50"
      >
        {/* Leading AI sparkle icon */}
        <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Manay's AI: 'What's fresh right now?'"
          className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none"
        />

        {/* Trailing Actions: Mic & Submit */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isListening
                ? 'bg-rose-100 text-rose-600 animate-pulse'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="Voice query"
          >
            <Mic className="w-4 h-4" />
          </button>

          {query.trim().length > 0 && (
            <button
              type="submit"
              disabled={isLoading}
              className="p-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold transition-transform active:scale-90 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
