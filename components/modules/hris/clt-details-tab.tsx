import { CLTDetails } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatCurrency, formatCPF } from '@/lib/utils'
import { FileText, Shield, Utensils, Bus, HeartPulse } from 'lucide-react'

interface CLTDetailsTabProps {
  details?: CLTDetails | null
  salary: number
}

export function CLTDetailsTab({ details, salary }: CLTDetailsTabProps) {
  if (!details) {
    return (
      <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
        Nenhum registro de documentação CLT encontrado para este colaborador.
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Documentos Oficiais */}
      <Card className="border border-slate-200 dark:border-zinc-800 shadow-xs">
        <CardHeader className="pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-zinc-800">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            Documentação Trabalhista & Previdenciária
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-xs">
          <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
            <p className="text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              CPF
            </p>
            <p className="font-bold text-slate-800 dark:text-zinc-100 text-sm mt-0.5">{details.cpf}</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
            <p className="text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              RG
            </p>
            <p className="font-bold text-slate-800 dark:text-zinc-100 text-sm mt-0.5">{details.rg || 'Não informado'}</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
            <p className="text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              PIS / PASEP
            </p>
            <p className="font-bold text-slate-800 dark:text-zinc-100 text-sm mt-0.5">
              {details.pis_pasep || 'Não informado'}
            </p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700/50">
            <p className="text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              CTPS Digital (Nº / Série)
            </p>
            <p className="font-bold text-slate-800 dark:text-zinc-100 text-sm mt-0.5">
              {details.ctps_number} / {details.ctps_series}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pacote de Benefícios e Remuneração Base */}
      <Card className="border border-slate-200 dark:border-zinc-800 shadow-xs">
        <CardHeader className="pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-zinc-800">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Remuneração & Pacote de Benefícios Legais
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs">
          <div className="p-3 sm:p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <p className="text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              Salário Base Registrado
            </p>
            <p className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(salary)}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Base para FGTS e INSS</p>
          </div>

          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700/50 space-y-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-100 font-semibold">
              <Utensils className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Vale Refeição / Alimentação</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {details.meal_voucher_value ? formatCurrency(details.meal_voucher_value) : 'Não optante'}
            </p>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">Cartão multibenefícios</span>
          </div>

          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700/50 space-y-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-100 font-semibold">
              <HeartPulse className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <span>Assistência Médica / Odonto</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {details.health_insurance ? 'Plano Nacional Ativo' : 'Não optante'}
            </p>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">Coparticipação padrão</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
