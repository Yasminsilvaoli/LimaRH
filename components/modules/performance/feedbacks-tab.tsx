'use client'

import { useState, useEffect } from 'react'
import { FeedbackWithUsers } from '@/lib/performance-mock'
import { NewFeedbackSBIDialog } from '@/components/modules/performance/new-feedback-sbi-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { fetchFeedbacks, deleteFeedback } from '@/lib/services/feedbacks'
import { Calendar, Sparkles, Trash2, Loader2 } from 'lucide-react'

interface FeedbacksTabProps {
  initialData?: FeedbackWithUsers[]
}

export function FeedbacksTab({ initialData = [] }: FeedbacksTabProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackWithUsers[]>(initialData)
  const [isLoading, setIsLoading] = useState(initialData.length === 0)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const data = await fetchFeedbacks()
        if (isMounted) setFeedbacks(data)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const handleAddFeedback = (feedback: FeedbackWithUsers) => {
    setFeedbacks((prev) => [feedback, ...prev])
  }

  const handleDeleteFeedback = async (id: string, toName: string) => {
    if (!confirm(`Deseja excluir o feedback para ${toName}?`)) return
    const success = await deleteFeedback(id)
    if (success) {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id))
    }
  }

  // Light mode badge styles
  const getBadgeStyleLight = (type: string) => {
    switch (type) {
      case 'elogio':    return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'orientacao':return 'bg-amber-100 text-amber-800 border-amber-200'
      default:          return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  // Dark mode badge styles
  const getBadgeStyleDark = (type: string) => {
    switch (type) {
      case 'elogio':    return 'dark:bg-[#006400] dark:text-white dark:border-emerald-500/30'
      case 'orientacao':return 'dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/30'
      default:          return 'dark:bg-[#0047AB] dark:text-white dark:border-blue-500/30'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Feedbacks Contínuos (Modelo SBI)
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-0.5">
            Registro estruturado de situações, comportamentos e impactos gerados no ecossistema.
          </p>
        </div>

        <NewFeedbackSBIDialog onAddFeedback={handleAddFeedback} />
      </div>

      {isLoading ? (
        <div className="led-card p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)] dark:text-[#00FF7F]" />
          <p className="text-xs text-[var(--muted-foreground)] font-medium">Carregando histórico de feedbacks...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nenhum feedback registrado"
          description="Estimule uma cultura de reconhecimento e melhoria contínua registrando feedbacks objetivos no modelo SBI."
          actionNode={
            <NewFeedbackSBIDialog
              onAddFeedback={handleAddFeedback}
              trigger={
                <button
                  type="button"
                  className="h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black dark:shadow-[0_0_15px_rgba(0,255,127,0.3)]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Registrar Primeiro Feedback</span>
                </button>
              }
            />
          }
        />
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => {
            const createdAt = new Date(fb.created_at)

            return (
              <div
                key={fb.id}
                className={[
                  'rounded-xl p-3.5 sm:p-5 transition-all',
                  'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300',
                  'dark:bg-[#000000] dark:border-[#00FF7F] dark:shadow-[0_0_15px_rgba(0,255,127,0.12)] dark:hover:shadow-[0_0_20px_rgba(0,255,127,0.22)]',
                ].join(' ')}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border
                        ${getBadgeStyleLight(fb.feedback_type)}
                        ${getBadgeStyleDark(fb.feedback_type)}`}
                    >
                      {fb.feedback_type === 'elogio'
                        ? 'Elogio'
                        : fb.feedback_type === 'orientacao'
                        ? 'Orientação'
                        : 'Alinhamento'}
                    </span>
                    <span className="text-xs text-slate-300 dark:text-[#A1A1AA]">•</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-[#00BFFF]">
                      De {fb.from_name} ({fb.from_role}) para{' '}
                      <span className="text-slate-900 dark:text-white">{fb.to_name}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-[#A1A1AA]">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{createdAt.toLocaleDateString('pt-BR')}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteFeedback(fb.id, fb.to_name)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded"
                      title="Excluir feedback"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* SBI Content */}
                <div className="pt-3 sm:pt-4 space-y-2.5 sm:space-y-3 text-xs">
                  {/* Situation */}
                  <div className="flex gap-2.5 items-start">
                    <span className="px-2 py-0.5 rounded font-bold shrink-0 text-[10px] tracking-wide bg-blue-100 text-blue-800 dark:bg-[#0047AB] dark:text-white">
                      SITUAÇÃO
                    </span>
                    <p className="text-slate-700 dark:text-white leading-relaxed">{fb.situation}</p>
                  </div>

                  {/* Behavior */}
                  <div className="flex gap-2.5 items-start">
                    <span className="px-2 py-0.5 rounded font-bold shrink-0 text-[10px] tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100">
                      COMPORTAMENTO
                    </span>
                    <p className="text-slate-700 dark:text-white leading-relaxed">{fb.behavior}</p>
                  </div>

                  {/* Impact */}
                  <div className="flex gap-2.5 items-start">
                    <span className="px-2 py-0.5 rounded font-bold shrink-0 text-[10px] tracking-wide bg-emerald-100 text-emerald-800 dark:bg-[#006400] dark:text-white">
                      IMPACTO
                    </span>
                    <p className="text-emerald-700 dark:text-[#00FF7F] leading-relaxed font-semibold">
                      {fb.impact}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}