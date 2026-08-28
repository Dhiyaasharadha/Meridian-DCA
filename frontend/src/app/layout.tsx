import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meridian-DCA — Yield-Optimized DCA Engine',
  description:
    'Yield-aware, market-adaptive DCA execution powered by ERC-4626 vaults and Uniswap v4 Hooks. Your DCA capital works while it waits.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F5F2EB] text-[#1A1D1A] antialiased selection:bg-[#1E4D40] selection:text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
