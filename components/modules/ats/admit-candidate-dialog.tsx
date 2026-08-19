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
import { UserCheck, CheckCircle2, Building2, Calendar, FileCheck } from 'lucide-react'

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

  const handleAdmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onSuccess(candidate)
        onOpenChange(false)
      }, 1500)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600">
            <UserCheck className="h-5 w-5" />
            <DialogTitle>Aprovar & Admitir no HRIS</DialogTitle>
          </div>
          <DialogDescription>
            Converter o candidato <strong>{candidate.full_name}</strong> em colaborador oficial da organização.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Colaborador Admitido com Sucesso!
            </h3>
            <p className="text-xs text-slate-500">
              O perfil e contrato foram criados automaticamente no módulo HRIS.
            </p>
          </div>
        ) : (
          <form onSubmit={handleAdmit} className="space-y-4 text-xs">
            {/* Candidate Summary Banner */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{candidate.full_name}</p>
                <p className="text-slate-500">{candidate.email} • {candidate.phone || 'Sem telefone'}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Aprovado no ATS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Regime de Contratação *
                </label>
                <Select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value as 'CLT' | 'PJ')}
                  options={[
                    { label: 'CLT (Carteira Assinada)', value: 'CLT' },
                    { label: 'PJ (Prestador / Honorários)', value: 'PJ' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Cargo / Função Oficial *
                </label>
                <Input
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {contractType === 'CLT' ? 'Salário Base (R$) *' : 'Honorário Mensal (R$) *'}
                </label>
                <Input
                  required
                  type="number"
                  value={salaryOrRate}
                  onChange={(e) => setSalaryOrRate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Data de Início / Admissão *
                </label>
                <Input
                  required
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                />
              </div>
            </div>

            {/* Condicionais por regime */}
            {contractType === 'CLT' ? (
              <div className="p-3 bg-sky-50/50 rounded-lg border border-sky-200 space-y-3">
                <p className="font-semibold text-sky-900 flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4" />
                  Dados Iniciais CLT
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">CPF *</label>
                    <Input
                      required
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">RG</label>
                    <Input
                      placeholder="00.000.000-0"
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-200 space-y-3">
                <p className="font-semibold text-indigo-900 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  Dados da Pessoa Jurídica (PJ)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Razão Social *</label>
                    <Input
                      required
                      placeholder="Ex: Mendes Tech Serviços LTDA"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">CNPJ *</label>
                    <Input
                      required
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Dia de Vencimento da Nota Fiscal
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    value={invoiceDueDay}
                    onChange={(e) => setInvoiceDueDay(e.target.value)}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
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
                className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Admitindo...' : 'Confirmar Admissão'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
