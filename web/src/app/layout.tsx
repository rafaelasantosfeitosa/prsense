import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { clerkPublishableKey, isClerkConfigured } from '../lib/clerk';
import './globals.css';

export const metadata: Metadata = {
  title: 'PRsense — AI-powered PR review',
  description:
    'Catch risks before reviewers do. Inline AI code review on every GitHub pull request, powered by Gemini Flash.',
  openGraph: {
    title: 'PRsense — AI-powered PR review',
    description: 'Inline AI code review on every GitHub pull request.',
    url: 'https://prsense.app',
    siteName: 'PRsense',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const page = (
    <html lang="en">
      <body>{children}</body>
    </html>
  );

  if (!isClerkConfigured) return page;

  return <ClerkProvider publishableKey={clerkPublishableKey}>{page}</ClerkProvider>;
}
