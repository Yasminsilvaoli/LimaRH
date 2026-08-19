'use client'

import { useState } from 'react'
import { OneOnOnesTab } from '@/components/modules/performance/one-on-ones-tab'
import { FeedbacksTab } from '@/components/modules/performance/feedbacks-tab'
import { PDITab } from '@/components/modules/performance/pdi-tab'
import {
  INITIAL_MOCK_1ON1S,
  INITIAL_MOCK_FEEDBACKS,
  INITIAL_MOCK_PDIS,
} from '@/lib/performance-mock'
import { MessageSquare, Sparkles, Target } from 'lucide-react'

type TabType = '1on1' | 'feedback' | 'pdi'

export function PerformanceDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('1on1')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Gestão de Performance & Desenvolvimento
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Alinhe expectativas, reconheça entregas com o método SBI e impulsione planos de carreira.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('1on1')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === '1on1'
              ? 'border-[#00FF7F] text-[#00FF7F] bg-[#00FF7F]/10 rounded-t-lg shadow-[0_0_12px_rgba(0,255,127,0.15)]'
              : 'border-transparent text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Reuniões 1:1</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'feedback'
              ? 'border-[#00FF7F] text-[#00FF7F] bg-[#00FF7F]/10 rounded-t-lg shadow-[0_0_12px_rgba(0,255,127,0.15)]'
              : 'border-transparent text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Feedbacks (Modelo SBI)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pdi')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'pdi'
              ? 'border-[#00FF7F] text-[#00FF7F] bg-[#00FF7F]/10 rounded-t-lg shadow-[0_0_12px_rgba(0,255,127,0.15)]'
              : 'border-transparent text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Planos de Desenvolvimento (PDI)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === '1on1' && <OneOnOnesTab initialData={INITIAL_MOCK_1ON1S} />}
        {activeTab === 'feedback' && <FeedbacksTab initialData={INITIAL_MOCK_FEEDBACKS} />}
        {activeTab === 'pdi' && <PDITab initialData={INITIAL_MOCK_PDIS} />}
      </div>
    </div>
  )
}