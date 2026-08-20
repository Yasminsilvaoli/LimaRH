'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { OneOnOneWithUsers } from '@/lib/performance-mock'

interface New1on1DialogProps {
  onAdd1on1: (meeting: OneOnOneWithUsers) => void
}

export function New1on1Dialog({ onAdd1on1 }: New1on1DialogProps) {
  const [open, setOpen] = useState(false)
  const [employeeName, setEmployeeName] = useState('Lucas Silveira Mendes')
  const [scheduledAt, setScheduledAt] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  )
  const [managerNotes, setManagerNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newMeeting: OneOnOneWithUsers = {
      id: `1on1-${Date.now()}`,
      organization_id: 'org-1',
      manager_id: 'mgr-1',
      employee_id: 'emp-1',
      manager_name: 'Ana Paula Rocha (Gestor)',
      employee_name: employeeName,
      employee_role: 'Engenharia / Design',
      scheduled_at: new Date(scheduledAt).toISOString(),
      status: 'agendada',
      manager_notes: managerNotes || 'Reunião de alinhamento e acompanhamento quinzenal.',
      employee_notes: null,
      action_items: [
        { id: `act-${Date.now()}-1`, text: 'Validar entregas do sprint e alinhar expectativas', done: false },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onAdd1on1(newMeeting)
    setOpen(false)
    setManagerNotes('')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black font-bold text-xs flex items-center gap-2 dark:shadow-[0_0_12px_rgba(0,255,127,0.3)] dark:hover:shadow-[0_0_16px_rgba(0,255,127,0.5)] transition-all cursor-pointer"
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
        <span>Agendar 1:1</span>
      </button>

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
              Crie um espaço seguro e estruturado para alinhamentos individuais periódicos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                Colaborador *
              </label>
              <select
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
              >
                <option value="Lucas Silveira Mendes" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                  Lucas Silveira Mendes (Dev Full Stack)
                </option>
                <option value="Mariana Duarte Costa" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                  Mariana Duarte Costa (Product Designer)
                </option>
                <option value="Rodrigo Barbosa Alencar" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                  Rodrigo Barbosa Alencar (Dev Backend)
                </option>
              </select>
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
                Tópicos Sugeridos / Pauta do Gestor
              </label>
              <textarea
                placeholder="Ex: Como foi a semana? Quais foram os maiores bloqueios? Como posso te apoiar?"
                rows={3}
                value={managerNotes}
                onChange={(e) => setManagerNotes(e.target.value)}
                className="w-full p-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:placeholder-[#A1A1AA] dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 px-4 rounded-lg bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black font-bold text-xs transition-all dark:shadow-[0_0_10px_rgba(0,255,127,0.3)] cursor-pointer"
              >
                Confirmar Agendamento
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}