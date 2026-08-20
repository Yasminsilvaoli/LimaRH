'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { OneOnOneWithUsers } from '@/lib/performance-mock'
import { createOneOnOne } from '@/lib/services/one-on-ones'
import { fetchEmployees } from '@/lib/services/employees'
import { EmployeeWithDetails } from '@/types'

interface New1on1DialogProps {
  onAdd1on1: (meeting: OneOnOneWithUsers) => void
  trigger?: React.ReactNode
}

export function New1on1Dialog({ onAdd1on1, trigger }: New1on1DialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [customEmployeeName, setCustomEmployeeName] = useState('')
  const [scheduledAt, setScheduledAt] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  )
  const [managerNotes, setManagerNotes] = useState('')
  const [actionItemText, setActionItemText] = useState('')

  useEffect(() => {
    if (open) {
      fetchEmployees().then((data) => {
        setEmployees(data)
        if (data.length > 0) {
          setSelectedEmployeeId(data[0].id)
        }
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let empName = customEmployeeName.trim()
    let empRole = 'Colaborador'

    if (selectedEmployeeId && employees.length > 0) {
      const found = employees.find((emp) => emp.id === selectedEmployeeId)
      if (found) {
        empName = found.full_name
        empRole = found.job_title
      }
    }

    if (!empName) return

    setIsSubmitting(true)
    try {
      const newMeeting = await createOneOnOne({
        employee_id: selectedEmployeeId || undefined,
        employee_name: empName,
        employee_role: empRole,
        scheduled_at: new Date(scheduledAt).toISOString(),
        manager_notes: managerNotes || 'Reunião de alinhamento e acompanhamento periódico.',
        action_items: actionItemText.trim()
          ? [{ id: `act-${Date.now()}`, text: actionItemText.trim(), done: false }]
          : [{ id: `act-${Date.now()}`, text: 'Alinhar entregas da sprint e próximos passos', done: false }],
      })

      if (newMeeting) {
        onAdd1on1(newMeeting)
        setOpen(false)
        setManagerNotes('')
        setActionItemText('')
        setCustomEmployeeName('')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-9 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black font-bold text-xs flex items-center gap-2 dark:shadow-[0_0_12px_rgba(0,255,127,0.3)] dark:hover:shadow-[0_0_16px_rgba(0,255,127,0.5)] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Agendar 1:1</span>
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onClose={() => setOpen(false)}
          className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl dark:bg-[#121212] dark:border-[#00FF7F]/40 dark:text-white"
        >
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white text-base sm:text-lg font-bold">
              Agendar Reunião 1:1
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-[#A1A1AA] text-xs">
              Crie um espaço estruturado para alinhamentos individuais periódicos com registro em banco de dados.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                Colaborador *
              </label>
              {employees.length > 0 ? (
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                      {emp.full_name} ({emp.job_title})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="Nome do colaborador (ex: Carlos Alberto)"
                  value={customEmployeeName}
                  onChange={(e) => setCustomEmployeeName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
                />
              )}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                Data e Horário *
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                Pauta / Notas Iniciais
              </label>
              <textarea
                placeholder="Ex: Como foi a semana? Quais foram os maiores bloqueios? Como posso te apoiar?"
                rows={3}
                value={managerNotes}
                onChange={(e) => setManagerNotes(e.target.value)}
                className="w-full p-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:placeholder-[#A1A1AA] dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                Primeiro Compromisso / Item de Ação (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Revisar PR pendente até sexta-feira"
                value={actionItemText}
                onChange={(e) => setActionItemText(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:placeholder-[#A1A1AA] dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="h-9 px-4 rounded-lg bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-9 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black font-bold text-xs transition-all dark:shadow-[0_0_10px_rgba(0,255,127,0.3)] cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>Confirmar Agendamento</span>
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}