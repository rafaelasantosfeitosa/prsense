import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'PRsense — AI-powered PR review',
  description: 'Inline AI code review on every GitHub pull request.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          style={{
            margin: 0,
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            background: '#0b0d10',
            color: '#e6e8eb',
          }}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
