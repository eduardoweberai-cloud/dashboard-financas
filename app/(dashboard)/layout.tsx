import React from 'react'
import { ChatWidgetContainer } from '@/components/dashboard/ChatWidgetContainer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Relatórios
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Configurações
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidgetContainer />

      {/* Footer */}
      <footer className="border-t border-border bg-background/95 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © 2026 Dashboard Financeiro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
