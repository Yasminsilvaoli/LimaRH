import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { KanbanBoard } from '@/components/modules/ats/kanban-board'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { fetchCandidatesForJob } from '@/lib/services/jobs'

interface JobDetailsPageProps {
  params: Promise<{
    jobId: string
  }>
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { jobId } = await params
  const supabase = createClient()

  const { data: job, error } = await (supabase.from('jobs') as any)
    .select('*')
    .eq('id', jobId)
    .maybeSingle()

  if (error || !job) {
    notFound()
  }

  const typedJob = job as any
  const candidates = await fetchCandidatesForJob(typedJob.id)
  const isCLT = typedJob.contract_type === 'CLT'

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Job Summary */}
      <div className="flex flex-col gap-4">
        <Link href="/ats" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para todas as vagas</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={isCLT ? 'clt' : 'pj'}>{typedJob.contract_type}</Badge>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{typedJob.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 pt-1">
              <span>{typedJob.department}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {typedJob.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-[#00FF7F] font-semibold">
                <DollarSign className="h-3 w-3" />
                {typedJob.min_salary && typedJob.max_salary
                  ? `${formatCurrency(typedJob.min_salary)} - ${formatCurrency(typedJob.max_salary)}`
                  : 'A combinar'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Pipeline Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
            Pipeline de Candidatos
          </h2>
          <span className="text-xs text-slate-400 dark:text-zinc-500">
            Acompanhe ou mova o candidato entre as etapas de contratação
          </span>
        </div>

        <KanbanBoard initialCandidates={candidates} jobId={typedJob.id} />
      </div>
    </div>
  )
}
