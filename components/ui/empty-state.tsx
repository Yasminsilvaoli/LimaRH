'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionNode?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionNode,
}: EmptyStateProps) {
  return (
    <div className="led-card flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[var(--border-subtle)] dark:border-zinc-800 bg-[var(--card)] my-4">
      {/* Icon Badge */}
      <div className="h-16 w-16 rounded-2xl bg-[var(--primary)]/10 dark:bg-[#00FF7F]/10 border border-[var(--primary)]/20 dark:border-[#00FF7F]/30 flex items-center justify-center mb-4 text-[var(--primary)] dark:text-[#00FF7F] shadow-sm">
        <Icon className="h-8 w-8" />
      </div>

      {/* Title & Description */}
      <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-md mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Action Button or custom node */}
      {actionNode ? (
        actionNode
      ) : actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black dark:shadow-[0_0_15px_rgba(0,255,127,0.3)]"
        >
          <span>{actionLabel}</span>
        </button>
      ) : null}
    </div>
  )
}
