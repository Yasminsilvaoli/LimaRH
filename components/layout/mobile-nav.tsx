'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Briefcase, Users, AlertCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOBILE_ITEMS = [
  { name: 'ATS', href: '/ats', icon: Briefcase },
  { name: 'Pessoas', href: '/colaboradores', icon: Users },
  { name: 'Ocorrências', href: '/ocorrencias', icon: AlertCircle },
  { name: 'Performance', href: '/performance', icon: TrendingUp },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        // Layout base
        'md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 py-2 flex items-center justify-around shadow-lg safe-bottom backdrop-blur-md transition-colors',
        // Modo Claro: fundo claro com borda de separação visível
        'bg-white/95 border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]',
        // Modo Escuro: fundo escuro (zinc-900) com borda verde neon
        'dark:bg-zinc-900 dark:border-t-2 dark:border-[#00FF7F] dark:shadow-[0_-2px_16px_rgba(0,255,127,0.2)]'
      )}
    >
      {MOBILE_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-all',
              // Modo Claro
              isActive
                ? 'text-[var(--primary)] font-bold'
                : 'text-slate-500 hover:text-slate-900',
              // Modo Escuro
              isActive
                ? 'dark:text-[#00FF7F] dark:font-bold'
                : 'dark:text-zinc-400 dark:hover:text-white'
            )}
          >
            <div
              className={cn(
                'p-1 rounded-md transition-colors',
                // Modo Claro
                isActive
                  ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'text-slate-400',
                // Modo Escuro
                isActive
                  ? 'dark:bg-[#00FF7F]/15 dark:text-[#00FF7F]'
                  : 'dark:text-zinc-500 dark:hover:text-zinc-200'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="mt-0.5">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}