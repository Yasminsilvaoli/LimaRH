import { PJDetails } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatCNPJ } from '@/lib/utils'
import { Building2, FileText, Landmark, Calendar, CreditCard, Download, ExternalLink } from 'lucide-react'

interface PJDetailsTabProps {
  details?: PJDetails | null
  rate: number
}

export function PJDetailsTab({ details, rate }: PJDetailsTabProps) {
  if (!details) {
    return (
      <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
        Nenhum registro societário PJ encontrado para este prestador.
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Dados Societários da PJ */}
      <Card className="border border-slate-200 dark:border-zinc-800 shadow-xs">
        <CardHeader className="pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-zinc-800">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Dados Cadastrais da Empresa Prestadora (PJ)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 text-xs">
          <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
            <p className="text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              Razão Social
            </p>
            <p className="font-bold text-slate-800 dark:text-zinc-100 text-sm mt-0.5">{details.company_name}</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
            <p className="text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              CNPJ
            </p>
            <p className="font-bold text-slate-800 dark:text-zinc-100 text-sm mt-0.5">{details.cnpj}</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
            <p className="text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              Nome Fantasia
            </p>
            <p className="font-bold text-slate-800 dark:text-zinc-100 text-sm mt-0.5">
              {details.trade_name || 'Mesmo da Razão Social'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contrato & Faturamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border border-slate-200 dark:border-zinc-800 shadow-xs">
          <CardHeader className="pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Honorários & Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-4 space-y-2.5 sm:space-y-3 text-xs">
            <div className="p-2.5 sm:p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
              <div>
                <p className="text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                  Honorário Mensal Acordado
                </p>
                <p className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(rate)}</p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 font-bold text-[10px] rounded">
                Sem Vínculo Empregatício
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
              <span className="text-slate-600 dark:text-zinc-400 font-medium">Dia de Emissão / Vencimento de NF:</span>
              <span className="font-bold text-slate-900 dark:text-white">Todo dia {details.invoice_due_day}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
              <span className="text-slate-600 dark:text-zinc-400 font-medium">Vigência Contratual:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {details.contract_valid_until
                  ? new Date(details.contract_valid_until).toLocaleDateString('pt-BR')
                  : 'Indeterminado'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Dados Bancários & PIX */}
        <Card className="border border-slate-200 dark:border-zinc-800 shadow-xs">
          <CardHeader className="pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Dados para Liquidação & Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-4 space-y-2.5 sm:space-y-3 text-xs">
            <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50 space-y-1">
              <p className="text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                Instituição Bancária
              </p>
              <p className="font-bold text-slate-800 dark:text-zinc-100">{details.bank_name || 'Não informado'}</p>
              <p className="text-slate-600 dark:text-zinc-400">
                Agência: {details.bank_agency || '-'} | Conta Corrente PJ: {details.bank_account || '-'}
              </p>
            </div>

            <div className="p-2.5 sm:p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
              <div>
                <p className="text-indigo-800 dark:text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
                  Chave PIX (PJ)
                </p>
                <p className="font-bold text-indigo-950 dark:text-indigo-200 font-mono text-sm mt-0.5">
                  {details.pix_key || 'Não informada'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
