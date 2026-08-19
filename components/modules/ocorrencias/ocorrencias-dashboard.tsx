'use client'

import { useState } from 'react'
import { DisciplinaryTab } from '@/components/modules/ocorrencias/disciplinary-tab'
import { MedicalCertificatesTab } from '@/components/modules/ocorrencias/medical-certificates-tab'
import {
  INITIAL_MOCK_DISCIPLINARY,
  INITIAL_MOCK_CERTIFICATES,
} from '@/lib/ocorrencias-mock'
import { ShieldAlert, HeartPulse } from 'lucide-react'

type TabType = 'disciplinary' | 'certificates'

export function OcorrenciasDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('disciplinary')

  const totalDisciplinary = INITIAL_MOCK_DISCIPLINARY.length
  const totalCertificates = INITIAL_MOCK_CERTIFICATES.length
  const pendingCertificates = INITIAL_MOCK_CERTIFICATES.filter(
    (c) => c.status === 'pendente'
  ).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Ocorrências & Saúde Ocupacional
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Registro formal de medidas disciplinares e gestão de atestados médicos com validação do RH.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[var(--border-subtle)] gap-2">
        <button
          onClick={() => setActiveTab('disciplinary')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'disciplinary'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--accent)] rounded-t-lg'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Medidas Disciplinares ({totalDisciplinary})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'certificates'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--accent)] rounded-t-lg'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <HeartPulse className="h-4 w-4" />
          <span>Atestados Médicos ({totalCertificates})</span>
          {pendingCertificates > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 text-[10px] font-bold">
              {pendingCertificates} pendente
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'disciplinary' && (
          <DisciplinaryTab initialData={INITIAL_MOCK_DISCIPLINARY} />
        )}
        {activeTab === 'certificates' && (
          <MedicalCertificatesTab initialData={INITIAL_MOCK_CERTIFICATES} />
        )}
      </div>
    </div>
  )
}
