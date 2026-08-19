import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, DollarSign, Briefcase } from 'lucide-react'
import { INITIAL_MOCK_JOBS, INITIAL_MOCK_CANDIDATES } from '@/lib/mock-data'
import { KanbanBoard } from '@/components/modules/ats/kanban-board'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface JobDetailsPageProps {
  params: Promise<{
    jobId: string
  }>
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { jobId } = await params
  const job = INITIAL_MOCK_JOBS.find((j) => j.id === jobId)

  if (!job) {
    notFound()
  }

  const isCLT = job.contract_type === 'CLT'

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Job Summary */}
      <div className="flex flex-col gap-4">
        <Link href="/ats" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para todas as vagas</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={isCLT ? 'clt' : 'pj'}>{job.contract_type}</Badge>
              <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span>{job.department}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <DollarSign className="h-3 w-3" />
                {job.min_salary && job.max_salary
                  ? `${formatCurrency(job.min_salary)} - ${formatCurrency(job.max_salary)}`
                  : 'A combinar'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Pipeline Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Pipeline de Candidatos
          </h2>
          <span className="text-xs text-slate-400">
            Arraste ou use os controles de seta para avançar o candidato
          </span>
        </div>

        <KanbanBoard initialCandidates={INITIAL_MOCK_CANDIDATES} jobId={job.id} />
      </div>
    </div>
  )
}
