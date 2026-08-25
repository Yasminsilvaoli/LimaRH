'use client'

import { useState } from 'react'
import { KanbanCandidateItem } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { UserCheck, CheckCircle2, Loader2 } from 'lucide-react'
import { createEmployee } from '@/lib/services/employees'

interface AdmitCandidateDialogProps {
  candidate: KanbanCandidateItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (candidate: KanbanCandidateItem) => void
}

export function AdmitCandidateDialog({
  candidate,
  open,
  onOpenChange,
  onSuccess,
}: AdmitCandidateDialogProps) {
  const [contractType, setContractType] = useState<'CLT' | 'PJ'>('CLT')
  const [jobTitle, setJobTitle] = useState('Desenvolvedor(a) Full Stack')
  const [salaryOrRate, setSalaryOrRate] = useState('8500')
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  // CLT Specifics
  const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState('')

  // PJ Specifics
  const [companyName, setCompanyName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [invoiceDueDay, setInvoiceDueDay] = useState('10')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createEmployee({
        organization_id: '00000000-0000-0000-0000-000000000001',
        profile_id: null,
        full_name: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone || null,
        birth_date: '1995-01-01',
        contract_type: contractType,
        job_title: jobTitle,
        department: 'Engenharia de Software',
        admission_date: admissionDate,
        resignation_date: null,
        status: 'ativo',
        salary_or_rate: Number(salaryOrRate) || 0,
        clt_details:
          contractType === 'CLT'
            ? {
                cpf: cpf || '000.000.000-00',
                rg: rg || null,
                pis_pasep: null,
                ctps_number: '1234567',
                ctps_series: '0010',
                transport_voucher: false,
                meal_voucher_value: 800,
                health_insurance: true,
              }
            : null,
        pj_details:
          contractType === 'PJ'
            ? {
                company_name: companyName || candidate.full_name + ' Serviços LTDA',
                trade_name: null,
                cnpj: cnpj || '00.000.000/0001-00',
                invoice_due_day: Number(invoiceDueDay) || 10,
                contract_valid_until: '2026-12-31',
                contract_file_url: null,
                bank_name: 'Banco Digital',
                bank_agency: '0001',
                bank_account: '12345-6',
                pix_key: candidate.email,
              }
            : null,
      })

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onSuccess(candidate)
        onOpenChange(false)
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[var(--primary)] dark:text-[#00FF7F]">
            <UserCheck className="h-5 w-5" />
            <DialogTitle>Aprovar & Admitir no HRIS</DialogTitle>
          </div>
          <DialogDescription>
            Converter o candidato <strong>{candidate.full_name}</strong> em colaborador oficial da organização no banco de dados.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-[var(--accent)] text-[var(--primary)] dark:bg-[#00FF7F]/20 dark:text-[#00FF7F] flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-[var(--foreground)]">
              Colaborador Admitido com Sucesso!
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              O perfil e contrato foram cadastrados automaticamente no módulo HRIS.
            </p>
          </div>
        ) : (
          <form onSubmit={handleAdmit} className="space-y-4 text-xs">
            {/* Candidate Summary Banner */}
            <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--foreground)]">{candidate.full_name}</p>
                <p className="text-[var(--muted-foreground)]">{candidate.email} • {candidate.phone || 'Sem telefone'}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-[var(--accent)] text-[var(--primary)] dark:bg-[#00FF7F]/20 dark:text-[#00FF7F] text-[11px] font-bold">
                Aprovado no ATS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Regime de Contratação *
                </label>
                <Select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value as 'CLT' | 'PJ')}
                  options={[
                    { label: 'CLT (Carteira Assinada)', value: 'CLT' },
                    { label: 'PJ (Pessoa Jurídica)', value: 'PJ' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Data Prevista de Início *
                </label>
                <Input
                  required
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Cargo Efetivo *
                </label>
                <Input
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  {contractType === 'CLT' ? 'Salário Base (R$) *' : 'Honorário Mensal (R$) *'}
                </label>
                <Input
                  required
                  type="number"
                  value={salaryOrRate}
                  onChange={(e) => setSalaryOrRate(e.target.value)}
                />
              </div>
            </div>

            {/* CLT Specifics */}
            {contractType === 'CLT' && (
              <div className="p-3 bg-slate-50 dark:bg-zinc-900/60 rounded-lg border border-slate-200 dark:border-zinc-800 space-y-2">
                <p className="font-semibold text-slate-800 dark:text-zinc-200">Documentação CLT</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 mb-0.5">CPF *</label>
                    <Input
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 mb-0.5">RG</label>
                    <Input
                      placeholder="00.000.000-0"
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PJ Specifics */}
            {contractType === 'PJ' && (
              <div className="p-3 bg-slate-50 dark:bg-zinc-900/60 rounded-lg border border-slate-200 dark:border-zinc-800 space-y-2">
                <p className="font-semibold text-slate-800 dark:text-zinc-200">Dados da PJ do Prestador</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 mb-0.5">Razão Social</label>
                    <Input
                      placeholder="Empresa LTDA"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 mb-0.5">CNPJ</label>
                    <Input
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black font-semibold gap-1.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Admitindo...</span>
                  </>
                ) : (
                  <span>Confirmar Admissão</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
