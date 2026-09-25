'use client';

import React from 'react';
import { 
  Home, 
  Swords, 
  Package, 
  Crown, 
  Users, 
  Ticket, 
  HelpCircle, 
  X,
  Sparkles,
  QrCode,
  Store
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onClaimDailyFree: () => void;
  onOpenScanner: () => void;
  vouchersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onClaimDailyFree,
  onOpenScanner,
  vouchersCount,
}) => {
  const menuItems = [
    { id: 'home', label: 'Bakery Lobby', icon: Home },
    { id: 'battles', label: 'Pastry Clashes (1v1)', icon: Swords, badge: 'SOON' },
    { id: 'crates', label: 'All Oven Crates', icon: Package },
    { id: 'vouchers', label: 'My Vouchers', icon: Ticket, badge: vouchersCount > 0 ? `${vouchersCount}` : undefined },
    { id: 'vip', label: 'Manay\'s VIP Club', icon: Crown },
    { id: 'affiliate', label: 'Invite Ka-Barangay', icon: Users, badge: '+₱20' },
    { id: 'faq', label: 'How to Claim in Store', icon: HelpCircle },
  ];

  const content = (
    <div className="flex flex-col h-full justify-between p-3.5 bg-[#faf8f5]">
      <div className="space-y-4">
        {/* Mobile close button header */}
        <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-200">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Manay&apos;s Panaderia Menu
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Box Card (Light Accessible Bakery Gift Box) */}
        <div className="relative rounded-2xl bg-gradient-to-b from-amber-100/90 via-amber-50 to-white border-2 border-amber-300 p-3.5 overflow-hidden shadow-sm group">
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
            Free Daily
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-200/60 border border-amber-300 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
              🎁
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-amber-950">Daily Oven Crate</h4>
              <p className="text-[10px] text-amber-800/80">Available every 24 hours</p>
            </div>
          </div>

          <button
            onClick={() => {
              onClaimDailyFree();
              onClose();
            }}
            className="mt-3 w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Claim Free Crate
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-100/80 text-amber-950 border-l-4 border-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      item.badge === 'SOON'
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Cashier Mobile Link & Footer */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <button
          onClick={() => {
            onOpenScanner();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-xs cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-600" />
          <span>Staff QR Scanner</span>
        </button>

        <div className="px-2 py-1 text-center">
          <p className="text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1">
            <Store className="w-3 h-3 text-amber-600" /> Manay&apos;s Panaderia
          </p>
          <p className="text-[9px] text-slate-500 mt-0.5">Fresh Bakes Daily • Find us on Google Maps</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 bg-[#faf8f5] border-r border-[#e8e2d8] h-[calc(100vh-61px)] sticky top-[61px] shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
          <div className="absolute top-0 bottom-0 left-0 w-72 bg-[#faf8f5] border-r border-slate-200 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
