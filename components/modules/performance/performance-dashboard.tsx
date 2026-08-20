'use client'

import { useState } from 'react'
import { OneOnOnesTab } from '@/components/modules/performance/one-on-ones-tab'
import { FeedbacksTab } from '@/components/modules/performance/feedbacks-tab'
import { PDITab } from '@/components/modules/performance/pdi-tab'
import { MessageSquare, Sparkles, Target } from 'lucide-react'

type TabType = '1on1' | 'feedback' | 'pdi'

export function PerformanceDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('1on1')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Gestão de Performance & Desenvolvimento
        </h1>
        <p className="text-sm text-slate-500 dark:text-[#A1A1AA] mt-1">
          Alinhe expectativas, reconheça entregas com o método SBI e impulsione planos de carreira.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('1on1')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === '1on1'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-light)] rounded-t-lg dark:border-[#00FF7F] dark:text-[#00FF7F] dark:bg-[#00FF7F]/10 dark:shadow-[0_0_12px_rgba(0,255,127,0.15)]'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-[#A1A1AA] dark:hover:text-white dark:hover:bg-white/5'
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
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-light)] rounded-t-lg dark:border-[#00FF7F] dark:text-[#00FF7F] dark:bg-[#00FF7F]/10 dark:shadow-[0_0_12px_rgba(0,255,127,0.15)]'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-[#A1A1AA] dark:hover:text-white dark:hover:bg-white/5'
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
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-light)] rounded-t-lg dark:border-[#00FF7F] dark:text-[#00FF7F] dark:bg-[#00FF7F]/10 dark:shadow-[0_0_12px_rgba(0,255,127,0.15)]'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-[#A1A1AA] dark:hover:text-white dark:hover:bg-white/5'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Planos de Desenvolvimento (PDI)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === '1on1' && <OneOnOnesTab initialData={[]} />}
        {activeTab === 'feedback' && <FeedbacksTab initialData={[]} />}
        {activeTab === 'pdi' && <PDITab initialData={[]} />}
      </div>
    </div>
  )
}