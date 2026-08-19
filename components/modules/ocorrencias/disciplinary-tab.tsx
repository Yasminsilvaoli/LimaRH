'use client'

import { useState } from 'react'
import { DisciplinaryRecordWithEmployee } from '@/lib/ocorrencias-mock'
import { NewDisciplinaryDialog } from '@/components/modules/ocorrencias/new-disciplinary-dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldAlert, AlertTriangle, Calendar, FileText, Download, CheckCircle2 } from 'lucide-react'

interface DisciplinaryTabProps {
  initialData: DisciplinaryRecordWithEmployee[]
}

export function DisciplinaryTab({ initialData }: DisciplinaryTabProps) {
  const [records, setRecords] = useState<DisciplinaryRecordWithEmployee[]>(initialData)

  const handleAddRecord = (newRec: DisciplinaryRecordWithEmployee) => {
    setRecords((prev) => [newRec, ...prev])
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'suspensao':
        return <Badge variant="destructive">Suspensão Disciplinar</Badge>
      case 'advertencia_escrita':
        return <Badge variant="warning">Advertência Escrita</Badge>
      default:
        return <Badge variant="secondary">Advertência Verbal</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Medidas Disciplinares & Termos</h2>
          <p className="text-xs text-slate-500">
            Registro legal de advertências verbais, advertências formais e suspensões trabalhistas.
          </p>
        </div>

        <NewDisciplinaryDialog onAddRecord={handleAddRecord} />
      </div>

      <div className="space-y-4">
        {records.map((rec) => {
          const incidentDate = new Date(rec.incident_date).toLocaleDateString('pt-BR')

          return (
            <Card key={rec.id} className="border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(rec.type)}
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-bold text-slate-800">
                      {rec.employee_name} ({rec.employee_role})
                    </span>
                    <Badge variant={rec.contract_type === 'CLT' ? 'clt' : 'pj'}>
                      {rec.contract_type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Incidente em: {incidentDate}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3 text-xs">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Motivo Formal / Fatos
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">{rec.reason}</p>
                </div>

                {rec.days_suspended && (
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 flex items-center justify-between">
                    <span className="font-bold text-rose-900">
                      Tempo de Afastamento Disciplinar:
                    </span>
                    <span className="font-extrabold text-rose-700 text-sm">
                      {rec.days_suspended} {rec.days_suspended === 1 ? 'dia' : 'dias'} de suspensão
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-slate-500 gap-2">
                  <span className="text-[11px]">
                    Registrado por: <strong>{rec.registered_by}</strong>
                  </span>

                  {rec.document_url && (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Assinado digitalmente
                      </span>
                      <a
                        href={rec.document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-semibold"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Ver Documento Anexo
                      </a>
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
