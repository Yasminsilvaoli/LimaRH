import { EmployeeWithDetails } from '@/types'
import { exportToExcel, exportToCSV, ExcelColumn } from '@/lib/excel-export'

const employeeColumns: ExcelColumn<EmployeeWithDetails>[] = [
  {
    header: 'ID',
    key: 'id',
    type: 'string',
    align: 'center',
    width: 14,
  },
  {
    header: 'Nome Completo',
    key: 'full_name',
    type: 'string',
    width: 28,
  },
  {
    header: 'E-mail',
    key: 'email',
    type: 'string',
    width: 30,
  },
  {
    header: 'Telefone',
    key: 'phone',
    type: 'string',
    width: 18,
    formatter: (val) => val || '-',
  },
  {
    header: 'Regime',
    key: 'contract_type',
    type: 'string',
    align: 'center',
    width: 12,
  },
  {
    header: 'Cargo',
    key: 'job_title',
    type: 'string',
    width: 26,
  },
  {
    header: 'Departamento',
    key: 'department',
    type: 'string',
    width: 22,
  },
  {
    header: 'Status',
    key: 'status',
    type: 'string',
    align: 'center',
    width: 14,
    formatter: (val) => {
      const map: Record<string, string> = {
        ativo: 'Ativo',
        inativo: 'Inativo',
        ferias: 'Ferias',
        afastado: 'Afastado',
        desligado: 'Desligado',
      }
      return map[val] || val
    },
  },
  {
    header: 'Remuneracao Base',
    key: 'salary_or_rate',
    type: 'currency',
    width: 20,
    formatter: (val) => (typeof val === 'number' ? val : Number(val) || 0),
  },
  {
    header: 'Data de Admissao',
    key: 'admission_date',
    type: 'date',
    align: 'center',
    width: 18,
    formatter: (val) => {
      if (!val) return '-'
      try {
        const d = new Date(val)
        return isNaN(d.getTime()) ? val : d.toLocaleDateString('pt-BR')
      } catch {
        return val
      }
    },
  },
  {
    header: 'Gestor Direto',
    key: 'manager',
    type: 'string',
    width: 24,
    formatter: (_, emp) => emp.manager?.full_name || 'Diretoria / Sem Gestor',
  },
  {
    header: 'CPF / CNPJ',
    key: 'doc',
    type: 'string',
    align: 'center',
    width: 20,
    formatter: (_, emp) => {
      if (emp.contract_type === 'CLT') {
        return emp.clt_details?.cpf || '-'
      }
      return emp.pj_details?.cnpj || '-'
    },
  },
  {
    header: 'Detalhes Contratuais / Beneficios',
    key: 'details',
    type: 'wrapText',
    width: 40,
    formatter: (_, emp) => {
      if (emp.contract_type === 'CLT') {
        const vr = emp.clt_details?.meal_voucher_value ? 'VR: R$ ' + emp.clt_details.meal_voucher_value : 'Sem VR'
        const saude = emp.clt_details?.health_insurance ? 'Plano de Saude: Sim' : 'Plano: Nao'
        const vt = emp.clt_details?.transport_voucher ? 'VT: Sim' : 'VT: Nao'
        return [vr, saude, vt].join(' | ')
      }
      const razao = emp.pj_details?.company_name ? 'Razao: ' + emp.pj_details.company_name : ''
      const pix = emp.pj_details?.pix_key ? 'PIX: ' + emp.pj_details.pix_key : ''
      const venc = emp.pj_details?.invoice_due_day ? 'Vencimento NF: Dia ' + emp.pj_details.invoice_due_day : ''
      return [razao, pix, venc].filter(Boolean).join(' | ') || '-'
    },
  },
]

export async function exportEmployeesToExcel(employees: EmployeeWithDetails[]) {
  const dateStr = new Date().toISOString().split('T')[0]
  await exportToExcel({
    filename: 'colaboradores_limarh_' + dateStr + '.xlsx',
    sheetName: 'Colaboradores',
    columns: employeeColumns,
    data: employees,
  })
}

export function exportEmployeesToCSV(employees: EmployeeWithDetails[]) {
  const dateStr = new Date().toISOString().split('T')[0]
  exportToCSV({
    filename: 'colaboradores_limarh_' + dateStr + '.csv',
    columns: employeeColumns,
    data: employees,
  })
}