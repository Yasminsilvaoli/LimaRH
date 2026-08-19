'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Calendar, UserCheck, Shield, Building2 } from 'lucide-react'
import { EmployeeWithDetails } from '@/types'
import { Badge } from '@/components/ui/badge'
import { CLTDetailsTab } from '@/components/modules/hris/clt-details-tab'
import { PJDetailsTab } from '@/components/modules/hris/pj-details-tab'
import { formatCurrency } from '@/lib/utils'

interface EmployeeProfileViewProps {
  employee: EmployeeWithDetails
}

export function EmployeeProfileView({ employee }: EmployeeProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'contratual'>('contratual')
  const isCLT = employee.contract_type === 'CLT'
  const admission = new Date(employee.admission_date).toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/colaboradores"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Voltar para lista de colaboradores</span>
      </Link>

      {/* Profile Header Banner */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-600/20 shrink-0">
            {employee.full_name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{employee.full_name}</h1>
              <Badge variant={isCLT ? 'clt' : 'pj'}>{employee.contract_type}</Badge>
              <Badge variant="success">Ativo</Badge>
            </div>

            <p className="text-xs font-medium text-slate-600">
              {employee.job_title} • <span className="text-slate-400">{employee.department}</span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {employee.email}
              </span>
              {employee.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {employee.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Admitido em {admission}
              </span>
            </div>
          </div>
        </div>

        {/* Manager & Remuneration Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-6">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">
              {isCLT ? 'Salário CLT' : 'Honorário PJ'}
            </p>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(employee.salary_or_rate)}
            </p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Gestor Direto</p>
            <p className="text-xs font-bold text-slate-800">
              {employee.manager?.full_name || 'Diretoria'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('contratual')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'contratual'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {isCLT ? <Shield className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
          <span>{isCLT ? 'Detalhes CLT & Benefícios' : 'Dados PJ & Contrato'}</span>
        </button>

        <button
          onClick={() => setActiveTab('geral')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'geral'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Informações Cadastrais Gerais</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'contratual' && (
          <>
            {isCLT ? (
              <CLTDetailsTab
                details={employee.clt_details}
                salary={employee.salary_or_rate}
              />
            ) : (
              <PJDetailsTab
                details={employee.pj_details}
                rate={employee.salary_or_rate}
              />
            )}
          </>
        )}

        {activeTab === 'geral' && (
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Dados Pessoais & Organização</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Data de Nascimento</p>
                <p className="font-bold text-slate-800 mt-0.5">{employee.birth_date || 'Não informada'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Status Funcional</p>
                <p className="font-bold text-slate-800 mt-0.5 capitalize">{employee.status}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Vínculo</p>
                <p className="font-bold text-slate-800 mt-0.5">{employee.contract_type}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Departamento</p>
                <p className="font-bold text-slate-800 mt-0.5">{employee.department}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
