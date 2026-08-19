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
        className="h-9 px-4 rounded-lg bg-[#00FF7F] hover:bg-[#00FA9A] text-black font-bold text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,127,0.3)] hover:shadow-[0_0_16px_rgba(0,255,127,0.5)] transition-all cursor-pointer"
      >
        <Plus className="h-4 w-4 text-black stroke-[2.5]" />
        <span>Registrar Feedback SBI</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onClose={() => setOpen(false)}
          className="max-w-lg bg-[#121212] border border-[#00FF7F]/40 text-white shadow-2xl"
        >
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">
              Novo Feedback Estruturado (Modelo SBI)
            </DialogTitle>
            <DialogDescription className="text-[#A1A1AA] text-xs">
              Garanta clareza objetiva separando Situação (Contexto), Comportamento (Ação) e Impacto (Resultado).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-white font-semibold mb-1">
                  Destinatário *
                </label>
                <select
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[#000000] border border-white/20 text-white focus:outline-none focus:border-[#00FF7F] focus:ring-1 focus:ring-[#00FF7F] text-xs"
                >
                  <option value="Lucas Silveira Mendes" className="bg-[#121212] text-white">
                    Lucas Silveira Mendes
                  </option>
                  <option value="Mariana Duarte Costa" className="bg-[#121212] text-white">
                    Mariana Duarte Costa
                  </option>
                  <option value="Rodrigo Barbosa Alencar" className="bg-[#121212] text-white">
                    Rodrigo Barbosa Alencar
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">
                  Tipo de Feedback *
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  className="w-full h-9 px-3 rounded-lg bg-[#000000] border border-white/20 text-white focus:outline-none focus:border-[#00FF7F] focus:ring-1 focus:ring-[#00FF7F] text-xs"
                >
                  <option value="elogio" className="bg-[#121212] text-white">
                    Elogio / Reconhecimento
                  </option>
                  <option value="orientacao" className="bg-[#121212] text-white">
                    Orientação de Ajuste
                  </option>
                  <option value="alinhamento" className="bg-[#121212] text-white">
                    Alinhamento de Expectativas
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-1">
                S - Situação (Onde e quando aconteceu?) *
              </label>
              <textarea
                required
                placeholder="Ex: Durante a reunião de sprint review de quarta-feira passada..."
                rows={2}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#000000] border border-white/20 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#00FF7F] focus:ring-1 focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-1">
                B - Comportamento (Qual foi a ação observável?) *
              </label>
              <textarea
                required
                placeholder="Ex: Você apresentou a arquitetura da nova feature com clareza e antecipou riscos técnicos..."
                rows={2}
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#000000] border border-white/20 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#00FF7F] focus:ring-1 focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-1">
                I - Impacto (Qual foi o resultado gerado para o time/negócio?) *
              </label>
              <textarea
                required
                placeholder="Ex: Isso aumentou a confiança do cliente e economizou 2 semanas de retrabalho do time..."
                rows={2}
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#000000] border border-white/20 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#00FF7F] focus:ring-1 focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 px-4 rounded-lg bg-transparent border border-white/20 text-white hover:bg-white/10 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-[#00FF7F] hover:bg-[#00FA9A] text-black font-bold text-xs transition-all shadow-[0_0_10px_rgba(0,255,127,0.3)] cursor-pointer"
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