'use client'

import { useState, useEffect } from 'react'
import { Plus, HeartPulse, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { MedicalCertificateWithEmployee } from '@/lib/ocorrencias-mock'
import { createMedicalCertificate } from '@/lib/services/ocorrencias'
import { fetchEmployees } from '@/lib/services/employees'
import { EmployeeWithDetails } from '@/types'

interface NewMedicalCertificateDialogProps {
  onAddCertificate: (cert: MedicalCertificateWithEmployee) => void
  trigger?: React.ReactNode
}

export function NewMedicalCertificateDialog({
  onAddCertificate,
  trigger,
}: NewMedicalCertificateDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [customEmployeeName, setCustomEmployeeName] = useState('')
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [cid, setCid] = useState('')
  const [doctorCrm, setDoctorCrm] = useState('')

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

  const calculateDays = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays || 1
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let empName = customEmployeeName.trim()
    if (selectedEmployeeId && employees.length > 0) {
      const found = employees.find((emp) => emp.id === selectedEmployeeId)
      if (found) empName = found.full_name
    }

    if (!empName) return

    const days = calculateDays()

    setIsSubmitting(true)
    try {
      const created = await createMedicalCertificate({
        employee_name: empName,
        start_date: startDate,
        end_date: endDate,
        days_count: days,
        cid: cid || null,
        doctor_crm: doctorCrm || null,
      })

      if (created) {
        onAddCertificate(created)
        setOpen(false)
        setCid('')
        setDoctorCrm('')
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
          className="gap-2 shadow-xs font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black"
        >
          <Plus className="h-4 w-4" />
          <span>Lançar Atestado Médico</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[var(--primary)] dark:text-[#00FF7F]">
              <HeartPulse className="h-5 w-5" />
              <DialogTitle>Lançamento de Atestado Médico</DialogTitle>
            </div>
            <DialogDescription>
              Registre atestados médicos apresentados por colaboradores para abono legal de faltas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                Colaborador Afastado *
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Início do Afastamento *
                </label>
                <Input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Término do Afastamento *
                </label>
                <Input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="p-3 bg-[var(--accent)] dark:bg-zinc-900/80 rounded-lg border border-[var(--border-subtle)] dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-[var(--foreground)] font-medium">
                Duração total calculada:
              </span>
              <span className="font-extrabold text-[var(--primary)] dark:text-[#00FF7F] text-sm">
                {calculateDays()} {calculateDays() === 1 ? 'dia' : 'dias'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  CID-10 (Opcional se autorizado)
                </label>
                <Input
                  placeholder="Ex: J06.9 (Infecção respiratória)"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  CRM do Médico Responsável
                </label>
                <Input
                  placeholder="Ex: CRM/SP 123456"
                  value={doctorCrm}
                  onChange={(e) => setDoctorCrm(e.target.value)}
                />
              </div>
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
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black font-bold gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Lançando...</span>
                  </>
                ) : (
                  <span>Concluir Lançamento</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
