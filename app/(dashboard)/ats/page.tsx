import { Suspense } from 'react'
import { ATSDashboard } from '@/components/modules/ats/ats-dashboard'
import { INITIAL_MOCK_JOBS } from '@/lib/mock-data'

export const metadata = {
  title: 'Recrutamento & Seleção (ATS) | LimaRH',
  description: 'Gestão de vagas e pipeline de contratação do LimaRH',
}

export default function ATSPage() {
  return (
    <Suspense fallback={null}>
      <ATSDashboard initialJobs={INITIAL_MOCK_JOBS} />
    </Suspense>
  )
}