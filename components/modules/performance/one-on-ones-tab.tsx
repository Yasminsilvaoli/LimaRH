'use client'

import { useState, useEffect } from 'react'
import { OneOnOneWithUsers } from '@/lib/performance-mock'
import { New1on1Dialog } from '@/components/modules/performance/new-1on1-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import {
  fetchOneOnOnes,
  updateOneOnOneStatus,
  updateOneOnOneActionItems,
  deleteOneOnOne,
} from '@/lib/services/one-on-ones'
import { Calendar, CheckCircle2, MessageSquare, ListTodo, Trash2, Loader2 } from 'lucide-react'

interface OneOnOnesTabProps {
  initialData?: OneOnOneWithUsers[]
}

export function OneOnOnesTab({ initialData = [] }: OneOnOnesTabProps) {
  const [meetings, setMeetings] = useState<OneOnOneWithUsers[]>(initialData)
  const [isLoading, setIsLoading] = useState(initialData.length === 0)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const data = await fetchOneOnOnes()
        if (isMounted) setMeetings(data)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const handleAddMeeting = (meeting: OneOnOneWithUsers) => {
    setMeetings((prev) => [meeting, ...prev])
  }

  const handleToggleActionItem = async (meetingId: string, itemId: string) => {
    const targetMeeting = meetings.find((m) => m.id === meetingId)
    if (!targetMeeting || !Array.isArray(targetMeeting.action_items)) return

    const updatedItems = (targetMeeting.action_items as any[]).map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    )

    // Otimista
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, action_items: updatedItems } : m))
    )

    await updateOneOnOneActionItems(meetingId, updatedItems)
  }

  const handleMarkAsDone = async (meetingId: string) => {
    // Otimista
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, status: 'realizada' } : m))
    )
    await updateOneOnOneStatus(meetingId, 'realizada')
  }

  const handleDeleteMeeting = async (meetingId: string, employeeName: string) => {
    if (!confirm(`Deseja excluir a reunião de 1:1 com ${employeeName}?`)) return
    const success = await deleteOneOnOne(meetingId)
    if (success) {
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reuniões de 1:1 (One-on-Ones)
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-0.5">
            Acompanhe a frequência, histórico de alinhamentos e compromissos firmados.
          </p>
        </div>

        <New1on1Dialog onAdd1on1={handleAddMeeting} />
      </div>

      {isLoading ? (
        <div className="led-card p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)] dark:text-[#00FF7F]" />
          <p className="text-xs text-[var(--muted-foreground)] font-medium">Carregando reuniões 1:1...</p>
        </div>
      ) : meetings.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Nenhuma reunião 1:1 agendada"
          description="Agende seu primeiro alinhamento individual para acompanhar o desenvolvimento e as metas do colaborador."
          actionNode={
            <New1on1Dialog
              onAdd1on1={handleAddMeeting}
              trigger={
                <button
                  type="button"
                  className="h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black dark:shadow-[0_0_15px_rgba(0,255,127,0.3)]"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Agendar Primeira 1:1</span>
                </button>
              }
            />
          }
        />
      ) : (
        /* 2-Column Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {meetings.map((meeting) => {
            const isUpcoming = meeting.status === 'agendada'
            const meetingDate = new Date(meeting.scheduled_at)

            return (
              <div
                key={meeting.id}
                className={[
                  'rounded-xl p-3.5 sm:p-5 transition-all flex flex-col justify-between',
                  'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300',
                  'dark:bg-[#000000] dark:border-[#00FF7F] dark:shadow-[0_0_15px_rgba(0,255,127,0.12)] dark:hover:shadow-[0_0_20px_rgba(0,255,127,0.22)]',
                ].join(' ')}
              >
                <div>
                  {/* Header: Status Badge & Date & Delete */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      {isUpcoming ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shadow-xs bg-blue-100 text-blue-800 dark:bg-[#0047AB] dark:text-white">
                          Próxima 1:1
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shadow-xs bg-emerald-100 text-emerald-800 dark:bg-[#006400] dark:text-white">
                          Realizada
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-[#A1A1AA] font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {meetingDate.toLocaleDateString('pt-BR')} às{' '}
                          {meetingDate.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteMeeting(meeting.id, meeting.employee_name)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded"
                        title="Excluir 1:1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Employee Info */}
                  <div className="pt-3 pb-3 sm:pb-4">
                    <p className="text-[11px] text-slate-400 dark:text-[#A1A1AA] font-semibold uppercase tracking-wider">
                      Colaborador
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#00BFFF] hover:text-[var(--primary)] dark:hover:text-[#33CCFF] transition-colors mt-0.5">
                      {meeting.employee_name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-0.5">{meeting.employee_role}</p>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 sm:space-y-4 text-xs">
                    {meeting.manager_notes && (
                      <div className="space-y-1.5">
                        <p className="font-semibold text-slate-700 dark:text-white flex items-center gap-1.5 text-xs">
                          <MessageSquare className="h-3.5 w-3.5 text-[var(--primary)] dark:text-[#00FF7F]" />
                          <span>Pauta & Notas</span>
                        </p>
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 dark:p-0 dark:bg-transparent dark:border-0 dark:rounded-none">
                          <p className="text-slate-700 dark:text-white leading-relaxed text-xs">
                            {meeting.manager_notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Items */}
                    {Array.isArray(meeting.action_items) && meeting.action_items.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <p className="font-semibold text-slate-700 dark:text-white flex items-center gap-1.5 text-xs">
                          <ListTodo className="h-3.5 w-3.5 text-blue-500 dark:text-[#00BFFF]" />
                          <span>
                            Plano de Ação / Compromissos (
                            {(meeting.action_items as any[]).filter((i) => i.done).length}/
                            {meeting.action_items.length})
                          </span>
                        </p>

                        <div className="space-y-2">
                          {(meeting.action_items as any[]).map((item) => (
                            <label
                              key={item.id}
                              className={[
                                'flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors',
                                'bg-white border border-slate-200 hover:border-slate-300',
                                'dark:bg-[#121212] dark:border-white/10 dark:hover:border-[#00FF7F]/40',
                              ].join(' ')}
                            >
                              <input
                                type="checkbox"
                                checked={item.done}
                                onChange={() => handleToggleActionItem(meeting.id, item.id)}
                                className="rounded h-4 w-4 mt-0.5 accent-[var(--primary)] dark:accent-[#00FF7F]"
                              />
                              <span
                                className={`text-xs leading-relaxed ${
                                  item.done
                                    ? 'line-through text-slate-400 dark:text-[#A1A1AA]'
                                    : 'text-slate-700 dark:text-white font-medium'
                                }`}
                              >
                                {item.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button: Marcar como Realizada */}
                {isUpcoming && (
                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => handleMarkAsDone(meeting.id)}
                      className={[
                        'w-full h-9 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                        'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm',
                        'dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black dark:shadow-[0_0_12px_rgba(0,255,127,0.3)] dark:hover:shadow-[0_0_16px_rgba(0,255,127,0.5)]',
                      ].join(' ')}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Marcar como Realizada</span>
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}