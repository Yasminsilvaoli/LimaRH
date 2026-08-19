'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <ThemeProvider
      attribute="class"       // aplica classe "dark" no <html>
      defaultTheme="system"   // respeita preferência do sistema na primeira visita
      enableSystem            // detecta prefers-color-scheme
      storageKey="limarh-theme" // chave no localStorage para persistência
      disableTransitionOnChange={false}  // permite transições suaves
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
