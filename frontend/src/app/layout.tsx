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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased selection:bg-emerald-500 selection:text-black`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
