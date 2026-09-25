import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Manay's Panaderia • PandeLoot Mystery Boxes",
  description: "Unbox delicious freshly baked Yema Cake, Cheese Ensaymada, Golden Egg Pie, and bakery treats from Manay's Panaderia.",
  applicationName: "Manay's Panaderia PandeLoot",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Manay's PandeLoot",
  },
  icons: {
    icon: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#faf8f5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-[#faf8f5] text-slate-800 min-h-screen selection:bg-amber-400 selection:text-amber-950">
        {children}
      </body>
    </html>
  );
}
