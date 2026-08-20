'use client'

import { useState } from 'react'
import { MedicalCertificateWithEmployee } from '@/lib/ocorrencias-mock'
import { NewMedicalCertificateDialog } from '@/components/modules/ocorrencias/new-medical-certificate-dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeartPulse, Calendar, Check, X, FileText, AlertCircle } from 'lucide-react'

interface MedicalCertificatesTabProps {
  initialData: MedicalCertificateWithEmployee[]
}

export function MedicalCertificatesTab({
  initialData,
}: MedicalCertificatesTabProps) {
  const [certificates, setCertificates] = useState<MedicalCertificateWithEmployee[]>(initialData)

  const handleAddCert = (newCert: MedicalCertificateWithEmployee) => {
    setCertificates((prev) => [newCert, ...prev])
  }

  const handleUpdateStatus = (
    certId: string,
    newStatus: 'aprovado' | 'rejeitado'
  ) => {
    setCertificates((prev) =>
      prev.map((c) => (c.id === certId ? { ...c, status: newStatus } : c))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Atestados Médicos & Licenças</h2>
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">
            Validação de saúde ocupacional, abono de faltas e conformidade legal.
          </p>
        </div>

        <NewMedicalCertificateDialog onAddCertificate={handleAddCert} />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {certificates.map((cert) => {
          const startDate = new Date(cert.start_date).toLocaleDateString('pt-BR')
          const endDate = new Date(cert.end_date).toLocaleDateString('pt-BR')
          const isPending = cert.status === 'pendente'

          return (
            <Card
              key={cert.id}
              className="border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
            >
              <CardHeader className="pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        cert.status === 'aprovado'
                          ? 'success'
                          : cert.status === 'pendente'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {cert.status === 'aprovado'
                        ? 'Atestado Aprovado'
                        : cert.status === 'pendente'
                        ? 'Pendente de Validação'
                        : 'Rejeitado'}
                    </Badge>
                    <span className="text-xs text-slate-300 dark:text-zinc-600">•</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                      {cert.employee_name} ({cert.employee_role})
                    </span>
                    <Badge variant={cert.contract_type === 'CLT' ? 'clt' : 'pj'}>
                      {cert.contract_type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
                    <span>Período: {startDate} a {endDate} ({cert.days_count} {cert.days_count === 1 ? 'dia' : 'dias'})</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-3 sm:pt-4 space-y-2.5 sm:space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
                  <div>
                    <span className="text-slate-400 dark:text-zinc-500 font-semibold uppercase text-[10px]">
                      CID Informado
                    </span>
                    <p className="font-bold text-slate-800 dark:text-zinc-100 mt-0.5">
                      {cert.cid || 'Não informado (sigilo médico)'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 dark:text-zinc-500 font-semibold uppercase text-[10px]">
                      Profissional Emissor / CRM
                    </span>
                    <p className="font-bold text-slate-800 dark:text-zinc-100 mt-0.5">
                      {cert.doctor_crm || 'Não especificado'}
                    </p>
                  </div>
                </div>

                {cert.days_count > 15 && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      Afastamento superior a 15 dias: colaborador elegível para benefício por incapacidade temporária (INSS).
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <a
                    href={cert.file_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold text-[11px]"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Visualizar Anexo do Atestado
                  </a>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(cert.id, 'rejeitado')}
                        className="h-7 text-xs px-3"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Rejeitar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(cert.id, 'aprovado')}
                        className="h-7 text-xs px-3 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Aprovar & Abonar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
