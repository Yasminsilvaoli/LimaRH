'use client'

import { useState } from 'react'
import { DisciplinaryTab } from '@/components/modules/ocorrencias/disciplinary-tab'
import { MedicalCertificatesTab } from '@/components/modules/ocorrencias/medical-certificates-tab'
import { ShieldAlert, HeartPulse } from 'lucide-react'

type TabType = 'disciplinary' | 'certificates'

export function OcorrenciasDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('disciplinary')

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
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'disciplinary'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--accent)] rounded-t-lg'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Medidas Disciplinares</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'certificates'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--accent)] rounded-t-lg'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <HeartPulse className="h-4 w-4" />
          <span>Atestados Médicos</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'disciplinary' && (
          <DisciplinaryTab initialData={[]} />
        )}
        {activeTab === 'certificates' && (
          <MedicalCertificatesTab initialData={[]} />
        )}
      </div>
    </div>
  )
}
