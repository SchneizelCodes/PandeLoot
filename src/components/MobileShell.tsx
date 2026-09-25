'use client';

import React from 'react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f5f4ef] flex justify-center items-start sm:py-6 sm:px-4 font-sans select-none">
      {/* Clean Mobile / Desktop Centered Canvas */}
      <div className="w-full sm:max-w-[430px] min-h-screen sm:min-h-[890px] sm:max-h-[920px] bg-white sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:border border-slate-200/90 flex flex-col relative overflow-hidden">
        {/* Scrollable Screen Content without phone status bar or time */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
