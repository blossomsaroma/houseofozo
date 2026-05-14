import type { Metadata } from 'next'
import { Cormorant, Lato, Noto_Sans_Devanagari, Teko } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const teko = Teko({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-teko',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-devanagari',
})

export const metadata: Metadata = {
  title: 'House of Ozo',
  description: 'A gift from memory returns',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${teko.variable} ${lato.variable} ${notoDevanagari.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
