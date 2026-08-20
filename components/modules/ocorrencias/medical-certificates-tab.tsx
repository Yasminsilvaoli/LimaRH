'use client'

import { useState, useEffect } from 'react'
import { MedicalCertificateWithEmployee } from '@/lib/ocorrencias-mock'
import { NewMedicalCertificateDialog } from '@/components/modules/ocorrencias/new-medical-certificate-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  fetchMedicalCertificates,
  updateCertificateStatus,
  deleteMedicalCertificate,
} from '@/lib/services/ocorrencias'
import { HeartPulse, Calendar, Check, X, Clock, Trash2, Loader2 } from 'lucide-react'

interface MedicalCertificatesTabProps {
  initialData?: MedicalCertificateWithEmployee[]
}

export function MedicalCertificatesTab({
  initialData = [],
}: MedicalCertificatesTabProps) {
  const [certificates, setCertificates] = useState<MedicalCertificateWithEmployee[]>(initialData)
  const [isLoading, setIsLoading] = useState(initialData.length === 0)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const data = await fetchMedicalCertificates()
        if (isMounted) setCertificates(data)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const handleAddCertificate = (newCert: MedicalCertificateWithEmployee) => {
    setCertificates((prev) => [newCert, ...prev])
  }

  const handleUpdateStatus = async (
    id: string,
    status: 'aprovado' | 'rejeitado'
  ) => {
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    )
    await updateCertificateStatus(id, status)
  }

  const handleDeleteCertificate = async (id: string, empName: string) => {
    if (!confirm(`Deseja excluir o atestado de ${empName}?`)) return
    const success = await deleteMedicalCertificate(id)
    if (success) {
      setCertificates((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge variant="success">Homologado pelo RH</Badge>
      case 'rejeitado':
        return <Badge variant="destructive">Não Homologado</Badge>
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <Clock className="h-3 w-3" />
            <span>Pendente de Validação</span>
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Atestados Médicos & Afastamentos</h2>
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">
            Controle de saúde ocupacional, CID-10 e homologação de afastamentos pelo RH.
          </p>
        </div>

        <NewMedicalCertificateDialog onAddCertificate={handleAddCertificate} />
      </div>

      {isLoading ? (
        <div className="led-card p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-xs text-[var(--muted-foreground)] font-medium">Carregando atestados médicos...</p>
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={HeartPulse}
          title="Nenhum atestado médico registrado"
          description="Nenhum colaborador possui registro de atestado médico ou afastamento ativo no momento."
          actionNode={
            <NewMedicalCertificateDialog
              onAddCertificate={handleAddCertificate}
              trigger={
                <Button className="h-10 px-5 rounded-xl font-bold text-xs gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <HeartPulse className="h-4 w-4" />
                  <span>Lançar Primeiro Atestado</span>
                </Button>
              }
            />
          }
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {certificates.map((cert) => {
            const start = new Date(cert.start_date).toLocaleDateString('pt-BR')
            const end = new Date(cert.end_date).toLocaleDateString('pt-BR')
            const isPending = cert.status === 'pendente'

            return (
              <Card key={cert.id} className="border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                <CardHeader className="pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(cert.status)}
                      <span className="text-xs text-slate-300 dark:text-zinc-600">•</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                        {cert.employee_name} ({cert.employee_role})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
                        <span>
                          {start} até {end} ({cert.days_count} {cert.days_count === 1 ? 'dia' : 'dias'})
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteCertificate(cert.id, cert.employee_name)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded"
                        title="Excluir atestado"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-3 sm:pt-4 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-zinc-300">
                    <div>
                      <span className="font-semibold text-slate-400 dark:text-zinc-500">CID-10: </span>
                      <span>{cert.cid || 'Não informado no documento'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400 dark:text-zinc-500">Médico Emissor: </span>
                      <span>{cert.doctor_crm || 'Atestado emitido por serviço credenciado'}</span>
                    </div>
                  </div>

                  {isPending && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span className="font-medium text-xs">
                          Atestado aguardando homologação médica do RH.
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(cert.id, 'rejeitado')}
                          className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 gap-1 font-semibold"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Recusar</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(cert.id, 'aprovado')}
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 font-semibold"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Homologar Atestado</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
