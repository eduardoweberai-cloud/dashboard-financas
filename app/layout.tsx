import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// TODO: Import after Story 2.1 (Layout Base) is implemented
// import { PeriodProvider } from '@/context/PeriodContext'
// import { ToastContainer } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard Financeiro',
  description: 'Dashboard de análise financeira com relatórios em tempo real',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        {/* TODO: Wrap with PeriodProvider after Story 2.3 */}
        {children}
        {/* TODO: Add ToastContainer after Story 2.1 */}
      </body>
    </html>
  )
}
