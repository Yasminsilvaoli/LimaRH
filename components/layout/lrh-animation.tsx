'use client'

import React from 'react'

interface LrhAnimationProps {
  variant?: 'desktop' | 'mobile'
}

export function LrhAnimation({ variant = 'desktop' }: LrhAnimationProps) {
  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-2 select-none" title="LimaRH">
        <div className="relative h-9 w-[90px] rounded-lg bg-[var(--secondary)] border border-[var(--border-subtle)] dark:border-[#00FF7F]/40 overflow-hidden flex items-center justify-center shadow-xs">
          {/* Ambient Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 via-[var(--primary)]/5 to-[var(--primary)]/10 dark:from-[#00FF7F]/15 dark:via-transparent dark:to-[#00FF7F]/15 animate-pulse" />

          {/* 3 Bolinhas caindo do topo (0s a ~3s) */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
            <span
              className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] dark:bg-[#00FF7F] shadow-[0_0_8px_var(--primary)] dark:shadow-[0_0_10px_#00FF7F] animate-[lrh-mobile-dot_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] dark:bg-[#00FF7F] shadow-[0_0_8px_var(--primary)] dark:shadow-[0_0_10px_#00FF7F] animate-[lrh-mobile-dot_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '180ms' }}
            />
            <span
              className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] dark:bg-[#00FF7F] shadow-[0_0_8px_var(--primary)] dark:shadow-[0_0_10px_#00FF7F] animate-[lrh-mobile-dot_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '360ms' }}
            />
          </div>

          {/* Letras L R H transformadas e fixadas no topo */}
          <div className="relative flex items-center justify-center gap-1.5 font-black text-sm tracking-wider">
            <span
              className="inline-block text-[var(--primary)] dark:text-[#00FF7F] animate-[lrh-mobile-letter_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '0ms' }}
            >
              L
            </span>
            <span
              className="inline-block text-[var(--foreground)] dark:text-white animate-[lrh-mobile-letter_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '180ms' }}
            >
              R
            </span>
            <span
              className="inline-block text-[var(--primary)] dark:text-[#00FF7F] animate-[lrh-mobile-letter_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '360ms' }}
            >
              H
            </span>
          </div>

          {/* Shimmer light bar */}
          <div className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/20 dark:via-[#00FF7F]/30 to-transparent animate-[lrh-shimmer_8s_ease-in-out_infinite]" />
        </div>

        <span className="hidden xs:inline-block font-extrabold text-xs tracking-tight text-[var(--foreground)]">
          Lima<span className="text-[var(--primary)] dark:text-[#00FF7F]">RH</span>
        </span>
      </div>
    )
  }

  // Variant Desktop (Bottom of Sidebar)
  return (
    <div className="p-4 border-t border-[var(--border-subtle)] relative overflow-hidden select-none">
      <div className="relative p-4 rounded-xl bg-[var(--secondary)] dark:bg-zinc-900/90 border border-[var(--border-subtle)] dark:border-[#00FF7F]/30 shadow-xs hover:border-[var(--primary)] dark:hover:border-[#00FF7F]/60 transition-all duration-300 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--primary)]/10 via-transparent to-[var(--primary)]/10 dark:from-[#00FF7F]/15 dark:via-transparent dark:to-[#00FF7F]/15 opacity-75 blur-sm animate-pulse" />

        <div className="relative flex flex-col items-center justify-center min-h-[96px] text-center space-y-2">
          {/* Stage 1: 3 Bolinhas subindo por baixo (0s - 3s) */}
          <div className="absolute inset-0 flex items-center justify-center gap-3.5 pointer-events-none">
            <span
              className="h-3.5 w-3.5 rounded-full bg-[var(--primary)] dark:bg-[#00FF7F] shadow-[0_0_12px_var(--primary)] dark:shadow-[0_0_16px_#00FF7F] animate-[lrh-desktop-dot_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="h-3.5 w-3.5 rounded-full bg-[var(--primary)] dark:bg-[#00FF7F] shadow-[0_0_12px_var(--primary)] dark:shadow-[0_0_16px_#00FF7F] animate-[lrh-desktop-dot_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '200ms' }}
            />
            <span
              className="h-3.5 w-3.5 rounded-full bg-[var(--primary)] dark:bg-[#00FF7F] shadow-[0_0_12px_var(--primary)] dark:shadow-[0_0_16px_#00FF7F] animate-[lrh-desktop-dot_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '400ms' }}
            />
          </div>

          {/* Stage 2: Letras L R H que surgem da transformação das bolinhas */}
          <div className="flex items-center justify-center gap-2">
            {/* Letra L */}
            <div
              className="h-10 w-10 rounded-lg bg-[var(--card)] dark:bg-black border border-[var(--border-subtle)] dark:border-[#00FF7F]/50 flex items-center justify-center font-black text-lg text-[var(--primary)] dark:text-[#00FF7F] shadow-sm animate-[lrh-desktop-letter_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '0ms' }}
            >
              L
            </div>

            {/* Letra R */}
            <div
              className="h-10 w-10 rounded-lg bg-[var(--card)] dark:bg-black border border-[var(--border-subtle)] dark:border-[#00FF7F]/50 flex items-center justify-center font-black text-lg text-[var(--foreground)] dark:text-white shadow-sm animate-[lrh-desktop-letter_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '200ms' }}
            >
              R
            </div>

            {/* Letra H */}
            <div
              className="h-10 w-10 rounded-lg bg-[var(--card)] dark:bg-black border border-[var(--border-subtle)] dark:border-[#00FF7F]/50 flex items-center justify-center font-black text-lg text-[var(--primary)] dark:text-[#00FF7F] shadow-sm animate-[lrh-desktop-letter_8s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
              style={{ animationDelay: '400ms' }}
            >
              H
            </div>
          </div>

          {/* Subtitle / Brand info with fade in */}
          <div className="animate-[lrh-desktop-label_8s_ease-in-out_infinite]">
            <p className="text-[11px] font-bold text-[var(--foreground)] tracking-tight">
              Lima<span className="text-[var(--primary)] dark:text-[#00FF7F]">RH</span> Platform
            </p>
            <p className="text-[9px] uppercase font-semibold text-[var(--muted-foreground)] tracking-wider">
              Ecossistema Integrado
            </p>
          </div>
        </div>

        {/* Shimmer light sweep */}
        <div className="absolute inset-y-0 -left-full w-3/4 bg-gradient-to-r from-transparent via-white/15 dark:via-[#00FF7F]/20 to-transparent animate-[lrh-shimmer_8s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}
