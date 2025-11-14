import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Backlog Buddy',
  description: 'Meet Clear, your AI-powered backlog clearing assistant that helps you plan when to play games based on your free time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning>{children}</body>
    </html>
  );
}
