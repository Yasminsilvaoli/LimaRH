'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Placeholder enquanto hidrata — sem flash
    return (
      <div className="h-9 w-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
      aria-label="Alternar tema"
      className={`
        relative inline-flex items-center h-8 w-[3.5rem] rounded-full
        transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2
        ${isDark
          ? 'bg-[#2ECC71] shadow-[0_0_12px_rgba(46,204,113,0.4)]'
          : 'bg-[#9B59B6] shadow-[0_0_12px_rgba(155,89,182,0.3)]'
        }
      `}
    >
      {/* Trilho interno */}
      <span className="sr-only">Alternar tema</span>

      {/* Thumb / Indicador deslizante */}
      <span
        className={`
          absolute inline-flex items-center justify-center
          h-6 w-6 rounded-full
          bg-white shadow-md
          transition-transform duration-300 ease-in-out
          ${isDark ? 'translate-x-7' : 'translate-x-1'}
        `}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-[#000000]" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-[#9B59B6]" />
        )}
      </span>
    </button>
  )
}
