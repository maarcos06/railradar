import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RailRadar España | Seguimiento Ferroviario en Tiempo Real',
  description:
    'Visualización en vivo de trenes de alta velocidad y larga distancia sobre la red ferroviaria española con telemetría GPS real de Renfe Data.',
  keywords: ['trenes', 'radar', 'renfe', 'alta velocidad', 'ave', 'alvia', 'avlo', 'espana', 'mapa', 'tiempo real'],
  authors: [{ name: 'RailRadar España' }],
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0e17',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-[#0a0e17] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
