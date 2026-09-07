import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { SiteProvider } from '@/context/SiteContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Content Studio — Website CMS Platform',
  description: 'Manage website copy, collections, media, and sections across websites',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#0d0d0f] text-[#faf7f0] flex">
        <SiteProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen">
            {children}
          </div>
        </SiteProvider>
      </body>
    </html>
  );
}
