'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EmployeeWithDetails } from '@/types'
import { NewEmployeeDialog } from '@/components/modules/hris/new-employee-dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { exportEmployeesToExcel, exportEmployeesToCSV } from '@/lib/export-employees'
import { Search, ArrowRight, Download, FileSpreadsheet } from 'lucide-react'

interface EmployeesListProps {
  initialEmployees: EmployeeWithDetails[]
}

export function EmployeesList({ initialEmployees }: EmployeesListProps) {
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>(initialEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [contractFilter, setContractFilter] = useState('todos')
  const [statusFilter, setStatusFilter] = useState('todos')

  const handleAddEmployee = (newEmp: EmployeeWithDetails) => {
    setEmployees((prev) => [newEmp, ...prev])
  }

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesContract =
      contractFilter === 'todos' || emp.contract_type === contractFilter

    const matchesStatus =
      statusFilter === 'todos' || emp.status === statusFilter

    return matchesSearch && matchesContract && matchesStatus
  })

  const [isExporting, setIsExporting] = useState(false)

  const handleExportExcel = async () => {
    try {
      setIsExporting(true)
      await exportEmployeesToExcel(filteredEmployees)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCSV = () => {
    exportEmployeesToCSV(filteredEmployees)
  }

  const totalHeadcount = employees.length
  const totalCLT = employees.filter((e) => e.contract_type === 'CLT').length
  const totalPJ = employees.filter((e) => e.contract_type === 'PJ').length
  const totalActive = employees.filter((e) => e.status === 'ativo').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="success">Ativo</Badge>
      case 'ferias':
        return <Badge variant="warning">Férias</Badge>
      case 'afastado':
        return <Badge variant="destructive">Afastado</Badge>
      default:
        return <Badge variant="secondary">Inativo</Badge>
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Gestão de Pessoas (HRIS)
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Diretório unificado de colaboradores CLT e prestadores PJ.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={isExporting || filteredEmployees.length === 0}
            className="gap-2 font-semibold"
            title="Exportar planilha formatada em Excel (.xlsx)"
          >
            <FileSpreadsheet className="h-4 w-4 text-[var(--primary)]" />
            <span>{isExporting ? 'Exportando...' : `Exportar Excel (${filteredEmployees.length})`}</span>
          </Button>
          <NewEmployeeDialog onAddEmployee={handleAddEmployee} />
        </div>
      </div>

      {/* Headcount Metrics Cards — LED glow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="led-card p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Total Headcount
          </p>
          <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-1">{totalHeadcount}</p>
        </div>

        <div className="led-card p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Ativos no Mês
          </p>
          <p className="text-xl sm:text-2xl font-bold text-[var(--primary)] mt-1">{totalActive}</p>
        </div>

        <div className="led-card p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Quadro CLT
          </p>
          <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-1">{totalCLT}</p>
        </div>

        <div className="led-card p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Prestadores PJ
          </p>
          <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-1">{totalPJ}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="led-card flex flex-col md:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Buscar por nome, cargo ou e-mail..."
            className="pl-9 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center">
          <Select
            value={contractFilter}
            onChange={(e) => setContractFilter(e.target.value)}
            options={[
              { label: 'Todos Regimes', value: 'todos' },
              { label: 'Apenas CLT', value: 'CLT' },
              { label: 'Apenas PJ', value: 'PJ' },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'Todos Status', value: 'todos' },
              { label: 'Ativo', value: 'ativo' },
              { label: 'Férias', value: 'ferias' },
              { label: 'Afastado', value: 'afastado' },
            ]}
          />
        </div>
      </div>

      {/* Mobile View: Stacked Cards */}
      <div className="block md:hidden space-y-3">
        {filteredEmployees.map((emp) => {
          const isCLT = emp.contract_type === 'CLT'
          return (
            <div key={emp.id} className="led-card p-4 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-[var(--foreground)] text-sm">{emp.full_name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{emp.job_title}</p>
                </div>
                <Badge variant={isCLT ? 'clt' : 'pj'}>{emp.contract_type}</Badge>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)]">
                <span className="font-semibold text-[var(--foreground)]">
                  {formatCurrency(emp.salary_or_rate)}
                </span>
                {getStatusBadge(emp.status)}
              </div>

              <Link href={`/colaboradores/${emp.id}`} className="block">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold justify-between h-8">
                  <span>Ver Perfil Completo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )
        })}
      </div>

      {/* Desktop View: Full Table */}
      <div className="hidden md:block led-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--secondary)] border-b border-[var(--border-subtle)] text-[var(--muted-foreground)] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Colaborador</th>
                <th className="px-6 py-3.5">Regime</th>
                <th className="px-6 py-3.5">Cargo / Área</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Remuneração</th>
                <th className="px-6 py-3.5">Admissão</th>
                <th className="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredEmployees.map((emp) => {
                const admission = new Date(emp.admission_date).toLocaleDateString('pt-BR')
                const isCLT = emp.contract_type === 'CLT'

                return (
                  <tr key={emp.id} className="hover:bg-[var(--secondary)] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[var(--foreground)]">{emp.full_name}</p>
                        <p className="text-[var(--muted-foreground)] text-[11px]">{emp.email}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={isCLT ? 'clt' : 'pj'}>
                        {emp.contract_type}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--foreground)]">{emp.job_title}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">{emp.department}</p>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>

                    <td className="px-6 py-4 font-semibold text-[var(--foreground)]">
                      {formatCurrency(emp.salary_or_rate)}
                      <span className="block text-[10px] text-[var(--muted-foreground)] font-normal">
                        {isCLT ? 'Salário Base CLT' : 'Honorário Mensal PJ'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{admission}</td>

                    <td className="px-6 py-4 text-right">
                      <Link href={`/colaboradores/${emp.id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1 font-semibold">
                          <span>Perfil Completo</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
