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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg safe-bottom">
      {MOBILE_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-all',
              isActive
                ? 'text-emerald-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <div
              className={cn(
                'p-1 rounded-md transition-colors',
                isActive ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'
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
