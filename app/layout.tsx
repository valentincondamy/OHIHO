import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OHIHO — Développeur web indépendant',
  description: 'Sites, refontes et applications web. Valentin Condamy, développeur indépendant à Montpellier.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
