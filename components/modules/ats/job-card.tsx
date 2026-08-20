import Link from 'next/link'
import { MapPin, Briefcase, Users, DollarSign, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { JobWithMetrics } from '@/lib/mock-data'

interface JobCardProps {
  job: JobWithMetrics
}

export function JobCard({ job }: JobCardProps) {
  const isCLT = job.contract_type === 'CLT'

  return (
    <Card className="flex flex-col justify-between group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant={isCLT ? 'clt' : 'pj'}>
            {job.contract_type}
          </Badge>
          <span
            className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full ${
              job.status === 'aberta'
                ? 'bg-[var(--accent)] text-[var(--primary)]'
                : job.status === 'pausada'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'
            }`}
          >
            {job.status}
          </span>
        </div>
        <CardTitle className="text-base font-bold group-hover:text-[var(--primary)] transition-colors pt-2">
          {job.title}
        </CardTitle>
        <p className="text-xs font-medium text-[var(--muted-foreground)]">{job.department}</p>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 text-xs text-[var(--muted-foreground)]">
        <p className="line-clamp-2">{job.description}</p>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="capitalize">{job.workplace_model}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>
              {job.min_salary && job.max_salary
                ? `${formatCurrency(job.min_salary)} - ${formatCurrency(job.max_salary)}`
                : 'A combinar'}
            </span>
          </div>
        </div>

        {/* Pipeline Metrics */}
        <div className="flex items-center justify-between p-2 sm:p-2.5 bg-[var(--secondary)] rounded-lg border border-[var(--border-subtle)] text-center">
          <div>
            <p className="text-sm font-bold text-[var(--foreground)]">{job.total_candidates}</p>
            <p className="text-[10px] text-[var(--muted-foreground)] font-medium">Inscritos</p>
          </div>
          <div className="h-6 w-px bg-[var(--border-subtle)]" />
          <div>
            <p className="text-sm font-bold text-[var(--primary)]">{job.in_progress}</p>
            <p className="text-[10px] text-[var(--muted-foreground)] font-medium">No Funil</p>
          </div>
          <div className="h-6 w-px bg-[var(--border-subtle)]" />
          <div>
            <p className="text-sm font-bold text-[var(--primary)]">{job.hired}</p>
            <p className="text-[10px] text-[var(--muted-foreground)] font-medium">Aprovados</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/ats/${job.id}`} className="w-full">
          <Button variant="outline" className="w-full justify-between text-xs h-9 font-semibold">
            <span>Acessar Pipeline Kanban</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
