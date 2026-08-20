'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
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
import { JobWithMetrics } from '@/lib/mock-data'
import { createJob } from '@/lib/services/jobs'

interface JobFormDialogProps {
  onAddJob: (job: JobWithMetrics) => void
  trigger?: React.ReactNode
}

export function JobFormDialog({ onAddJob, trigger }: JobFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('Engenharia')
  const [contractType, setContractType] = useState<'CLT' | 'PJ'>('CLT')
  const [workplaceModel, setWorkplaceModel] = useState<'presencial' | 'hibrido' | 'remoto'>('remoto')
  const [description, setDescription] = useState('')
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const created = await createJob({
        organization_id: '00000000-0000-0000-0000-000000000001',
        title,
        department,
        contract_type: contractType,
        workplace_model: workplaceModel,
        location: workplaceModel === 'remoto' ? 'Brasil (Remoto)' : 'São Paulo, SP',
        description: description || 'Posição estratégica aberta no time.',
        requirements: 'Experiência relevante na área e alinhamento cultural.',
        benefits: contractType === 'CLT' ? 'VR, VT, Plano de Saúde' : 'Recesso remunerado e bônus',
        min_salary: minSalary ? Number(minSalary) : null,
        max_salary: maxSalary ? Number(maxSalary) : null,
        status: 'aberta',
        created_by: '00000000-0000-0000-0000-000000000001',
      })

      if (created) {
        onAddJob(created)
        setOpen(false)
        setTitle('')
        setDescription('')
        setMinSalary('')
        setMaxSalary('')
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
          className="gap-2 shadow-sm font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black dark:shadow-[0_0_12px_rgba(0,255,127,0.3)]"
        >
          <Plus className="h-4 w-4" />
          <span>Criar Nova Vaga</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Abertura de Nova Vaga (ATS)</DialogTitle>
            <DialogDescription>
              Preencha as informações para cadastrar e publicar uma nova posição no sistema.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                Título da Vaga *
              </label>
              <Input
                required
                placeholder="Ex: Engenheiro(a) de Software Sênior"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Departamento *
                </label>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  options={[
                    { label: 'Engenharia de Software', value: 'Engenharia' },
                    { label: 'Design & UX', value: 'Design' },
                    { label: 'Produto & Métricas', value: 'Produto' },
                    { label: 'Gente & Gestão (RH)', value: 'Gente & Gestão' },
                    { label: 'Comercial & Vendas', value: 'Comercial' },
                    { label: 'Financeiro / Jurídico', value: 'Financeiro' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Regime de Contratação *
                </label>
                <Select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value as 'CLT' | 'PJ')}
                  options={[
                    { label: 'CLT (Consolidação das Leis do Trabalho)', value: 'CLT' },
                    { label: 'PJ (Pessoa Jurídica / Honorários)', value: 'PJ' },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  Modelo de Trabalho
                </label>
                <Select
                  value={workplaceModel}
                  onChange={(e) => setWorkplaceModel(e.target.value as any)}
                  options={[
                    { label: '100% Remoto', value: 'remoto' },
                    { label: 'Híbrido', value: 'hibrido' },
                    { label: 'Presencial', value: 'presencial' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  {contractType === 'CLT' ? 'Salário Mínimo (R$)' : 'Honorário Mín (R$)'}
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 5000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                  {contractType === 'CLT' ? 'Salário Máximo (R$)' : 'Honorário Máx (R$)'}
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 8000"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-200 font-semibold mb-1">
                Descrição da Vaga & Atividades
              </label>
              <Textarea
                placeholder="Descreva o propósito da posição, desafios técnicos e cultura do time..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                className="font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white dark:bg-[#00FF7F] dark:hover:bg-[#00FA9A] dark:text-black gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Publicando...</span>
                  </>
                ) : (
                  <span>Publicar Vaga</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
