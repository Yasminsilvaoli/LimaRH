'use client'

import { useState } from 'react'
import { KanbanCandidateItem, STAGES_CONFIG } from '@/lib/mock-data'
import { CandidateCard } from '@/components/modules/ats/candidate-card'
import { ApplicationStageType } from '@/types'
import { Users, Filter } from 'lucide-react'

interface KanbanBoardProps {
  initialCandidates: KanbanCandidateItem[]
  jobId: string
}

export function KanbanBoard({ initialCandidates, jobId }: KanbanBoardProps) {
  const [candidates, setCandidates] = useState<KanbanCandidateItem[]>(
    initialCandidates.filter((c) => c.job_id === jobId)
  )

  const handleMoveStage = (
    candidateId: string,
    nextStage: ApplicationStageType
  ) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.candidate_id === candidateId ? { ...c, stage: nextStage } : c
      )
    )
  }

  const handleAdmitSuccess = (candidate: KanbanCandidateItem) => {
    // Remover ou marcar como admitido
    setCandidates((prev) =>
      prev.filter((c) => c.candidate_id !== candidate.candidate_id)
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start min-h-[calc(100vh-220px)]">
      {STAGES_CONFIG.map((stage) => {
        const stageCandidates = candidates.filter((c) => c.stage === stage.id)

        return (
          <div
            key={stage.id}
            className={`w-64 sm:w-72 shrink-0 rounded-xl border border-slate-200 bg-slate-100/70 dark:bg-zinc-900/60 dark:border-zinc-800 flex flex-col max-h-[calc(100vh-230px)] shadow-xs ${stage.color}`}
          >
            {/* Stage Column Header */}
            <div className="p-2.5 sm:p-3 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 tracking-tight">
                  {stage.label}
                </span>
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-[10px] font-bold flex items-center justify-center">
                  {stageCandidates.length}
                </span>
              </div>
            </div>

            {/* Cards Container */}
            <div className="p-2 sm:p-2.5 space-y-2 sm:space-y-2.5 overflow-y-auto flex-1">
              {stageCandidates.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200/90 rounded-lg">
                  <p className="text-[11px] text-slate-400 font-medium">Nenhum candidato</p>
                </div>
              ) : (
                stageCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.candidate_id}
                    candidate={candidate}
                    onMoveStage={handleMoveStage}
                    onAdmitSuccess={handleAdmitSuccess}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
