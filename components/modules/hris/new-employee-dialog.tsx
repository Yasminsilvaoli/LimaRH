'use client'

import { useState } from 'react'
import { Plus, UserPlus, Loader2 } from 'lucide-react'
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
import { EmployeeWithDetails, ContractType } from '@/types'
import { createEmployee } from '@/lib/services/employees'

interface NewEmployeeDialogProps {
  onAddEmployee: (emp: EmployeeWithDetails) => void
  trigger?: React.ReactNode
}

export function NewEmployeeDialog({ onAddEmployee, trigger }: NewEmployeeDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contractType, setContractType] = useState<ContractType>('CLT')
  const [jobTitle, setJobTitle] = useState('')
  const [department, setDepartment] = useState('Engenharia de Software')
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [salaryOrRate, setSalaryOrRate] = useState('8000')

  // CLT Specifics
  const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState('')
  const [pis, setPis] = useState('')
  const [mealVoucher, setMealVoucher] = useState('800')

  // PJ Specifics
  const [companyName, setCompanyName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [invoiceDueDay, setInvoiceDueDay] = useState('10')
  const [pixKey, setPixKey] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) return

    setIsSubmitting(true)
    try {
      const created = await createEmployee({
        organization_id: '00000000-0000-0000-0000-000000000001',
        profile_id: null,
        full_name: fullName,
        email,
        phone: phone || null,
        birth_date: '1995-01-01',
        contract_type: contractType,
        job_title: jobTitle || 'Colaborador',
        department,
        manager_id: null,
        admission_date: admissionDate,
        resignation_date: null,
        status: 'ativo',
        salary_or_rate: Number(salaryOrRate) || 0,
        clt_details:
          contractType === 'CLT'
            ? {
                cpf: cpf || '000.000.000-00',
                rg: rg || null,
                pis_pasep: pis || null,
                ctps_number: '1234567',
                ctps_series: '0010',
                transport_voucher: false,
                meal_voucher_value: Number(mealVoucher) || null,
                health_insurance: true,
              }
            : null,
        pj_details:
          contractType === 'PJ'
            ? {
                company_name: companyName || fullName + ' Serviços LTDA',
                trade_name: null,
                cnpj: cnpj || '00.000.000/0001-00',
                invoice_due_day: Number(invoiceDueDay) || 10,
                contract_valid_until: '2026-12-31',
                contract_file_url: null,
                bank_name: 'Banco Digital',
                bank_agency: '0001',
                bank_account: '12345-6',
                pix_key: pixKey || email,
              }
            : null,
      })

      if (created) {
        onAddEmployee(created)
        setOpen(false)
        setFullName('')
        setEmail('')
        setPhone('')
        setJobTitle('')
        setCpf('')
        setCompanyName('')
        setCnpj('')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="gap-2 shadow-xs font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black dark:shadow-[0_0_12px_rgba(0,255,127,0.3)]"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Cadastrar Colaborador</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[var(--primary)] dark:text-[#00FF7F]">
              <UserPlus className="h-5 w-5" />
              <DialogTitle>Cadastro de Novo Colaborador (HRIS)</DialogTitle>
            </div>
            <DialogDescription>
              Insira os dados cadastrais do colaborador e selecione o regime de vínculo legal. Os dados serão salvos no banco de dados.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Informações Gerais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Nome Completo *
                </label>
                <Input
                  required
                  placeholder="Ex: Fernanda Silveira Lima"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  E-mail Corporativo *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="fernanda.lima@limarh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Telefone / WhatsApp
                </label>
                <Input
                  placeholder="(11) 99999-8888"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Regime de Contratação *
                </label>
                <Select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value as ContractType)}
                  options={[
                    { label: 'CLT (Carteira Assinada)', value: 'CLT' },
                    { label: 'PJ (Pessoa Jurídica)', value: 'PJ' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Data de Admissão *
                </label>
                <Input
                  required
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Cargo / Função *
                </label>
                <Input
                  required
                  placeholder="Ex: Analista de Dados Pleno"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Departamento *
                </label>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  options={[
                    { label: 'Engenharia de Software', value: 'Engenharia de Software' },
                    { label: 'Design & UX', value: 'Design & UX' },
                    { label: 'Gente & Gestão', value: 'Gente & Gestão' },
                    { label: 'Produto', value: 'Produto' },
                    { label: 'Financeiro', value: 'Financeiro' },
                  ]}
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

            {/* Condicional: Detalhes CLT */}
            {contractType === 'CLT' && (
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-900/60 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3">
                <p className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>Documentos e Benefícios CLT</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                      CPF *
                    </label>
                    <Input
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                      RG
                    </label>
                    <Input
                      placeholder="00.000.000-0"
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                      PIS / PASEP
                    </label>
                    <Input
                      placeholder="000.00000.00-0"
                      value={pis}
                      onChange={(e) => setPis(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Condicional: Detalhes PJ */}
            {contractType === 'PJ' && (
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-900/60 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3">
                <p className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>Dados da Pessoa Jurídica (PJ)</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                      Razão Social da Empresa *
                    </label>
                    <Input
                      placeholder="Ex: F. Lima Consultoria LTDA"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                      CNPJ *
                    </label>
                    <Input
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                      Dia de Vencimento da NF
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={31}
                      value={invoiceDueDay}
                      onChange={(e) => setInvoiceDueDay(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                      Chave PIX para Pagamento
                    </label>
                    <Input
                      placeholder="CNPJ, E-mail ou Telefone"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-[var(--border-subtle)] dark:border-zinc-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-1.5 font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>Concluir Cadastro</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
