'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { JobWithMetrics } from '@/lib/mock-data'
import { JobCard } from '@/components/modules/ats/job-card'
import { JobFormDialog } from '@/components/modules/ats/job-form-dialog'
import { ImportJobsDialog } from '@/components/modules/ats/import-jobs-dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  Users,
  CheckCircle2,
  Search,
  X,
  RotateCcw,
  ArrowRight,
  Filter,
  Layers,
} from 'lucide-react'

interface ATSDashboardProps {
  initialJobs: JobWithMetrics[]
}

type MetricFilterType = 'todos' | 'abertas' | 'candidatos' | 'aprovados'

export function ATSDashboard({ initialJobs }: ATSDashboardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') || searchParams.get('q') || ''

  const [hasMounted, setHasMounted] = useState(false)
  const [jobs, setJobs] = useState<JobWithMetrics[]>(initialJobs)
  const [searchTerm, setSearchTerm] = useState(urlSearch)
  const [metricFilter, setMetricFilter] = useState<MetricFilterType>('todos')
  const [contractFilter, setContractFilter] = useState('todos')
  const [deptFilter, setDeptFilter] = useState('todos')

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Atualizar termo de busca se o parâmetro na URL mudar (ex: vindo do Header)
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

  // Alternar filtro métrico clicável
  const handleToggleMetricFilter = (filterType: MetricFilterType) => {
    setMetricFilter((current) => (current === filterType ? 'todos' : filterType))
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setMetricFilter('todos')
    setContractFilter('todos')
    setDeptFilter('todos')
    router.replace('/ats')
  }

  // Filtragem combinada
  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !term ||
      job.title.toLowerCase().includes(term) ||
      job.department.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term) ||
      job.requirements?.toLowerCase().includes(term) ||
      job.contract_type.toLowerCase().includes(term) ||
      job.workplace_model.toLowerCase().includes(term)

    const matchesContract =
      contractFilter === 'todos' || job.contract_type === contractFilter

    const matchesDept = deptFilter === 'todos' || job.department === deptFilter

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

  // Extrair departamentos únicos para o dropdown
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

      {/* Metrics Banner — Cards Interativos e Clicáveis com Efeito Hover e Filtro Rápido */}
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
                  : 'bg-[var(--accent)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white'
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
                  : 'bg-[var(--accent)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white'
              }`}
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Candidatos no Funil
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

        {/* Card 3: Aprovados / Admitidos */}
        <button
          type="button"
          onClick={() => handleToggleMetricFilter('aprovados')}
          className={`led-card p-3.5 sm:p-5 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer group hover:scale-[1.01] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
            metricFilter === 'aprovados'
              ? 'ring-2 ring-[var(--primary)] bg-[var(--accent)] border-[var(--primary)]'
              : 'hover:border-[var(--primary)]'
          }`}
          title="Clique para filtrar vagas com contratações realizadas"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                metricFilter === 'aprovados'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--accent)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white'
              }`}
            >
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Aprovados / Admitidos
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">{totalHired}</p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                metricFilter === 'aprovados'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--secondary)] text-[var(--muted-foreground)] group-hover:text-[var(--primary)]'
              }`}
            >
              {metricFilter === 'aprovados' ? 'Filtrando' : 'Filtrar'}
            </span>
          </div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="led-card flex flex-col gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Input de Busca em tempo real com botão de limpeza */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Buscar vagas por título, área, localização ou requisitos..."
              className="pl-9 pr-8 text-xs h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-0.5 rounded"
                title="Limpar busca"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filtros Dropdown */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="w-full md:w-44">
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

        {/* Resumo de Filtros Ativos e Contador */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--muted-foreground)] font-medium flex items-center gap-1">
              <Filter className="h-3 w-3" />
              <span>Filtros ativos:</span>
            </span>

            {metricFilter !== 'todos' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--primary)] font-semibold text-[11px]">
                <span>
                  Métrica:{' '}
                  {metricFilter === 'abertas'
                    ? 'Vagas Abertas'
                    : metricFilter === 'candidatos'
                    ? 'Com Candidatos'
                    : 'Com Aprovados'}
                </span>
                <button
                  type="button"
                  onClick={() => setMetricFilter('todos')}
                  className="hover:opacity-75"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {contractFilter !== 'todos' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--secondary)] border border-[var(--border-subtle)] text-[var(--foreground)] font-medium text-[11px]">
                <span>Regime: {contractFilter}</span>
                <button
                  type="button"
                  onClick={() => setContractFilter('todos')}
                  className="hover:opacity-75"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {deptFilter !== 'todos' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--secondary)] border border-[var(--border-subtle)] text-[var(--foreground)] font-medium text-[11px]">
                <span>Área: {deptFilter}</span>
                <button
                  type="button"
                  onClick={() => setDeptFilter('todos')}
                  className="hover:opacity-75"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--secondary)] border border-[var(--border-subtle)] text-[var(--foreground)] font-medium text-[11px]">
                <span>Busca: &quot;{searchTerm}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="hover:opacity-75"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {!isFiltering && (
              <span className="text-[var(--muted-foreground)] text-[11px] italic">
                Nenhum filtro aplicado (exibindo todas as vagas)
              </span>
            )}
          </div>

          <div className="text-[var(--muted-foreground)] text-[11px] font-semibold">
            Exibindo <span className="text-[var(--foreground)] font-bold">{filteredJobs.length}</span> de{' '}
            <span className="text-[var(--foreground)] font-bold">{jobs.length}</span> vagas
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
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