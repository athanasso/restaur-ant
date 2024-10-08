"use client";

import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import { AuthProvider } from '@/components/AuthProvider'
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <SessionProvider>
          <AuthProvider>
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}