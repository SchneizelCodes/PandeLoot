'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Users, Sparkles, Store } from 'lucide-react';
import { soundEngine } from '@/utils/audio';

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  badge?: string;
  time: string;
  isSelf?: boolean;
  isSystem?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', user: 'JOJOPLAYER', text: "boss available pa ba yung whole Yema Cake sa Manay's Panaderia? dadaan ako mamaya", time: '11:42' },
  { id: '2', user: 'CAKEPRO392', text: "try niyo mag-roll sa Celebration Jackpot, nanalo ako ng Whole Choco Cake sa Manay's!", time: '11:45', badge: 'VIP' },
  { id: '3', user: 'SHUNNORIKAN', text: 'legit yung Golden Egg Pie kanina, bagong luto at creamy ng custard 🤤', time: '11:47' },
  { id: '4', user: 'BEA_QC', text: 'Hala ang swerte! Special Cheese Ensaymada nakuha ko sa Free Crate!', time: '11:48' },
  { id: '5', user: 'KUYA_JOMS', text: "ipinakita ko lang yung dynamic QR sa cashier sa Manay's, na-scan agad sabay abot nung Cheese Mamon!", time: '11:50', badge: 'VIP' },
];

interface LivePinoyChatProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  lastWonItemName?: string | null;
}

export const LivePinoyChat: React.FC<LivePinoyChatProps> = ({
  isOpenMobile,
  onCloseMobile,
  lastWonItemName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchAmbientBanter = async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        if (data.user && data.text) {
          setMessages((prev) => [
            ...prev.slice(-30),
            {
              id: `${Date.now()}-${Math.random()}`,
              user: data.user,
              text: data.text,
              badge: data.badge,
              time: data.timestamp || new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          soundEngine.playTick(700);
        }
      } catch {
        // Fallback
      }
    };

    const interval = setInterval(fetchAmbientBanter, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!lastWonItemName) return;

    const announceMessage: ChatMessage = {
      id: `drop-${Date.now()}`,
      user: "Manay's Bakery Bot",
      text: `🎉 A customer just unlocked: 1x ${lastWonItemName}! Claim voucher active!`,
      isSystem: true,
      time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, announceMessage]);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastDropItem: lastWonItemName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.text) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: `${Date.now()}-${Math.random()}`,
                user: data.user || 'PinoyFoodie',
                text: data.text,
                badge: data.badge,
                time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            soundEngine.playTick(600);
          }, 1200);
        }
      })
      .catch(() => {});
  }, [lastWonItemName]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');

    const newMsg: ChatMessage = {
      id: `self-${Date.now()}`,
      user: 'You (Juan)',
      text: userMsg,
      isSelf: true,
      time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: userMsg }),
      });
      const data = await res.json();

      setIsTyping(false);
      if (data.user && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            user: data.user,
            text: data.text,
            badge: data.badge,
            time: data.timestamp || new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        soundEngine.playTick(650);
      }
    } catch {
      setIsTyping(false);
    }
  };

  const chatContent = (
    <div className="flex flex-col h-full bg-[#fcfbfa] border-l border-slate-200">
      {/* Chat Header */}
      <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Tambayan Chat
            </h3>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
              <Store className="w-2.5 h-2.5 text-amber-600" /> Manay&apos;s Panaderia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-mono font-bold text-amber-900 flex items-center gap-1">
            <Users className="w-3 h-3 text-amber-600" /> 84 live
          </span>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded-lg text-slate-500 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#faf8f5]">
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div
                key={msg.id}
                className="p-2 rounded-xl bg-amber-100/70 border border-amber-300 text-center animate-fade-in shadow-2xs"
              >
                <p className="text-[11px] font-bold text-amber-950 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {msg.text}
                </p>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col text-xs ${
                msg.isSelf ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`font-black text-[11px] ${
                    msg.isSelf ? 'text-amber-700' : 'text-slate-800'
                  }`}
                >
                  {msg.user}
                </span>

                {msg.badge && (
                  <span className="px-1 py-0.2 rounded bg-purple-100 border border-purple-300 text-purple-800 text-[8px] font-black uppercase">
                    {msg.badge}
                  </span>
                )}

                <span className="text-[9px] text-slate-400 font-medium">{msg.time}</span>
              </div>

              <div
                className={`px-3.5 py-2 rounded-2xl max-w-[90%] break-words leading-relaxed text-[12px] shadow-2xs ${
                  msg.isSelf
                    ? 'bg-amber-500 text-white font-medium rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1 text-[10px] text-slate-500 italic">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1">typing a reply...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanong o comment sa Manay's..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs uppercase rounded-xl transition-transform active:scale-95 shadow-sm flex items-center justify-center cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <aside className="hidden xl:block w-80 h-[calc(100vh-61px)] sticky top-[61px] shrink-0">
        {chatContent}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="absolute top-0 bottom-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl">
            {chatContent}
          </div>
        </div>
      )}
    </>
  );
};
