'use client'

import { useState, useEffect } from 'react'
import { Plus, ShieldAlert, Loader2 } from 'lucide-react'
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
import { DisciplinaryType, EmployeeWithDetails } from '@/types'
import { createDisciplinaryRecord } from '@/lib/services/ocorrencias'
import { fetchEmployees } from '@/lib/services/employees'

interface NewDisciplinaryDialogProps {
  onAddRecord: (record: DisciplinaryRecordWithEmployee) => void
  trigger?: React.ReactNode
}

export function NewDisciplinaryDialog({ onAddRecord, trigger }: NewDisciplinaryDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [customEmployeeName, setCustomEmployeeName] = useState('')
  const [type, setType] = useState<DisciplinaryType>('advertencia_escrita')
  const [incidentDate, setIncidentDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [reason, setReason] = useState('')
  const [daysSuspended, setDaysSuspended] = useState('1')

  useEffect(() => {
    if (open) {
      fetchEmployees().then((data) => {
        setEmployees(data)
        if (data.length > 0) {
          setSelectedEmployeeId(data[0].id)
        }
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    let empName = customEmployeeName.trim()
    if (selectedEmployeeId && employees.length > 0) {
      const found = employees.find((emp) => emp.id === selectedEmployeeId)
      if (found) empName = found.full_name
    }

    if (!empName) return

    setIsSubmitting(true)
    try {
      const created = await createDisciplinaryRecord({
        employee_name: empName,
        type,
        reason,
        incident_date: incidentDate,
        days_suspended: type === 'suspensao' ? Number(daysSuspended) || 1 : null,
        document_url: type !== 'advertencia_verbal' ? 'https://storage.supabase.co/limarh/docs/termo.pdf' : null,
      })

      if (created) {
        onAddRecord(created)
        setOpen(false)
        setReason('')
        setCustomEmployeeName('')
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
          className="gap-2 shadow-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Medida Disciplinar</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-5 w-5" />
              <DialogTitle>Registro de Ocorrência Disciplinar</DialogTitle>
            </div>
            <DialogDescription>
              Formalize advertências verbais, formais ou suspensões com respaldo trabalhista.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Colaborador Infrator *
                </label>
                {employees.length > 0 ? (
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:bg-[#000000] dark:border-white/20 dark:text-white dark:focus:border-[#00FF7F] dark:focus:ring-[#00FF7F] text-xs"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id} className="bg-white text-slate-900 dark:bg-[#121212] dark:text-white">
                        {emp.full_name} ({emp.job_title})
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    required
                    placeholder="Nome do colaborador"
                    value={customEmployeeName}
                    onChange={(e) => setCustomEmployeeName(e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Tipo de Medida Legal *
                </label>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value as DisciplinaryType)}
                  options={[
                    { label: 'Advertência Verbal', value: 'advertencia_verbal' },
                    { label: 'Advertência Escrita Formal', value: 'advertencia_escrita' },
                    { label: 'Suspensão Disciplinar', value: 'suspensao' },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Data do Ocorrido *
                </label>
                <Input
                  required
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
              </div>

              {type === 'suspensao' && (
                <div>
                  <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                    Dias de Suspensão *
                  </label>
                  <Input
                    required
                    type="number"
                    min={1}
                    max={30}
                    value={daysSuspended}
                    onChange={(e) => setDaysSuspended(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                Motivo Detalhado / Fatos *
              </label>
              <Textarea
                required
                placeholder="Descreva detalhadamente o evento, horário, testemunhas ou infração às políticas internas..."
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
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
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Registrando...</span>
                  </>
                ) : (
                  <span>Registrar Medida</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
