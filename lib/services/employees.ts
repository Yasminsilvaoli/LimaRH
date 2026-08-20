import { createClient } from '@/lib/supabase/client'
import { EmployeeWithDetails, CLTDetails, PJDetails, ContractType, EmployeeStatus } from '@/types'

export const DEFAULT_ORG_ID = '00000000-0000-0000-0000-000000000001'

export interface CreateEmployeeInput {
  organization_id?: string
  profile_id?: string | null
  full_name: string
  email: string
  phone?: string | null
  birth_date?: string | null
  contract_type: ContractType
  job_title: string
  department: string
  manager_id?: string | null
  admission_date: string
  resignation_date?: string | null
  status?: EmployeeStatus
  salary_or_rate?: number
  clt_details?: {
    cpf: string
    rg?: string | null
    pis_pasep?: string | null
    ctps_number?: string | null
    ctps_series?: string | null
    transport_voucher?: boolean
    meal_voucher_value?: number | null
    health_insurance?: boolean
  } | null
  pj_details?: {
    company_name: string
    trade_name?: string | null
    cnpj: string
    invoice_due_day?: number
    contract_valid_until?: string | null
    contract_file_url?: string | null
    bank_name?: string | null
    bank_agency?: string | null
    bank_account?: string | null
    pix_key?: string | null
  } | null
}

export async function fetchEmployees(): Promise<EmployeeWithDetails[]> {
  const supabase = createClient()

  try {
    const { data: employees, error } = await (supabase.from('employees') as any)
      .select(`
        *,
        clt_details (*),
        pj_details (*)
      `)
      .order('created_at', { ascending: false })

    if (error || !employees) {
      console.warn('Erro ao carregar colaboradores do Supabase:', error)
      return []
    }

    return (employees as any[]).map((emp: any) => ({
      ...emp,
      clt_details: Array.isArray(emp.clt_details) ? emp.clt_details[0] || null : emp.clt_details || null,
      pj_details: Array.isArray(emp.pj_details) ? emp.pj_details[0] || null : emp.pj_details || null,
      manager: emp.manager_id ? { id: emp.manager_id, full_name: 'Gestor Responsável' } : null,
    }))
  } catch (err) {
    console.error('Falha ao conectar com o Supabase:', err)
    return []
  }
}

export async function createEmployee(
  employee: CreateEmployeeInput
): Promise<EmployeeWithDetails | null> {
  const supabase = createClient()

  try {
    // 1. Inserir employee
    const { data: empData, error: empError } = await (supabase.from('employees') as any)
      .insert({
        organization_id: employee.organization_id || DEFAULT_ORG_ID,
        full_name: employee.full_name,
        email: employee.email,
        phone: employee.phone || null,
        birth_date: employee.birth_date || '1995-01-01',
        contract_type: employee.contract_type,
        job_title: employee.job_title,
        department: employee.department,
        manager_id: employee.manager_id || null,
        admission_date: employee.admission_date,
        resignation_date: employee.resignation_date || null,
        status: employee.status || 'ativo',
        salary_or_rate: employee.salary_or_rate || 0,
      })
      .select()
      .single()

    if (empError || !empData) {
      console.error('Erro ao inserir colaborador:', empError)
      return null
    }

    const savedEmp = empData as any
    let cltRecord: CLTDetails | null = null
    let pjRecord: PJDetails | null = null

    // 2. Inserir detalhes CLT se aplicável
    if (employee.contract_type === 'CLT' && employee.clt_details) {
      const { data: cltData, error: cltError } = await (supabase.from('clt_details') as any)
        .insert({
          employee_id: savedEmp.id,
          cpf: employee.clt_details.cpf || '000.000.000-00',
          rg: employee.clt_details.rg || null,
          pis_pasep: employee.clt_details.pis_pasep || null,
          ctps_number: employee.clt_details.ctps_number || '1234567',
          ctps_series: employee.clt_details.ctps_series || '0010',
          transport_voucher: employee.clt_details.transport_voucher || false,
          meal_voucher_value: employee.clt_details.meal_voucher_value || null,
          health_insurance: employee.clt_details.health_insurance || false,
        })
        .select()
        .single()

      if (!cltError && cltData) {
        cltRecord = cltData as CLTDetails
      }
    }

    // 3. Inserir detalhes PJ se aplicável
    if (employee.contract_type === 'PJ' && employee.pj_details) {
      const { data: pjData, error: pjError } = await (supabase.from('pj_details') as any)
        .insert({
          employee_id: savedEmp.id,
          company_name: employee.pj_details.company_name || employee.full_name + ' LTDA',
          trade_name: employee.pj_details.trade_name || null,
          cnpj: employee.pj_details.cnpj || '00.000.000/0001-00',
          invoice_due_day: employee.pj_details.invoice_due_day || 10,
          contract_valid_until: employee.pj_details.contract_valid_until || null,
          contract_file_url: employee.pj_details.contract_file_url || null,
          bank_name: employee.pj_details.bank_name || null,
          bank_agency: employee.pj_details.bank_agency || null,
          bank_account: employee.pj_details.bank_account || null,
          pix_key: employee.pj_details.pix_key || null,
        })
        .select()
        .single()

      if (!pjError && pjData) {
        pjRecord = pjData as PJDetails
      }
    }

    return {
      ...savedEmp,
      clt_details: cltRecord,
      pj_details: pjRecord,
      manager: savedEmp.manager_id ? { id: savedEmp.manager_id, full_name: 'Gestor Responsável' } : null,
    }
  } catch (err) {
    console.error('Falha na criação do colaborador:', err)
    return null
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('employees') as any).delete().eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao excluir colaborador:', err)
    return false
  }
}
