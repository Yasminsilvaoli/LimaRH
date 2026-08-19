'use client'

import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { PDIWithGoals } from '@/lib/performance-mock'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { PDIGoal } from '@/types'

interface PDITabProps {
  initialData: PDIWithGoals[]
}

export function PDITab({ initialData }: PDITabProps) {
  const [pdis, setPdis] = useState<PDIWithGoals[]>(initialData)
  const [openNewPdi, setOpenNewPdi] = useState(false)

  // Form State
  const [employeeName, setEmployeeName] = useState('Lucas Silveira Mendes')
  const [pdiTitle, setPdiTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goal1, setGoal1] = useState('')
  const [goal2, setGoal2] = useState('')

  const handleToggleGoal = (pdiId: string, goalId: string) => {
    setPdis((prev) =>
      prev.map((pdi) => {
        if (pdi.id !== pdiId) return pdi
        const updatedGoals = pdi.goals.map((g) => {
          if (g.id !== goalId) return g
          const isCompleted = g.status === 'concluido'
          return {
            ...g,
            status: isCompleted ? ('em_andamento' as const) : ('concluido' as const),
            completed_at: isCompleted ? null : new Date().toISOString(),
          }
        })
        return { ...pdi, goals: updatedGoals }
      })
    )
  }

  const handleCreatePDI = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pdiTitle.trim()) return

    const newGoals: PDIGoal[] = []
    if (goal1.trim()) {
      newGoals.push({
        id: `g-${Date.now()}-1`,
        pdi_id: `pdi-${Date.now()}`,
        title: goal1,
        description: null,
        status: 'em_andamento',
        deadline: '2026-12-31',
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
    if (goal2.trim()) {
      newGoals.push({
        id: `g-${Date.now()}-2`,
        pdi_id: `pdi-${Date.now()}`,
        title: goal2,
        description: null,
        status: 'nao_iniciado',
        deadline: '2026-12-31',
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    const newPDI: PDIWithGoals = {
      id: `pdi-${Date.now()}`,
      organization_id: 'org-1',
      employee_id: 'emp-1',
      employee_name: employeeName,
      employee_role: 'Engenharia de Software',
      title: pdiTitle,
      description,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '2026-12-31',
      status: 'ativo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      goals: newGoals,
    }

    setPdis((prev) => [newPDI, ...prev])
    setOpenNewPdi(false)
    setPdiTitle('')
    setDescription('')
    setGoal1('')
    setGoal2('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Planos de Desenvolvimento Individual (PDI)
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Acompanhe o avanço de carreira e metas de desenvolvimento de competências.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenNewPdi(true)}
          className="h-9 px-4 rounded-lg bg-[#00FF7F] hover:bg-[#00FA9A] text-black font-bold text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,127,0.3)] hover:shadow-[0_0_16px_rgba(0,255,127,0.5)] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 text-black stroke-[2.5]" />
          <span>Criar Novo PDI</span>
        </button>
      </div>

      <div className="space-y-6">
        {pdis.map((pdi) => {
          const totalGoals = pdi.goals.length
          const completedGoals = pdi.goals.filter((g) => g.status === 'concluido').length
          const progressPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

          return (
            <div
              key={pdi.id}
              className="bg-[#000000] border border-[#00FF7F] rounded-xl p-5 shadow-[0_0_15px_rgba(0,255,127,0.12)] hover:shadow-[0_0_20px_rgba(0,255,127,0.22)] transition-all"
            >
              <div className="pb-4 border-b border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#006400] text-white">
                        PDI Ativo
                      </span>
                      <span className="text-xs text-[#A1A1AA]">•</span>
                      <span className="text-xs font-bold text-[#00BFFF]">
                        {pdi.employee_name} <span className="text-[#A1A1AA] font-normal">({pdi.employee_role})</span>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {pdi.title}
                    </h3>
                    {pdi.description && (
                      <p className="text-xs text-[#A1A1AA] mt-0.5">{pdi.description}</p>
                    )}
                  </div>

                  {/* Progress Indicator */}
                  <div className="sm:text-right shrink-0">
                    <p className="text-xs font-semibold text-[#A1A1AA]">Progresso Geral</p>
                    <div className="flex items-center gap-2.5 mt-1">
                      <div className="w-32 h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-[#00FF7F] transition-all duration-500 shadow-[0_0_8px_rgba(0,255,127,0.6)]"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#00FF7F]">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals List: Directly on Card Dark Background */}
              <div className="pt-4 space-y-3 text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5 text-xs">
                  <Target className="h-4 w-4 text-[#00FF7F]" />
                  <span>Metas & Marcos de Entrega ({completedGoals}/{totalGoals})</span>
                </p>

                <div className="space-y-2">
                  {pdi.goals.map((goal) => {
                    const isDone = goal.status === 'concluido'

                    return (
                      <div
                        key={goal.id}
                        onClick={() => handleToggleGoal(pdi.id, goal.id)}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          isDone
                            ? 'bg-[#121212]/60 border-white/5 opacity-75'
                            : 'bg-[#121212] border-white/10 hover:border-[#00FF7F]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isDone}
                            readOnly
                            className="rounded border-zinc-700 bg-black text-[#00FF7F] focus:ring-[#00FF7F] h-4 w-4 accent-[#00FF7F]"
                          />
                          <div>
                            <p className={`font-semibold text-xs ${isDone ? 'line-through text-[#A1A1AA]' : 'text-white'}`}>
                              {goal.title}
                            </p>
                            {goal.description && (
                              <p className="text-[11px] text-[#A1A1AA]">{goal.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-[#A1A1AA] font-medium hidden sm:inline">
                            Prazo: {goal.deadline}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              goal.status === 'concluido'
                                ? 'bg-[#006400] text-white'
                                : goal.status === 'em_andamento'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                : 'bg-zinc-800 text-[#A1A1AA]'
                            }`}
                          >
                            {goal.status === 'concluido'
                              ? 'Concluída'
                              : goal.status === 'em_andamento'
                              ? 'Em Andamento'
                              : 'Não Iniciada'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Novo PDI */}
      <Dialog open={openNewPdi} onOpenChange={setOpenNewPdi}>
        <DialogContent
          onClose={() => setOpenNewPdi(false)}
          className="max-w-lg bg-[#121212] border border-[#00FF7F]/40 text-white shadow-2xl"
        >
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">
              Criar Plano de Desenvolvimento Individual (PDI)
            </DialogTitle>
            <DialogDescription className="text-[#A1A1AA] text-xs">
              Estruture metas de curto e médio prazo para a evolução do colaborador.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePDI} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-white font-semibold mb-1">
                Colaborador *
              </label>
              <select
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
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
                Título do Plano *
              </label>
              <input
                required
                placeholder="Ex: Transição para Tech Lead / Especialista"
                value={pdiTitle}
                onChange={(e) => setPdiTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#000000] border border-white/20 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#00FF7F] focus:ring-1 focus:ring-[#00FF7F] text-xs"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-1">
                Objetivo Geral do PDI
              </label>
              <textarea
                rows={2}
                placeholder="Descreva as competências e resultados esperados..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#000000] border border-white/20 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#00FF7F] focus:ring-1 focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-white font-bold">
                Metas Iniciais (Opcional)
              </label>
              <input
                placeholder="Meta 1 (ex: Concluir curso de Arquitetura de Software)"
                value={goal1}
                onChange={(e) => setGoal1(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#000000] border border-white/20 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#00FF7F] focus:ring-1 focus:ring-[#00FF7F] text-xs"
              />
              <input
                placeholder="Meta 2 (ex: Liderar o redesign do módulo de documentos)"
                value={goal2}
                onChange={(e) => setGoal2(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#000000] border border-white/20 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#00FF7F] focus:ring-1 focus:ring-[#00FF7F] text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setOpenNewPdi(false)}
                className="h-9 px-4 rounded-lg bg-transparent border border-white/20 text-white hover:bg-white/10 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-[#00FF7F] hover:bg-[#00FA9A] text-black font-bold text-xs transition-all shadow-[0_0_10px_rgba(0,255,127,0.3)] cursor-pointer"
              >
                Criar PDI
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}