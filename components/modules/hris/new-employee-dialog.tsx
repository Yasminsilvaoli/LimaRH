'use client'

import { useState } from 'react'
import { Plus, UserPlus, FileCheck, Building2 } from 'lucide-react'
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

interface NewEmployeeDialogProps {
  onAddEmployee: (emp: EmployeeWithDetails) => void
}

export function NewEmployeeDialog({ onAddEmployee }: NewEmployeeDialogProps) {
  const [open, setOpen] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) return

    const newEmpId = `emp-${Date.now()}`

    const newEmployee: EmployeeWithDetails = {
      id: newEmpId,
      organization_id: 'org-1',
      profile_id: `prof-${Date.now()}`,
      full_name: fullName,
      email,
      phone: phone || null,
      birth_date: '1995-01-01',
      contract_type: contractType,
      job_title: jobTitle,
      department,
      manager_id: 'mgr-1',
      admission_date: admissionDate,
      resignation_date: null,
      status: 'ativo',
      salary_or_rate: Number(salaryOrRate) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      manager: {
        id: 'mgr-1',
        full_name: 'Carlos Eduardo Ramos (CTO)',
      },
      clt_details:
        contractType === 'CLT'
          ? {
              id: `clt-${Date.now()}`,
              employee_id: newEmpId,
              cpf: cpf || '000.000.000-00',
              rg: rg || null,
              pis_pasep: pis || null,
              ctps_number: '1234567',
              ctps_series: '0010',
              transport_voucher: false,
              meal_voucher_value: Number(mealVoucher) || null,
              health_insurance: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : null,
      pj_details:
        contractType === 'PJ'
          ? {
              id: `pj-${Date.now()}`,
              employee_id: newEmpId,
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
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : null,
    }

    onAddEmployee(newEmployee)
    setOpen(false)
    setFullName('')
    setEmail('')
    setPhone('')
    setJobTitle('')
    setCpf('')
    setCompanyName('')
    setCnpj('')
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 shadow-xs font-semibold bg-emerald-600 hover:bg-emerald-700">
        <Plus className="h-4 w-4" />
        <span>Cadastrar Colaborador</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600">
              <UserPlus className="h-5 w-5" />
              <DialogTitle>Cadastro de Novo Colaborador (HRIS)</DialogTitle>
            </div>
            <DialogDescription>
              Insira os dados cadastrais do colaborador e selecione o regime de vínculo legal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Informações Gerais */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
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
                <label className="block text-slate-700 font-semibold mb-1">
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

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Telefone / WhatsApp
                </label>
                <Input
                  placeholder="(11) 99999-8888"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
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
                <label className="block text-slate-700 font-semibold mb-1">
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

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
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
                <label className="block text-slate-700 font-semibold mb-1">
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
            </div>

            {/* Seção Condicional CLT */}
            {contractType === 'CLT' ? (
              <div className="p-3 bg-sky-50/60 rounded-lg border border-sky-200/80 space-y-3">
                <p className="font-bold text-sky-900 flex items-center gap-1.5 text-xs">
                  <FileCheck className="h-4 w-4" />
                  Documentação Trabalhista (CLT)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">CPF *</label>
                    <Input
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
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">PIS / PASEP</label>
                    <Input
                      placeholder="000.00000.00-0"
                      value={pis}
                      onChange={(e) => setPis(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Seção Condicional PJ */
              <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200/80 space-y-3">
                <p className="font-bold text-indigo-900 flex items-center gap-1.5 text-xs">
                  <Building2 className="h-4 w-4" />
                  Dados da Empresa Prestadora (PJ)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Razão Social *</label>
                    <Input
                      placeholder="Ex: Lima Consultoria e Tecnologia LTDA"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">CNPJ *</label>
                    <Input
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Dia Vencimento NF</label>
                    <Input
                      type="number"
                      min={1}
                      max={31}
                      value={invoiceDueDay}
                      onChange={(e) => setInvoiceDueDay(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Chave PIX</label>
                    <Input
                      placeholder="CNPJ, E-mail ou Telefone"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Salvar Colaborador
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
