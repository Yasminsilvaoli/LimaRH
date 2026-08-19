'use client'

import { useState } from 'react'
import { Plus, FilePlus, HeartPulse } from 'lucide-react'
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
import { MedicalCertificateWithEmployee } from '@/lib/ocorrencias-mock'

interface NewMedicalCertificateDialogProps {
  onAddCertificate: (cert: MedicalCertificateWithEmployee) => void
}

export function NewMedicalCertificateDialog({
  onAddCertificate,
}: NewMedicalCertificateDialogProps) {
  const [open, setOpen] = useState(false)
  const [employeeName, setEmployeeName] = useState('Lucas Silveira Mendes')
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [cid, setCid] = useState('')
  const [doctorCrm, setDoctorCrm] = useState('')

  const calculateDays = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays || 1
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const days = calculateDays()

    const newCert: MedicalCertificateWithEmployee = {
      id: `cert-${Date.now()}`,
      employee_id: 'emp-1',
      employee_name: employeeName,
      employee_role: 'Engenharia de Software',
      contract_type: 'CLT',
      start_date: startDate,
      end_date: endDate,
      days_count: days,
      cid: cid || null,
      doctor_crm: doctorCrm || null,
      file_url: 'https://storage.supabase.co/limarh/certs/atestado.pdf',
      status: 'pendente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onAddCertificate(newCert)
    setOpen(false)
    setCid('')
    setDoctorCrm('')
  }

  const totalDays = calculateDays()

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 shadow-xs font-semibold bg-emerald-600 hover:bg-emerald-700">
        <Plus className="h-4 w-4" />
        <span>Enviar Atestado Médico</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600">
              <HeartPulse className="h-5 w-5" />
              <DialogTitle>Lançamento de Atestado Médico</DialogTitle>
            </div>
            <DialogDescription>
              Registro de licença médica e saúde ocupacional para cálculo de folha e abono.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Colaborador *
              </label>
              <Select
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                options={[
                  { label: 'Lucas Silveira Mendes (CLT)', value: 'Lucas Silveira Mendes' },
                  { label: 'Mariana Duarte Costa (PJ)', value: 'Mariana Duarte Costa' },
                  { label: 'Rodrigo Barbosa Alencar (CLT)', value: 'Rodrigo Barbosa Alencar' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Data de Início do Afastamento *
                </label>
                <Input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Data de Término *
                </label>
                <Input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Total Days Indicator */}
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
              <span className="font-semibold text-emerald-900">
                Total de dias de afastamento:
              </span>
              <span className="font-extrabold text-emerald-700 text-sm">
                {totalDays} {totalDays === 1 ? 'dia' : 'dias'}
              </span>
            </div>

            {totalDays > 15 && (
              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-800 text-[11px]">
                ⚠️ <strong>Atenção RH:</strong> Afastamentos superiores a 15 dias para colaboradores CLT exigem encaminhamento para perícia médica do INSS.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  CID (Código Internacional de Doenças)
                </label>
                <Input
                  placeholder="Ex: J06.9 ou Z00"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  CRM / Nome do Médico
                </label>
                <Input
                  placeholder="CRM/SP 123456 - Dr..."
                  value={doctorCrm}
                  onChange={(e) => setDoctorCrm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Upload do Atestado (PDF / Imagem)
              </label>
              <Input type="file" className="cursor-pointer" />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Salvar e Submeter ao RH
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
