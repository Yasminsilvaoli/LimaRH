'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, UserPlus, HeartPulse, Sparkles } from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'ats' | 'cert' | 'perf'
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Novo candidato no ATS',
    description: 'Lucas Silveira Mendes aplicou para Desenvolvedor Full Stack.',
    time: 'Há 10 min',
    read: false,
    type: 'ats',
  },
  {
    id: 'n2',
    title: 'Atestado médico pendente',
    description: 'Mariana Duarte Costa enviou um atestado de 2 dias para validação.',
    time: 'Há 1 hora',
    read: false,
    type: 'cert',
  },
  {
    id: 'n3',
    title: 'Novo feedback registrado',
    description: 'Carlos Eduardo enviou um feedback SBI para Lucas Silveira.',
    time: 'Há 3 horas',
    read: true,
    type: 'perf',
  },
]

export function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notificações"
        className="relative h-9 w-9 flex items-center justify-center rounded-lg transition-colors duration-200
          text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary)]"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--primary)] ring-2 ring-[var(--background)] animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[var(--border-subtle)] bg-[var(--popover)] shadow-2xl z-50
          animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--foreground)]">Notificações</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[var(--accent)] text-[var(--primary)] text-[10px] font-bold">
                  {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)] text-xs">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-[var(--muted-foreground)]">
                Nenhuma notificação por enquanto
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    item.read
                      ? 'hover:bg-[var(--secondary)] opacity-70'
                      : 'bg-[var(--accent)] hover:brightness-95'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[var(--accent)] text-[var(--primary)] shrink-0 mt-0.5">
                    {item.type === 'ats' ? (
                      <UserPlus className="h-3.5 w-3.5" />
                    ) : item.type === 'cert' ? (
                      <HeartPulse className="h-3.5 w-3.5" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`truncate ${item.read ? 'font-medium text-[var(--muted-foreground)]' : 'font-bold text-[var(--foreground)]'}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[var(--muted-foreground)] shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[var(--muted-foreground)] mt-0.5 leading-snug line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
