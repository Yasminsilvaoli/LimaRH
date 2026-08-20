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
import { FeedbackWithUsers } from '@/lib/performance-mock'
import { FeedbackType } from '@/types'

interface NewFeedbackSBIDialogProps {
  onAddFeedback: (feedback: FeedbackWithUsers) => void
}

export function NewFeedbackSBIDialog({ onAddFeedback }: NewFeedbackSBIDialogProps) {
  const [open, setOpen] = useState(false)
  const [toName, setToName] = useState('Lucas Silveira Mendes')
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('elogio')
  const [situation, setSituation] = useState('')
  const [behavior, setBehavior] = useState('')
  const [impact, setImpact] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!situation.trim() || !behavior.trim() || !impact.trim()) return

    const newFeedback: FeedbackWithUsers = {
      id: `fb-${Date.now()}`,
      organization_id: 'org-1',
      from_id: 'mgr-1',
      to_id: 'emp-1',
      from_name: 'Carlos Eduardo Ramos',
      from_role: 'CTO',
      to_name: toName,
      to_role: 'Engenharia / Design',
      feedback_type: feedbackType,
      situation,
      behavior,
      impact,
      is_anonymous: false,
      created_at: new Date().toISOString(),
    }

    onAddFeedback(newFeedback)
    setOpen(false)
    setSituation('')
    setBehavior('')
    setImpact('')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black font-bold text-xs flex items-center gap-2 dark:shadow-[0_0_12px_rgba(0,255,127,0.3)] dark:hover:shadow-[0_0_16px_rgba(0,255,127,0.5)] transition-all cursor-pointer"
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
        <span>Registrar Feedback SBI</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onClose={() => setOpen(false)}
          className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl dark:bg-[#121212] dark:border-[#00FF7F]/40 dark:text-white"
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
                  Destinatário *
                </label>
                <select
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
                >
                  <option value="Lucas Silveira Mendes" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                    Lucas Silveira Mendes
                  </option>
                  <option value="Mariana Duarte Costa" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                    Mariana Duarte Costa
                  </option>
                  <option value="Rodrigo Barbosa Alencar" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                    Rodrigo Barbosa Alencar
                  </option>
                </select>
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
                    Orientação de Ajuste
                  </option>
                  <option value="alinhamento" className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                    Alinhamento de Expectativas
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                S - Situação (Onde e quando aconteceu?) *
              </label>
              <textarea
                required
                placeholder="Ex: Durante a reunião de sprint review de quarta-feira passada..."
                rows={2}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:placeholder-[#A1A1AA] dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                B - Comportamento (Qual foi a ação observável?) *
              </label>
              <textarea
                required
                placeholder="Ex: Você apresentou a arquitetura da nova feature com clareza e antecipou riscos técnicos..."
                rows={2}
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:placeholder-[#A1A1AA] dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                I - Impacto (Qual foi o resultado gerado para o time/negócio?) *
              </label>
              <textarea
                required
                placeholder="Ex: Isso aumentou a confiança do cliente e economizou 2 semanas de retrabalho do time..."
                rows={2}
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:placeholder-[#A1A1AA] dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs resize-none"
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
                Salvar Feedback SBI
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}