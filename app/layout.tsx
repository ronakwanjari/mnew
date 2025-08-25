import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from '@/components/convex-provider'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MEDIBOT - AI Health Companion",
  description: "Your personal AI health companion for symptom analysis, doctor consultations, and health monitoring",
  keywords: "healthcare, AI, medical, symptoms, doctor, consultation, health monitoring",
  authors: [{ name: "MEDIBOT Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Safe error suppression for browser extensions
                (function() {
                  const originalConsoleError = console.error;
                  console.error = function(...args) {
                    const message = args.join(' ').toLowerCase();
                    const extensionKeywords = ['metamask', 'ethereum', 'web3', 'coinbase', 'wallet', 'crypto', 'blockchain', 'extension'];

                    if (!extensionKeywords.some(keyword => message.includes(keyword))) {
                      originalConsoleError.apply(console, args);
                    }
                  };

                  // Handle unhandled promise rejections
                  window.addEventListener('unhandledrejection', function(event) {
                    const reason = String(event.reason).toLowerCase();
                    const extensionKeywords = ['metamask', 'ethereum', 'web3', 'coinbase', 'wallet', 'crypto', 'blockchain', 'extension'];

                    if (extensionKeywords.some(keyword => reason.includes(keyword))) {
                      event.preventDefault();
                      return false;
                    }
                  });

                  // Handle general errors
                  window.addEventListener('error', function(event) {
                    const message = event.message?.toLowerCase() || '';
                    const extensionKeywords = ['metamask', 'ethereum', 'web3', 'coinbase', 'wallet', 'crypto', 'blockchain', 'extension'];

                    if (extensionKeywords.some(keyword => message.includes(keyword))) {
                      event.preventDefault();
                      event.stopPropagation();
                      return false;
                    }
                  });
                })();
              `,
            }}
          />
        </head>
        <body className={inter.className}>
          <ConvexClientProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <ErrorBoundary>
                {children}
                <Toaster />
              </ErrorBoundary>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}