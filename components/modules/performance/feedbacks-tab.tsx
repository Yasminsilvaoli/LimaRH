'use client'

import { useState } from 'react'
import { FeedbackWithUsers } from '@/lib/performance-mock'
import { NewFeedbackSBIDialog } from '@/components/modules/performance/new-feedback-sbi-dialog'
import { Calendar } from 'lucide-react'

interface FeedbacksTabProps {
  initialData: FeedbackWithUsers[]
}

export function FeedbacksTab({ initialData }: FeedbacksTabProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackWithUsers[]>(initialData)

  const handleAddFeedback = (feedback: FeedbackWithUsers) => {
    setFeedbacks((prev) => [feedback, ...prev])
  }

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'elogio':
        return 'bg-[#006400] text-white border-emerald-500/30'
      case 'orientacao':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/30'
      default:
        return 'bg-[#0047AB] text-white border-blue-500/30'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Feedbacks Contínuos (Modelo SBI)
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Registro estruturado de situações, comportamentos e impactos gerados no ecossistema.
          </p>
        </div>

        <NewFeedbackSBIDialog onAddFeedback={handleAddFeedback} />
      </div>

      <div className="space-y-4">
        {feedbacks.map((fb) => {
          const createdAt = new Date(fb.created_at)

          return (
            <div
              key={fb.id}
              className="bg-[#000000] border border-[#00FF7F] rounded-xl p-5 shadow-[0_0_15px_rgba(0,255,127,0.12)] hover:shadow-[0_0_20px_rgba(0,255,127,0.22)] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${getBadgeStyle(
                      fb.feedback_type
                    )}`}
                  >
                    {fb.feedback_type === 'elogio'
                      ? 'Elogio'
                      : fb.feedback_type === 'orientacao'
                      ? 'Orientação'
                      : 'Alinhamento'}
                  </span>
                  <span className="text-xs text-[#A1A1AA]">•</span>
                  <span className="text-xs font-semibold text-[#00BFFF]">
                    De {fb.from_name} ({fb.from_role}) para <span className="text-white">{fb.to_name}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* SBI Content: Directly on Card Dark Background */}
              <div className="pt-4 space-y-3 text-xs">
                {/* Situation */}
                <div className="flex gap-2.5 items-start">
                  <span className="px-2 py-0.5 rounded bg-[#0047AB] text-white font-bold shrink-0 text-[10px] tracking-wide">
                    SITUAÇÃO
                  </span>
                  <p className="text-white leading-relaxed">{fb.situation}</p>
                </div>

                {/* Behavior */}
                <div className="flex gap-2.5 items-start">
                  <span className="px-2 py-0.5 rounded bg-amber-800 text-amber-100 font-bold shrink-0 text-[10px] tracking-wide">
                    COMPORTAMENTO
                  </span>
                  <p className="text-white leading-relaxed">{fb.behavior}</p>
                </div>

                {/* Impact */}
                <div className="flex gap-2.5 items-start">
                  <span className="px-2 py-0.5 rounded bg-[#006400] text-white font-bold shrink-0 text-[10px] tracking-wide">
                    IMPACTO
                  </span>
                  <p className="text-[#00FF7F] leading-relaxed font-semibold">
                    {fb.impact}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}