'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { JobWithMetrics } from '@/lib/mock-data'
import { JobCard } from '@/components/modules/ats/job-card'
import { JobFormDialog } from '@/components/modules/ats/job-form-dialog'
import { ImportJobsDialog } from '@/components/modules/ats/import-jobs-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { fetchJobs } from '@/lib/services/jobs'
import {
  Briefcase,
  Users,
  CheckCircle2,
  Search,
  X,
  RotateCcw,
  Filter,
  Loader2,
} from 'lucide-react'

interface ATSDashboardProps {
  initialJobs?: JobWithMetrics[]
}

type MetricFilterType = 'todos' | 'abertas' | 'candidatos' | 'aprovados'

export function ATSDashboard({ initialJobs = [] }: ATSDashboardProps) {
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') || searchParams.get('q') || ''

  const [hasMounted, setHasMounted] = useState(false)
  const [jobs, setJobs] = useState<JobWithMetrics[]>(initialJobs)
  const [isLoading, setIsLoading] = useState(initialJobs.length === 0)
  const [searchTerm, setSearchTerm] = useState(urlSearch)
  const [metricFilter, setMetricFilter] = useState<MetricFilterType>('todos')
  const [contractFilter, setContractFilter] = useState('todos')
  const [deptFilter, setDeptFilter] = useState('todos')

  useEffect(() => {
    setHasMounted(true)
    let isMounted = true
    async function load() {
      try {
        const data = await fetchJobs()
        if (isMounted) setJobs(data)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch)
    }
  }, [urlSearch])

  if (!hasMounted) {
    return null
  }

  const handleAddJob = (newJob: JobWithMetrics) => {
    setJobs((prev) => [newJob, ...prev])
  }

  const handleImportJobs = (importedJobs: JobWithMetrics[]) => {
    setJobs((prev) => [...importedJobs, ...prev])
  }

  const handleToggleMetricFilter = (type: MetricFilterType) => {
    setMetricFilter((prev) => (prev === type ? 'todos' : type))
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setMetricFilter('todos')
    setContractFilter('todos')
    setDeptFilter('todos')
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesContract =
      contractFilter === 'todos' || job.contract_type === contractFilter

    const matchesDept =
      deptFilter === 'todos' || job.department === deptFilter

    let matchesMetric = true
    if (metricFilter === 'abertas') {
      matchesMetric = job.status === 'aberta'
    } else if (metricFilter === 'candidatos') {
      matchesMetric = job.total_candidates > 0 || job.in_progress > 0
    } else if (metricFilter === 'aprovados') {
      matchesMetric = job.hired > 0
    }

    return matchesSearch && matchesContract && matchesDept && matchesMetric
  })

  const totalOpenJobs = jobs.filter((j) => j.status === 'aberta').length
  const totalCandidates = jobs.reduce((acc, curr) => acc + curr.total_candidates, 0)
  const totalHired = jobs.reduce((acc, curr) => acc + curr.hired, 0)

  const uniqueDepartments = Array.from(new Set(jobs.map((j) => j.department)))

  const isFiltering =
    searchTerm !== '' ||
    metricFilter !== 'todos' ||
    contractFilter !== 'todos' ||
    deptFilter !== 'todos'

  return (
    <div className="space-y-6">
      {/* Header & Title with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Recrutamento & Seleção (ATS)
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Gerencie o pipeline de vagas abertas e candidatos em processo de contratação.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ImportJobsDialog onImportSuccess={handleImportJobs} />
          <JobFormDialog onAddJob={handleAddJob} />
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Vagas Abertas */}
        <button
          type="button"
          onClick={() => handleToggleMetricFilter('abertas')}
          className={`led-card p-3.5 sm:p-5 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer group hover:scale-[1.01] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
            metricFilter === 'abertas'
              ? 'ring-2 ring-[var(--primary)] bg-[var(--accent)] border-[var(--primary)]'
              : 'hover:border-[var(--primary)]'
          }`}
          title="Clique para filtrar apenas vagas com status Aberta"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                metricFilter === 'abertas'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--accent)] text-[var(--primary)] dark:text-[#00FF7F] group-hover:bg-[var(--primary)] group-hover:text-white'
              }`}
            >
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Vagas Abertas
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">{totalOpenJobs}</p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                metricFilter === 'abertas'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--secondary)] text-[var(--muted-foreground)] group-hover:text-[var(--primary)]'
              }`}
            >
              {metricFilter === 'abertas' ? 'Filtrando' : 'Filtrar'}
            </span>
          </div>
        </button>

        {/* Card 2: Candidatos no Funil */}
        <button
          type="button"
          onClick={() => handleToggleMetricFilter('candidatos')}
          className={`led-card p-3.5 sm:p-5 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer group hover:scale-[1.01] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
            metricFilter === 'candidatos'
              ? 'ring-2 ring-[var(--primary)] bg-[var(--accent)] border-[var(--primary)]'
              : 'hover:border-[var(--primary)]'
          }`}
          title="Clique para filtrar vagas com candidatos no processo seletivo"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                metricFilter === 'candidatos'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--accent)] text-[var(--primary)] dark:text-[#00FF7F] group-hover:bg-[var(--primary)] group-hover:text-white'
              }`}
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Total Candidatos
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">{totalCandidates}</p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                metricFilter === 'candidatos'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--secondary)] text-[var(--muted-foreground)] group-hover:text-[var(--primary)]'
              }`}
            >
              {metricFilter === 'candidatos' ? 'Filtrando' : 'Filtrar'}
            </span>
          </div>
        </button>

        {/* Card 3: Contratações / Aprovados */}
        <button
          type="button"
          onClick={() => handleToggleMetricFilter('aprovados')}
          className={`led-card p-3.5 sm:p-5 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer group hover:scale-[1.01] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
            metricFilter === 'aprovados'
              ? 'ring-2 ring-[var(--primary)] bg-[var(--accent)] border-[var(--primary)]'
              : 'hover:border-[var(--primary)]'
          }`}
          title="Clique para filtrar vagas com candidatos aprovados/contratados"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                metricFilter === 'aprovados'
                  ? 'bg-[var(--primary)] text-white dark:bg-[#00FF7F] dark:text-black'
                  : 'bg-[var(--accent)] text-[var(--primary)] dark:bg-[#00FF7F]/10 dark:text-[#00FF7F] group-hover:bg-[var(--primary)] group-hover:text-white dark:group-hover:bg-[#00FF7F] dark:group-hover:text-black'
              }`}
            >
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Contratações (Mês)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] dark:text-[#00FF7F]">{totalHired}</p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                metricFilter === 'aprovados'
                  ? 'bg-[var(--primary)] text-white dark:bg-[#00FF7F] dark:text-black'
                  : 'bg-[var(--secondary)] text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[#00FF7F]'
              }`}
            >
              {metricFilter === 'aprovados' ? 'Filtrando' : 'Filtrar'}
            </span>
          </div>
        </button>
      </div>

      {/* Filter Bar (Only show if jobs exist) */}
      {jobs.length > 0 && (
        <div className="led-card p-4 rounded-xl space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Buscar por título, área ou localização..."
                className="pl-9 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="w-full md:w-48">
                <Select
                  value={contractFilter}
                  onChange={(e) => setContractFilter(e.target.value)}
                  options={[
                    { label: 'Todos os Regimes', value: 'todos' },
                    { label: 'Apenas CLT', value: 'CLT' },
                    { label: 'Apenas PJ', value: 'PJ' },
                  ]}
                />
              </div>

              <div className="w-full md:w-48">
                <Select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  options={[
                    { label: 'Todos os Departamentos', value: 'todos' },
                    ...uniqueDepartments.map((d) => ({ label: d, value: d })),
                  ]}
                />
              </div>

              {isFiltering && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-9 px-3 text-xs gap-1.5 font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Limpar todos os filtros aplicados"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Limpar</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {isLoading ? (
        <div className="led-card p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)] dark:text-[#00FF7F]" />
          <p className="text-xs text-[var(--muted-foreground)] font-medium">Carregando painel de vagas...</p>
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Nenhuma vaga aberta no momento"
          description="Publique sua primeira oportunidade de contratação para começar a receber e gerenciar candidaturas no funil."
          actionNode={
            <JobFormDialog
              onAddJob={handleAddJob}
              trigger={
                <Button className="h-10 px-5 rounded-xl font-bold text-xs gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black dark:shadow-[0_0_15px_rgba(0,255,127,0.3)]">
                  <Briefcase className="h-4 w-4" />
                  <span>Criar Primeira Vaga</span>
                </Button>
              }
            />
          }
        />
      ) : filteredJobs.length === 0 ? (
        <div className="led-card text-center py-16 rounded-xl border-dashed">
          <Briefcase className="h-10 w-10 text-[var(--muted-foreground)] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-[var(--foreground)]">Nenhuma vaga encontrada</h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto mt-1">
            Não encontramos vagas que correspondam aos filtros selecionados.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs font-semibold gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Limpar Filtros de Busca</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}