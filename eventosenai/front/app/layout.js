// app/layout.js
import './globals.css';

export const metadata = {
  title: 'EventoSENAI — Gerenciamento de Eventos Escolares',
  description:
    'Plataforma de gerenciamento de eventos escolares do SENAI. Consulte eventos, faça inscrições em palestras, oficinas e workshops.',
  keywords: 'SENAI, eventos, inscrições, palestras, oficinas, workshops',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
