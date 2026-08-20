'use client'

import { useState, useEffect } from 'react'
import { Plus, Target, CheckCircle2, Circle, Calendar, Trash2, Loader2 } from 'lucide-react'
import { PDIWithGoals } from '@/lib/performance-mock'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { fetchPDIs, createPDI, updatePDIGoalStatus, deletePDI } from '@/lib/services/pdis'
import { fetchEmployees } from '@/lib/services/employees'
import { EmployeeWithDetails } from '@/types'

interface PDITabProps {
  initialData?: PDIWithGoals[]
}

export function PDITab({ initialData = [] }: PDITabProps) {
  const [pdis, setPdis] = useState<PDIWithGoals[]>(initialData)
  const [isLoading, setIsLoading] = useState(initialData.length === 0)
  const [openNewPdi, setOpenNewPdi] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [customEmployeeName, setCustomEmployeeName] = useState('')
  const [pdiTitle, setPdiTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goal1, setGoal1] = useState('')
  const [goal2, setGoal2] = useState('')

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const data = await fetchPDIs()
        if (isMounted) setPdis(data)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (openNewPdi) {
      fetchEmployees().then((data) => {
        setEmployees(data)
        if (data.length > 0) {
          setSelectedEmployeeId(data[0].id)
        }
      })
    }
  }, [openNewPdi])

  const handleToggleGoal = async (pdiId: string, goalId: string) => {
    const targetPdi = pdis.find((p) => p.id === pdiId)
    if (!targetPdi) return
    const targetGoal = targetPdi.goals.find((g) => g.id === goalId)
    if (!targetGoal) return

    const isCompleted = targetGoal.status === 'concluido'
    const newStatus = isCompleted ? ('em_andamento' as const) : ('concluido' as const)
    const completedAt = isCompleted ? null : new Date().toISOString()

    // Otimista
    setPdis((prev) =>
      prev.map((pdi) => {
        if (pdi.id !== pdiId) return pdi
        const updatedGoals = pdi.goals.map((g) => {
          if (g.id !== goalId) return g
          return {
            ...g,
            status: newStatus,
            completed_at: completedAt,
          }
        })
        return { ...pdi, goals: updatedGoals }
      })
    )

    await updatePDIGoalStatus(goalId, newStatus, completedAt)
  }

  const handleDeletePDI = async (pdiId: string, title: string) => {
    if (!confirm(`Deseja excluir o plano "${title}"?`)) return
    const success = await deletePDI(pdiId)
    if (success) {
      setPdis((prev) => prev.filter((p) => p.id !== pdiId))
    }
  }

  const handleCreatePDI = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pdiTitle.trim()) return

    let empName = customEmployeeName.trim()
    let empRole = 'Engenharia / Produto'

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
      const goalsPayload: { title: string; deadline: string }[] = []
      if (goal1.trim()) {
        goalsPayload.push({ title: goal1.trim(), deadline: '2026-12-31' })
      }
      if (goal2.trim()) {
        goalsPayload.push({ title: goal2.trim(), deadline: '2026-12-31' })
      }

      const created = await createPDI({
        employee_name: empName,
        employee_role: empRole,
        title: pdiTitle,
        description,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '2026-12-31',
        goals: goalsPayload,
      })

      if (created) {
        setPdis((prev) => [created, ...prev])
        setOpenNewPdi(false)
        setPdiTitle('')
        setDescription('')
        setGoal1('')
        setGoal2('')
        setCustomEmployeeName('')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Planos de Desenvolvimento Individual (PDI)
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-0.5">
            Acompanhe o avanço de carreira e metas de desenvolvimento de competências.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenNewPdi(true)}
          className="h-9 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black font-bold text-xs flex items-center gap-2 shadow-sm dark:shadow-[0_0_12px_rgba(0,255,127,0.3)] dark:hover:shadow-[0_0_16px_rgba(0,255,127,0.5)] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Criar Novo PDI</span>
        </button>
      </div>

      {isLoading ? (
        <div className="led-card p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)] dark:text-[#00FF7F]" />
          <p className="text-xs text-[var(--muted-foreground)] font-medium">Carregando Planos de Desenvolvimento...</p>
        </div>
      ) : pdis.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhum PDI cadastrado"
          description="Crie o primeiro Plano de Desenvolvimento Individual para estruturar metas e evolução de carreira dos membros da equipe."
          actionNode={
            <button
              type="button"
              onClick={() => setOpenNewPdi(true)}
              className="h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black dark:shadow-[0_0_15px_rgba(0,255,127,0.3)]"
            >
              <Target className="h-4 w-4" />
              <span>Criar Primeiro PDI</span>
            </button>
          }
        />
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {pdis.map((pdi) => {
            const totalGoals = pdi.goals.length
            const completedGoals = pdi.goals.filter((g) => g.status === 'concluido').length
            const progress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

            return (
              <div
                key={pdi.id}
                className={[
                  'rounded-xl p-4 sm:p-6 transition-all',
                  'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300',
                  'dark:bg-[#000000] dark:border-[#00FF7F] dark:shadow-[0_0_15px_rgba(0,255,127,0.12)] dark:hover:shadow-[0_0_20px_rgba(0,255,127,0.22)]',
                ].join(' ')}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-[#006400] dark:text-white">
                        PDI ATIVO
                      </span>
                      <span className="text-xs text-slate-400 dark:text-[#A1A1AA]">
                        Ciclo: {new Date(pdi.start_date).getFullYear()}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {pdi.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#00BFFF]">
                      Colaborador: <strong className="text-slate-700 dark:text-white">{pdi.employee_name}</strong> ({pdi.employee_role})
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-left sm:text-right">
                      <p className="text-[11px] text-slate-400 dark:text-[#A1A1AA] font-semibold">Progresso Global</p>
                      <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#00FF7F]">
                        {progress}%
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePDI(pdi.id, pdi.title)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded"
                      title="Excluir PDI"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {pdi.description && (
                  <p className="text-xs text-slate-600 dark:text-zinc-300 pt-3 pb-2 leading-relaxed">
                    {pdi.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="my-3 sm:my-4 h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] dark:bg-[#00FF7F] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Goals Checklist */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-white tracking-wide uppercase">
                    Metas & Entregas do Ciclo ({completedGoals}/{totalGoals})
                  </p>

                  <div className="space-y-2">
                    {pdi.goals.map((goal) => {
                      const isDone = goal.status === 'concluido'
                      return (
                        <div
                          key={goal.id}
                          onClick={() => handleToggleGoal(pdi.id, goal.id)}
                          className={[
                            'flex items-start justify-between p-3 rounded-lg cursor-pointer transition-all border text-xs',
                            isDone
                              ? 'bg-slate-50 border-slate-200 dark:bg-zinc-900/40 dark:border-zinc-800 opacity-80'
                              : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-[#00FF7F]/50',
                          ].join(' ')}
                        >
                          <div className="flex items-start gap-2.5">
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-[#00FF7F] shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="h-4 w-4 text-slate-300 dark:text-zinc-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className={`font-semibold ${isDone ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-100'}`}>
                                {goal.title}
                              </p>
                              {goal.description && (
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                                  {goal.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-zinc-500 shrink-0 ml-2">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
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
      )}

      {/* Modal Criar PDI */}
      <Dialog open={openNewPdi} onOpenChange={setOpenNewPdi}>
        <DialogContent
          onClose={() => setOpenNewPdi(false)}
          className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl dark:bg-[#121212] dark:border-[#00FF7F]/40 dark:text-white max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white text-base sm:text-lg font-bold">
              Estruturar Novo PDI
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-[#A1A1AA] text-xs">
              Defina o foco do ciclo e adicione metas acionáveis para o colaborador.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePDI} className="space-y-4 text-xs mt-2">
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
                  placeholder="Nome do colaborador"
                  value={customEmployeeName}
                  onChange={(e) => setCustomEmployeeName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
                />
              )}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                Título do Plano de Carreira / Foco *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Transição para Engenheiro(a) Sênior"
                value={pdiTitle}
                onChange={(e) => setPdiTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-white font-semibold mb-1">
                Objetivo e Descrição Geral
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Aprofundar conhecimentos em arquitetura, mentoria de juniores e boas práticas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs resize-none"
              />
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-white/10">
              <label className="block text-slate-700 dark:text-white font-semibold">
                Metas Acionáveis
              </label>

              <input
                type="text"
                placeholder="Meta 1: Ex: Obter certificação Cloud Solutions Architect"
                value={goal1}
                onChange={(e) => setGoal1(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
              />

              <input
                type="text"
                placeholder="Meta 2: Ex: Conduzir mentoria técnica com 1 dev do time"
                value={goal2}
                onChange={(e) => setGoal2(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setOpenNewPdi(false)}
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
                    <span>Criando PDI...</span>
                  </>
                ) : (
                  <span>Criar PDI</span>
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}