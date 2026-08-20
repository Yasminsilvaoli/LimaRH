'use client'

import { useState } from 'react'
import { KanbanCandidateItem, STAGES_CONFIG } from '@/lib/mock-data'
import {
  Star,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Phone,
  Mail,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdmitCandidateDialog } from '@/components/modules/ats/admit-candidate-dialog'
import { ApplicationStageType } from '@/types'

interface CandidateCardProps {
  candidate: KanbanCandidateItem
  onMoveStage: (candidateId: string, nextStage: ApplicationStageType) => void
  onAdmitSuccess: (candidate: KanbanCandidateItem) => void
}

export function CandidateCard({
  candidate,
  onMoveStage,
  onAdmitSuccess,
}: CandidateCardProps) {
  const [showAdmitModal, setShowAdmitModal] = useState(false)
  const currentStageIndex = STAGES_CONFIG.findIndex(
    (s) => s.id === candidate.stage
  )

  const canMoveForward = currentStageIndex < STAGES_CONFIG.length - 1
  const canMoveBackward = currentStageIndex > 0

  const handleNext = () => {
    if (canMoveForward) {
      onMoveStage(candidate.candidate_id, STAGES_CONFIG[currentStageIndex + 1].id)
    }
  }

  const handlePrev = () => {
    if (canMoveBackward) {
      onMoveStage(candidate.candidate_id, STAGES_CONFIG[currentStageIndex - 1].id)
    }
  }

  return (
    <>
      <div className="p-2.5 sm:p-3 bg-white border border-slate-200 shadow-xs hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-lg transition-all space-y-2 sm:space-y-2.5 group">
        {/* Header with Name & Rating */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 leading-tight">
              {candidate.full_name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
              <Mail className="h-3 w-3 text-slate-400 dark:text-zinc-500" />
              <span className="truncate max-w-[140px] sm:max-w-[150px]">{candidate.email}</span>
            </p>
          </div>

          {candidate.rating && (
            <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <Star className="h-3 w-3 fill-amber-400" />
              <span>{candidate.rating}.0</span>
            </div>
          )}
        </div>

        {/* Notes preview if any */}
        {candidate.feedback_notes && (
          <p className="text-[11px] text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/60 p-2 rounded border border-slate-100 dark:border-zinc-700/50 italic line-clamp-2">
            "{candidate.feedback_notes}"
          </p>
        )}

        {/* Links */}
        <div className="flex items-center gap-2 pt-1">
          {candidate.linkedin_url && (
            <a
              href={candidate.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-medium"
            >
              <ExternalLink className="h-2.5 w-2.5" />
              LinkedIn
            </a>
          )}
          {candidate.resume_url && (
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 flex items-center gap-0.5">
              <FileText className="h-2.5 w-2.5" />
              Currículo
            </span>
          )}
        </div>

        {/* Card Actions & Transition */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-1">
          {/* Move stages */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={!canMoveBackward}
              title="Voltar etapa"
              className="h-6 w-6 rounded border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canMoveForward}
              title="Avançar etapa"
              className="h-6 w-6 rounded border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Botão de Admissão no HRIS se Aprovado */}
          {candidate.stage === 'aprovado' ? (
            <Button
              size="sm"
              onClick={() => setShowAdmitModal(true)}
              className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0 gap-1 shadow-xs"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Admitir
            </Button>
          ) : (
            <button
              onClick={() => onMoveStage(candidate.candidate_id, 'aprovado')}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline"
            >
              Aprovar
            </button>
          )}
        </div>
      </div>

      <AdmitCandidateDialog
        candidate={candidate}
        open={showAdmitModal}
        onOpenChange={setShowAdmitModal}
        onSuccess={onAdmitSuccess}
      />
    </>
  )
}
