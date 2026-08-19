'use client'

import { useState } from 'react'
import { Plus, AlertOctagon, FileCheck, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { DisciplinaryRecordWithEmployee } from '@/lib/ocorrencias-mock'
import { DisciplinaryType } from '@/types'

interface NewDisciplinaryDialogProps {
  onAddRecord: (record: DisciplinaryRecordWithEmployee) => void
}

export function NewDisciplinaryDialog({ onAddRecord }: NewDisciplinaryDialogProps) {
  const [open, setOpen] = useState(false)
  const [employeeName, setEmployeeName] = useState('Lucas Silveira Mendes')
  const [type, setType] = useState<DisciplinaryType>('advertencia_escrita')
  const [incidentDate, setIncidentDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [reason, setReason] = useState('')
  const [daysSuspended, setDaysSuspended] = useState('1')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    const newRecord: DisciplinaryRecordWithEmployee = {
      id: `disc-${Date.now()}`,
      employee_id: 'emp-1',
      employee_name: employeeName,
      employee_role: 'Engenharia de Software',
      contract_type: 'CLT',
      type,
      reason,
      incident_date: incidentDate,
      days_suspended: type === 'suspensao' ? Number(daysSuspended) || 1 : null,
      document_url: type !== 'advertencia_verbal' ? 'https://storage.supabase.co/limarh/docs/termo.pdf' : null,
      signed_at: new Date().toISOString(),
      registered_by: 'Equipe de Gente & Gestão',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onAddRecord(newRecord)
    setOpen(false)
    setReason('')
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 shadow-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
      >
        <Plus className="h-4 w-4" />
        <span>Registrar Medida Disciplinar</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="h-5 w-5" />
              <DialogTitle>Registro de Ocorrência Disciplinar</DialogTitle>
            </div>
            <DialogDescription>
              Aplicação de sanção disciplinar conforme CLT e regulamento interno.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Colaborador Notificado *
              </label>
              <Select
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                options={[
                  { label: 'Lucas Silveira Mendes (Dev Full Stack)', value: 'Lucas Silveira Mendes' },
                  { label: 'Rodrigo Barbosa Alencar (Especialista DB)', value: 'Rodrigo Barbosa Alencar' },
                  { label: 'Mariana Duarte Costa (Product Designer)', value: 'Mariana Duarte Costa' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tipo de Medida *
                </label>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value as DisciplinaryType)}
                  options={[
                    { label: 'Advertência Verbal', value: 'advertencia_verbal' },
                    { label: 'Advertência Escrita', value: 'advertencia_escrita' },
                    { label: 'Suspensão Disciplinar', value: 'suspensao' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Data do Fato / Incidente *
                </label>
                <Input
                  required
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
              </div>
            </div>

            {type === 'suspensao' && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <label className="block text-amber-900 font-bold mb-1">
                  Quantidade de Dias de Suspensão (CLT) *
                </label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  required
                  value={daysSuspended}
                  onChange={(e) => setDaysSuspended(e.target.value)}
                  className="bg-white"
                />
                <p className="text-[10px] text-amber-700 mt-1">
                  Nota legal: A suspensão disciplinar na CLT não pode ser superior a 30 dias consecutivos (Art. 474).
                </p>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Motivo e Descrição Detalhada dos Fatos *
              </label>
              <Textarea
                required
                rows={3}
                placeholder="Descreva detalhadamente o ocorrido com horário, testemunhas e impactos..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white">
                Aplicar e Registrar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
