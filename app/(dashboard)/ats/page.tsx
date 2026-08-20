import { Suspense } from 'react'
import { ATSDashboard } from '@/components/modules/ats/ats-dashboard'

export const metadata = {
  title: 'Recrutamento & Seleção (ATS) | LimaRH',
  description: 'Gestão de vagas e pipeline de contratação do LimaRH',
}

export default function ATSPage() {
  return (
    <Suspense fallback={null}>
      <ATSDashboard initialJobs={[]} />
    </Suspense>
  )
}