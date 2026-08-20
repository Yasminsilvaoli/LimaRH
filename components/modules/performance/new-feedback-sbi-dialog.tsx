'use client'

import { useState, useEffect } from 'react'
import { Plus, Sparkles, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { FeedbackWithUsers } from '@/lib/performance-mock'
import { FeedbackType, EmployeeWithDetails } from '@/types'
import { createFeedback } from '@/lib/services/feedbacks'
import { fetchEmployees } from '@/lib/services/employees'

interface NewFeedbackSBIDialogProps {
  onAddFeedback: (feedback: FeedbackWithUsers) => void
  trigger?: React.ReactNode
}

export function NewFeedbackSBIDialog({ onAddFeedback, trigger }: NewFeedbackSBIDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [customToName, setCustomToName] = useState('')
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('elogio')
  const [situation, setSituation] = useState('')
  const [behavior, setBehavior] = useState('')
  const [impact, setImpact] = useState('')

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
    if (!situation.trim() || !behavior.trim() || !impact.trim()) return

    let toName = customToName.trim()
    if (selectedEmployeeId && employees.length > 0) {
      const found = employees.find((emp) => emp.id === selectedEmployeeId)
      if (found) toName = found.full_name
    }

    if (!toName) return

    setIsSubmitting(true)
    try {
      const fb = await createFeedback({
        to_name: toName,
        feedback_type: feedbackType,
        situation,
        behavior,
        impact,
      })

      if (fb) {
        onAddFeedback(fb)
        setOpen(false)
        setSituation('')
        setBehavior('')
        setImpact('')
        setCustomToName('')
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
          <span>Registrar Feedback SBI</span>
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onClose={() => setOpen(false)}
          className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl dark:bg-[#121212] dark:border-[#00FF7F]/40 dark:text-white max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white text-base sm:text-lg font-bold">
              Novo Feedback Estruturado (Modelo SBI)
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-[#A1A1AA] text-xs">
              Garanta clareza objetiva separando Situação (Contexto), Comportamento (Ação) e Impacto (Resultado).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                  Colaborador Receptor *
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
                    placeholder="Nome do colaborador receptor"
                    value={customToName}
                    onChange={(e) => setCustomToName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                  Tipo de Feedback *
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
                >
                  <option value="elogio" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                    Elogio / Reconhecimento
                  </option>
                  <option value="orientacao" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                    Orientação / Ponto de Melhoria
                  </option>
                  <option value="alinhamento" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                    Alinhamento Geral
                  </option>
                </select>
              </div>
            </div>

            {/* S - Situation */}
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl space-y-1">
              <label className="block font-bold text-blue-900 dark:text-blue-300 text-xs">
                S • Situação (Quando e onde aconteceu?) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Ex: Na reunião de release da última quinta-feira à tarde..."
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-blue-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-[#000000] dark:border-white/20 dark:text-white dark:placeholder-[#A1A1AA] dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            {/* B - Behavior */}
            <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl space-y-1">
              <label className="block font-bold text-amber-900 dark:text-amber-300 text-xs">
                B • Comportamento (Qual foi a ação observável?) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Ex: Você identificou um gargalo na query e apresentou uma alternativa estruturada..."
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-amber-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:bg-[#000000] dark:border-white/20 dark:text-white dark:placeholder-[#A1A1AA] dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            {/* I - Impact */}
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-1">
              <label className="block font-bold text-emerald-900 dark:text-emerald-300 text-xs">
                I • Impacto (Qual foi o resultado gerado?) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Ex: Isso garantiu que o deploy ocorresse sem instabilidades para milhares de usuários..."
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-emerald-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-[#000000] dark:border-white/20 dark:text-white dark:placeholder-[#A1A1AA] dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs resize-none"
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
                    <span>Registrando...</span>
                  </>
                ) : (
                  <span>Salvar Feedback</span>
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}