'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users,
  Briefcase,
  TrendingUp,
  AlertCircle,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAVIGATION = [
  {
    name: 'Recrutamento (ATS)',
    href: '/ats',
    icon: Briefcase,
    badge: 'Ativo',
  },
  {
    name: 'Colaboradores (HRIS)',
    href: '/colaboradores',
    icon: Users,
  },
  {
    name: 'Ocorrências & Docs',
    href: '/ocorrencias',
    icon: AlertCircle,
  },
  {
    name: 'Performance & 1:1',
    href: '/performance',
    icon: TrendingUp,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 border-r border-[var(--border-subtle)] bg-[var(--background)] flex-col justify-between shrink-0 transition-colors duration-200">
      <div>
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)] gap-3">
          <div className="h-9 w-9 rounded-lg bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold shadow-md">
            L
          </div>
          <div>
            <span className="font-bold text-[var(--foreground)] text-lg tracking-tight">
              Lima<span className="text-[var(--primary)]">RH</span>
            </span>
            <span className="block text-[10px] uppercase font-semibold text-[var(--muted-foreground)] -mt-1 tracking-wider">
              CLT & PJ Ecosystem
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-6 space-y-1">
          <p className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
            Módulos Principais
          </p>
          {NAVIGATION.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--primary)] font-semibold'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors duration-200',
                      isActive
                        ? 'text-[var(--primary)]'
                        : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)] text-[var(--primary)] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Organization Info & User Footer */}
      <div className="p-4 border-t border-[var(--border-subtle)] space-y-3">
        <div className="p-3 bg-[var(--secondary)] rounded-lg border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center">
            <Building2 className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-[var(--foreground)] truncate">Lima Tech S.A.</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">Plano Enterprise</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="h-8 w-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center text-xs font-semibold shrink-0">
            RH
          </div>
          <div className="text-xs min-w-0">
            <p className="font-medium text-[var(--foreground)] truncate">Recursos Humanos</p>
            <p className="text-[var(--muted-foreground)] truncate">admin@limarh.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
