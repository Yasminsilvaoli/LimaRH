'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { JobWithMetrics } from '@/lib/mock-data'
import { downloadJobTemplateCSV, downloadJobTemplateExcel } from '@/lib/csv-template'
import { formatCurrency } from '@/lib/utils'

interface ImportJobsDialogProps {
  onImportSuccess: (jobs: JobWithMetrics[]) => void
}

interface ParsedJobRow {
  titulo?: string
  departamento?: string
  tipo_contrato?: string
  modelo_trabalho?: string
  localizacao?: string
  salario_minimo?: string
  salario_maximo?: string
  descricao?: string
  requisitos?: string
  beneficios?: string
  isValid: boolean
  errors: string[]
}

export function ImportJobsDialog({ onImportSuccess }: ImportJobsDialogProps) {
  const [open, setOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<ParsedJobRow[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetState = () => {
    setFile(null)
    setParsedRows([])
    setIsProcessing(false)
  }

  const validateRow = (row: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!row.titulo || String(row.titulo).trim() === '') {
      errors.push('Título é obrigatório')
    }

    if (!row.departamento || String(row.departamento).trim() === '') {
      errors.push('Departamento é obrigatório')
    }

    const contractType = String(row.tipo_contrato || '').toUpperCase().trim()
    if (!['CLT', 'PJ'].includes(contractType)) {
      errors.push('Tipo de contrato deve ser CLT ou PJ')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const processFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      alert('Por favor, selecione um arquivo no formato .csv')
      return
    }

    setFile(selectedFile)
    setIsProcessing(true)

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      delimitersToGuess: [';', ',', '\t', '|'],
      complete: (results) => {
        const rows: ParsedJobRow[] = (results.data as any[]).map((row) => {
          const { isValid, errors } = validateRow(row)
          return {
            titulo: row.titulo || row.title,
            departamento: row.departamento || row.department,
            tipo_contrato: (row.tipo_contrato || row.contract_type || 'CLT').toUpperCase().trim(),
            modelo_trabalho: (row.modelo_trabalho || row.workplace_model || 'remoto').toLowerCase().trim(),
            localizacao: row.localizacao || row.location,
            salario_minimo: row.salario_minimo || row.min_salary,
            salario_maximo: row.salario_maximo || row.max_salary,
            descricao: row.descricao || row.description,
            requisitos: row.requisitos || row.requirements,
            beneficios: row.beneficios || row.benefits,
            isValid,
            errors,
          }
        })

        setParsedRows(rows)
        setIsProcessing(false)
      },
      error: (err) => {
        console.error('Erro ao ler CSV:', err)
        alert('Erro ao processar o arquivo CSV. Verifique a formatação.')
        setIsProcessing(false)
      },
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const validRows = parsedRows.filter((r) => r.isValid)
  const invalidRows = parsedRows.filter((r) => !r.isValid)

  const handleConfirmImport = () => {
    if (validRows.length === 0) return

    const newJobs: JobWithMetrics[] = validRows.map((r, index) => ({
      id: `job-imported-${Date.now()}-${index}`,
      organization_id: 'org-1',
      title: r.titulo!,
      department: r.departamento!,
      contract_type: r.tipo_contrato as 'CLT' | 'PJ',
      workplace_model: (r.modelo_trabalho as any) || 'remoto',
      location: r.localizacao || 'Brasil (Remoto)',
      description: r.descricao || 'Descrição da vaga importada via planilha.',
      requirements: r.requisitos || 'Não especificado',
      benefits: r.beneficios || (r.tipo_contrato === 'CLT' ? 'VR, VT, Plano de Saúde' : 'Recesso remunerado'),
      min_salary: r.salario_minimo ? Number(r.salario_minimo) : null,
      max_salary: r.salario_maximo ? Number(r.salario_maximo) : null,
      status: 'aberta',
      created_by: 'user-admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_candidates: 0,
      in_progress: 0,
      hired: 0,
    }))

    onImportSuccess(newJobs)
    setOpen(false)
    resetState()
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2 shadow-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-300"
      >
        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
        <span>Importar Planilha</span>
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) resetState()
        }}
      >
        <DialogContent
          onClose={() => {
            setOpen(false)
            resetState()
          }}
          className="max-w-2xl"
        >
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600">
              <FileSpreadsheet className="h-5 w-5" />
              <DialogTitle>Importação em Massa de Vagas</DialogTitle>
            </div>
            <DialogDescription>
              Faça upload de uma planilha CSV para cadastrar múltiplas oportunidades simultaneamente no LimaRH.
            </DialogDescription>
          </DialogHeader>

          {/* Download Model Button Banner */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="text-xs">
              <p className="font-semibold text-slate-900">Ainda não tem a planilha no padrão?</p>
              <p className="text-slate-500">Baixe nosso arquivo modelo com os cabeçalhos e exemplos preenchidos.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadJobTemplateExcel}
                className="text-xs h-8 gap-1.5 font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Modelo Excel (.XLSX)</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={downloadJobTemplateCSV}
                className="text-xs h-8 gap-1 text-slate-600 hover:text-slate-900"
              >
                <span>.CSV</span>
              </Button>
            </div>
          </div>

          {/* Dropzone Area */}
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <UploadCloud className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                Arraste seu arquivo CSV aqui ou clique para selecionar
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Suporta arquivos .csv delimitados por vírgula
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected File Header */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-xs">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">{file.name}</span>
                  <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetState}
                  className="h-7 text-xs text-slate-500 hover:text-rose-600"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Trocar arquivo
                </Button>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-900">{validRows.length} vagas válidas</p>
                    <p className="text-[11px] text-emerald-700">Prontas para importação</p>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                  invalidRows.length > 0
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <AlertCircle className={`h-5 w-5 shrink-0 ${invalidRows.length > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-bold">{invalidRows.length} com erros</p>
                    <p className="text-[11px] opacity-80">Serão desconsideradas</p>
                  </div>
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Título da Vaga</th>
                      <th className="px-3 py-2">Área</th>
                      <th className="px-3 py-2">Regime</th>
                      <th className="px-3 py-2">Salário/Honorário</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className={row.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/40'}>
                        <td className="px-3 py-2">
                          {row.isValid ? (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              OK
                            </span>
                          ) : (
                            <span
                              title={row.errors.join(', ')}
                              className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded cursor-help"
                            >
                              Erro
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-800">
                          {row.titulo || <span className="text-rose-500 italic">Sem título</span>}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {row.departamento || <span className="text-rose-500 italic">-</span>}
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant={row.tipo_contrato === 'PJ' ? 'pj' : 'clt'}>
                            {row.tipo_contrato || 'Inválido'}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-slate-600 font-medium">
                          {row.salario_minimo && row.salario_maximo
                            ? `${formatCurrency(Number(row.salario_minimo))} - ${formatCurrency(Number(row.salario_maximo))}`
                            : 'A combinar'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                resetState()
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmImport}
              disabled={validRows.length === 0 || isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
            >
              Importar {validRows.length > 0 ? `(${validRows.length}) Vagas` : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
