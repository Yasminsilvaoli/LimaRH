'use client'

import { useState } from 'react'
import { OneOnOneWithUsers } from '@/lib/performance-mock'
import { New1on1Dialog } from '@/components/modules/performance/new-1on1-dialog'
import { Calendar, CheckCircle2, MessageSquare, ListTodo } from 'lucide-react'

interface OneOnOnesTabProps {
  initialData: OneOnOneWithUsers[]
}

export function OneOnOnesTab({ initialData }: OneOnOnesTabProps) {
  const [meetings, setMeetings] = useState<OneOnOneWithUsers[]>(initialData)

  const handleAddMeeting = (meeting: OneOnOneWithUsers) => {
    setMeetings((prev) => [meeting, ...prev])
  }

  const handleToggleActionItem = (meetingId: string, itemId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId || !Array.isArray(m.action_items)) return m
        const updatedItems = (m.action_items as any[]).map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        )
        return { ...m, action_items: updatedItems }
      })
    )
  }

  const handleMarkAsDone = (meetingId: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, status: 'realizada' } : m))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Reuniões de 1:1 (One-on-Ones)
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Acompanhe a frequência, histórico de alinhamentos e compromissos firmados.
          </p>
        </div>

        <New1on1Dialog onAdd1on1={handleAddMeeting} />
      </div>

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.map((meeting) => {
          const isUpcoming = meeting.status === 'agendada'
          const meetingDate = new Date(meeting.scheduled_at)

          return (
            <div
              key={meeting.id}
              className="bg-[#000000] border border-[#00FF7F] rounded-xl p-5 shadow-[0_0_15px_rgba(0,255,127,0.12)] hover:shadow-[0_0_20px_rgba(0,255,127,0.22)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Status Badge & Date */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  {/* Status Badge */}
                  {isUpcoming ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#0047AB] text-white tracking-wide shadow-xs">
                      Próxima 1:1
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#006400] text-white tracking-wide shadow-xs">
                      Realizada
                    </span>
                  )}

                  {/* Date & Time */}
                  <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA] font-medium">
                    <Calendar className="h-3.5 w-3.5 text-[#A1A1AA]" />
                    <span>
                      {meetingDate.toLocaleDateString('pt-BR')} às{' '}
                      {meetingDate.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Employee Info */}
                <div className="pt-3 pb-4">
                  <p className="text-[11px] text-[#A1A1AA] font-semibold uppercase tracking-wider">
                    Colaborador
                  </p>
                  <h3 className="text-lg font-bold text-[#00BFFF] hover:text-[#33CCFF] transition-colors mt-0.5">
                    {meeting.employee_name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">{meeting.employee_role}</p>
                </div>

                {/* Content: Directly on Card Dark Background (No White Boxes) */}
                <div className="space-y-4 text-xs">
                  {/* Pauta & Notas Section */}
                  {meeting.manager_notes && (
                    <div className="space-y-1.5">
                      <p className="font-semibold text-white flex items-center gap-1.5 text-xs">
                        <MessageSquare className="h-3.5 w-3.5 text-[#00FF7F]" />
                        <span>Pauta & Notas</span>
                      </p>
                      <p className="text-white leading-relaxed text-xs">
                        {meeting.manager_notes}
                      </p>
                    </div>
                  )}

                  {/* Plano de Ação / Compromissos Section */}
                  {Array.isArray(meeting.action_items) && meeting.action_items.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="font-semibold text-white flex items-center gap-1.5 text-xs">
                        <ListTodo className="h-3.5 w-3.5 text-[#00BFFF]" />
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
                            className="flex items-start gap-2.5 p-2 rounded-lg bg-[#121212] border border-white/10 cursor-pointer hover:border-[#00FF7F]/40 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => handleToggleActionItem(meeting.id, item.id)}
                              className="rounded border-zinc-700 bg-black text-[#00FF7F] focus:ring-[#00FF7F] h-4 w-4 mt-0.5 accent-[#00FF7F]"
                            />
                            <span
                              className={`text-xs leading-relaxed ${
                                item.done ? 'line-through text-[#A1A1AA]' : 'text-white font-medium'
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
                <div className="pt-5 mt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleMarkAsDone(meeting.id)}
                    className="w-full h-9 rounded-lg bg-[#00FF7F] hover:bg-[#00FA9A] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,255,127,0.3)] hover:shadow-[0_0_16px_rgba(0,255,127,0.5)] cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 text-black" />
                    <span>Marcar como Realizada</span>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}