'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageCircle, Store, Users, MapPin, Clock, ArrowRight, CornerDownLeft, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '@/utils/audio';

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  badge?: string;
  badgeColor?: string;
  text: string;
  timestamp: string;
  isUser?: boolean;
  replyTo?: string;
}

export interface BotPersona {
  id: string;
  name: string;
  avatar: string;
  role: string;
  badgeColor: string;
}

export const TAMBAYAN_BOTS: BotPersona[] = [
  { id: 'baker_bob', name: 'Baker Bob', avatar: '👨‍🍳', role: 'Head Baker', badgeColor: 'bg-amber-600 text-white' },
  { id: 'aling_marites', name: 'Aling Marites', avatar: '💅', role: 'Bakery Suki', badgeColor: 'bg-pink-600 text-white' },
  { id: 'kuya_joms', name: 'Kuya Joms', avatar: '🏍️', role: 'Motor Suki', badgeColor: 'bg-blue-600 text-white' },
  { id: 'sarah_qc', name: 'Sarah QC', avatar: '🌸', role: 'Foodie', badgeColor: 'bg-purple-600 text-white' },
  { id: 'carlo_loot', name: 'Carlo Caloocan', avatar: '⚡', role: 'Crate Hunter', badgeColor: 'bg-emerald-600 text-white' },
  { id: 'tita_baby', name: 'Tita Baby', avatar: '👵', role: 'Suki VIP', badgeColor: 'bg-orange-600 text-white' },
];

// Pre-scripted natural Pinoy tambayan dialogues where bots ask and speak with each other
const INITIAL_CONVERSATION: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'Kuya Joms',
    avatar: '🏍️',
    badge: 'Motor Suki',
    badgeColor: 'bg-blue-600 text-white',
    text: 'Baker Bob, anong oras lalabas yung bagong batch ng Egg Pie at Custard Cake? Amoy hanggang kanto eh!',
    timestamp: 'Just now',
  },
  {
    id: 'msg-init-2',
    sender: 'Baker Bob',
    avatar: '👨‍🍳',
    badge: 'Head Baker',
    badgeColor: 'bg-amber-600 text-white',
    text: '@Kuya Joms Kaaahon lang paps! Golden brown na sa tray, samahan mo na ng mainit na kape.',
    timestamp: 'Just now',
  },
  {
    id: 'msg-init-3',
    sender: 'Aling Marites',
    avatar: '💅',
    badge: 'Bakery Suki',
    badgeColor: 'bg-pink-600 text-white',
    text: 'Hoy Carlo! Nakita ko sa ticker naka-100% Free Yema Cake ka raw kanina? Sana all pinagpala sa lootbox!',
    timestamp: 'Just now',
  },
  {
    id: 'msg-init-4',
    sender: 'Carlo Caloocan',
    avatar: '⚡',
    badge: 'Crate Hunter',
    badgeColor: 'bg-emerald-600 text-white',
    text: '@Aling Marites Legit Tita! 1 roll per account lang kaya sinwerte talaga. Dinerecho ko agad sa cashier kanina.',
    timestamp: 'Just now',
  },
];

// Conversational loops where bots speak and ask each other
const AUTONOMOUS_BOT_EXCHANGES: Array<{
  sender: BotPersona;
  text: string;
  delayMs?: number;
}> = [
  {
    sender: TAMBAYAN_BOTS[3], // Sarah QC
    text: 'May nakatry na ba nung Cheese Ensaymada dito? Grabe ba dami ng Queso de Bola?',
  },
  {
    sender: TAMBAYAN_BOTS[0], // Baker Bob
    text: '@Sarah QC Sobra! Bagong giling na Edam cheese saka purong butter toppings niyan.',
  },
  {
    sender: TAMBAYAN_BOTS[5], // Tita Baby
    text: 'Mga anak, anong oras ulit nagsasara si Manay? Aabutin pa ba ako galing palengke?',
  },
  {
    sender: TAMBAYAN_BOTS[2], // Kuya Joms
    text: '@Tita Baby Hanggang 8:00 PM po bukas si Manay\'s Panaderia! 7am to 8pm everyday.',
  },
  {
    sender: TAMBAYAN_BOTS[4], // Carlo Caloocan
    text: 'Tip lang sa mga bagong sali sa tambayan: mag-comment muna kayo sa FB post para icheck availability bago pumunta!',
  },
  {
    sender: TAMBAYAN_BOTS[1], // Aling Marites
    text: '@Carlo Caloocan Ay totoo yan! Minsan pag 5pm ubos na agad yung Choco Cake at Pianono.',
  },
  {
    sender: TAMBAYAN_BOTS[3], // Sarah QC
    text: 'Paborito ko talaga dito yung Banana Cake loaf, malambot kahit kinabukasan na kainin.',
  },
  {
    sender: TAMBAYAN_BOTS[0], // Baker Bob
    text: 'Salamat Sarah! Bagong saba bananas gamit namin diyan araw-araw.',
  },
  {
    sender: TAMBAYAN_BOTS[5], // Tita Baby
    text: 'Sino may extrang kape diyan? Masarap isawsaw yung Cheese Mamon eh haha!',
  },
  {
    sender: TAMBAYAN_BOTS[2], // Kuya Joms
    text: '@Tita Baby Tara Tita kape tayo dito sa labas ng bakery habang mainit pa tinapay!',
  },
  {
    sender: TAMBAYAN_BOTS[4], // Carlo Caloocan
    text: 'Yung BOGO voucher sa Brownies kanina pinaghatiian namin ng tropa. Sulit ₱0 halos.',
  },
  {
    sender: TAMBAYAN_BOTS[1], // Aling Marites
    text: 'Grabe ang bilis ng claims ngayon, 14 tambays na online sa chat room oh!',
  },
];

const SUGGESTED_QUESTIONS = [
  '🍞 Available ba Egg Pie ngayon?',
  '🎟️ Paano mag-claim ng voucher?',
  '🕒 Anong oras bukas si Manay?',
  '📍 Saan exact location niyo?',
  '👑 Ano pinaka-bestseller?',
];

interface TambayanChatScreenProps {
  onNavigateToRoll?: () => void;
}

export const TambayanChatScreen: React.FC<TambayanChatScreenProps> = ({
  onNavigateToRoll,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CONVERSATION);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [onlineCount] = useState(14);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const exchangeIndexRef = useRef(0);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Autonomous bot-to-bot chat loop: Bots talk and ask each other questions every 5-7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't interrupt if bot is currently replying to user
      if (isTyping) return;

      const exchange = AUTONOMOUS_BOT_EXCHANGES[exchangeIndexRef.current % AUTONOMOUS_BOT_EXCHANGES.length];
      exchangeIndexRef.current += 1;

      // Show brief typing indicator for that bot
      setIsTyping(`${exchange.sender.name} is typing...`);

      setTimeout(() => {
        setIsTyping(null);
        const newMsg: ChatMessage = {
          id: `bot-loop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          sender: exchange.sender.name,
          avatar: exchange.sender.avatar,
          badge: exchange.sender.role,
          badgeColor: exchange.sender.badgeColor,
          text: exchange.text,
          timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev.slice(-35), newMsg]);
        if (!isSoundMuted) {
          soundEngine.playTick(480);
        }
      }, 1400);
    }, 5500);

    return () => clearInterval(interval);
  }, [isTyping, isSoundMuted]);

  // Handle user sending a question/message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    setInputText('');

    // Add user message to chat immediately
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'You',
      avatar: '👤',
      badge: 'Guest Tambay',
      badgeColor: 'bg-slate-900 text-white',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    soundEngine.playTick(600);

    // Pick a responding bot based on question context
    let responder = TAMBAYAN_BOTS[0]; // Default Baker Bob
    const lower = query.toLowerCase();
    if (lower.includes('oras') || lower.includes('time') || lower.includes('bukas') || lower.includes('close')) {
      responder = TAMBAYAN_BOTS[2]; // Kuya Joms
    } else if (lower.includes('voucher') || lower.includes('claim') || lower.includes('roll') || lower.includes('free') || lower.includes('perk')) {
      responder = TAMBAYAN_BOTS[4]; // Carlo Caloocan
    } else if (lower.includes('chismis') || lower.includes('sino') || lower.includes('marites') || lower.includes('ubos')) {
      responder = TAMBAYAN_BOTS[1]; // Aling Marites
    } else if (lower.includes('masarap') || lower.includes('sweet') || lower.includes('cake') || lower.includes('flavor')) {
      responder = TAMBAYAN_BOTS[3]; // Sarah QC
    } else if (lower.includes('luto') || lower.includes('oven') || lower.includes('mainit') || lower.includes('fresh')) {
      responder = TAMBAYAN_BOTS[0]; // Baker Bob
    }

    setIsTyping(`${responder.name} is typing...`);

    // Call API / Gemini endpoint or generate intelligent bakery answer
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
        }),
      });

      const data = await res.json();
      setIsTyping(null);

      const replyText = data.text || getSmartFallbackAnswer(query, responder.name);

      const botReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: responder.name,
        avatar: responder.avatar,
        badge: responder.role,
        badgeColor: responder.badgeColor,
        text: replyText.startsWith('@') ? replyText : `@You ${replyText}`,
        timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
      if (!isSoundMuted) {
        soundEngine.playWinFanfare(false);
      }
    } catch {
      setIsTyping(null);
      const fallbackText = getSmartFallbackAnswer(query, responder.name);
      const botReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: responder.name,
        avatar: responder.avatar,
        badge: responder.role,
        badgeColor: responder.badgeColor,
        text: `@You ${fallbackText}`,
        timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
    }
  };

  // Smart domain-specific response helper if offline or quick fallback
  const getSmartFallbackAnswer = (q: string, botName: string): string => {
    const low = q.toLowerCase();
    if (low.includes('oras') || low.includes('time') || low.includes('close') || low.includes('open')) {
      return "Bukas si Manay's Panaderia everyday from 7:00 AM to 8:00 PM! Same-day lang din valid ang claim ng vouchers.";
    }
    if (low.includes('voucher') || low.includes('claim') || low.includes('paano') || low.includes('how')) {
      return "Pindutin mo lang yung center button sa dock para mag-roll ng crate! Kapag nanalo ka, 1-click Google Sign-in para makuha mo yung dynamic QR voucher mo.";
    }
    if (low.includes('egg pie') || low.includes('available')) {
      return "Opo! Pero recommend namin mag-comment ka muna sa Facebook post ni Manay para macheck kung bagong hango bago ka bumiyahe.";
    }
    if (low.includes('location') || low.includes('saan') || low.includes('branch') || low.includes('maps')) {
      return "Nasa Google Maps kami paps! I-search mo lang 'Manay's Panaderia' or i-click yung navigation link sa voucher mo.";
    }
    if (low.includes('bestseller') || low.includes('masarap') || low.includes('rekomenda')) {
      return "Solid yung Yema Cake, Whole Choco Cake, Silky Egg Pie, saka Cheese Ensaymada! Lahat yan paborito ng mga taga-rito.";
    }
    return `Korek ka diyan paps! Bisitahin mo kami sa Manay's Panaderia, mainit pa lahat ng pastries natin today.`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[520px] max-h-[740px] px-3 pt-2 pb-24 text-slate-900 select-none">
      {/* 1. Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg shadow-2xs">
            💬
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                Tambayan Chat
              </h2>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Manay&apos;s Panaderia • {onlineCount} Tambays Active
            </p>
          </div>
        </div>

        {/* Audio Mute & Roll Link */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer"
            title={isSoundMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
          </button>

          {onNavigateToRoll && (
            <button
              onClick={onNavigateToRoll}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Roll Drop</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Chat Feed Area */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
        {/* Ambient Notice Banner */}
        <div className="bg-[#f7f5f0] border border-amber-200/60 rounded-xl p-2.5 text-[10px] text-slate-600 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Kwentuhan &amp; Tanungan:</strong> Makipag-kwentuhan sa mga tambay at kay Baker Bob tungkol sa bagong luto!
            </span>
          </div>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-sm shrink-0">
              {msg.avatar}
            </div>

            {/* Bubble Content */}
            <div className={`max-w-[78%] flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
              {/* Sender Name & Role Badge */}
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-black text-slate-900">
                  {msg.sender}
                </span>
                {msg.badge && (
                  <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-md ${msg.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {msg.badge}
                  </span>
                )}
                <span className="text-[8.5px] text-slate-400">
                  {msg.timestamp}
                </span>
              </div>

              {/* Message text card */}
              <div
                className={`p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-2xs ${
                  msg.isUser
                    ? 'bg-[#1d58d8] text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Live Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-[10px] text-slate-500 italic pl-9 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-ping" />
            <span>{isTyping}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Quick Suggestion Prompt Chips */}
      <div className="pt-2 pb-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200/90 hover:border-slate-400 text-slate-700 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 4. Chat Input Bar */}
      <div className="pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm flex items-center gap-2"
        >
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-600 shrink-0">
            💬
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanungin si Baker Bob o makipag-kwentuhan..."
            className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-full bg-[#1d58d8] disabled:bg-slate-200 text-white flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
