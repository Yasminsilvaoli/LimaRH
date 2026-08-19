import { DisciplinaryRecord, MedicalCertificate } from '@/types'

export interface DisciplinaryRecordWithEmployee extends DisciplinaryRecord {
  employee_name: string
  employee_role: string
  contract_type: 'CLT' | 'PJ'
}

export interface MedicalCertificateWithEmployee extends MedicalCertificate {
  employee_name: string
  employee_role: string
  contract_type: 'CLT' | 'PJ'
}

export const INITIAL_MOCK_DISCIPLINARY: DisciplinaryRecordWithEmployee[] = [
  {
    id: 'disc-1',
    employee_id: 'emp-1',
    employee_name: 'Lucas Silveira Mendes',
    employee_role: 'Dev Full Stack',
    contract_type: 'CLT',
    type: 'advertencia_verbal',
    reason: 'Atrasos reiterados sem comunicação prévia no daily meeting nas últimas 2 semanas.',
    incident_date: '2026-03-10',
    days_suspended: null,
    document_url: null,
    signed_at: '2026-03-10T14:30:00Z',
    registered_by: 'Carlos Eduardo Ramos (CTO)',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'disc-2',
    employee_id: 'emp-3',
    employee_name: 'Rodrigo Barbosa Alencar',
    employee_role: 'Especialista DB',
    contract_type: 'CLT',
    type: 'suspensao',
    reason: 'Descumprimento grave de política de segurança da informação ao transferir credenciais sem autorização.',
    incident_date: '2026-02-15',
    days_suspended: 3,
    document_url: 'https://storage.supabase.co/limarh/docs/suspensao-emp-3.pdf',
    signed_at: '2026-02-15T10:00:00Z',
    registered_by: 'Ana Paula Rocha (RH)',
    created_at: new Date(Date.now() - 50 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const INITIAL_MOCK_CERTIFICATES: MedicalCertificateWithEmployee[] = [
  {
    id: 'cert-1',
    employee_id: 'emp-1',
    employee_name: 'Lucas Silveira Mendes',
    employee_role: 'Dev Full Stack',
    contract_type: 'CLT',
    start_date: '2026-04-01',
    end_date: '2026-04-03',
    days_count: 3,
    cid: 'J06.9 (Infecção respiratória)',
    doctor_crm: 'CRM/SP 123456 - Dr. Roberto Dias',
    file_url: 'https://storage.supabase.co/limarh/certs/atestado-lucas.pdf',
    status: 'aprovado',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cert-2',
    employee_id: 'emp-2',
    employee_name: 'Mariana Duarte Costa',
    employee_role: 'Product Designer',
    contract_type: 'PJ',
    start_date: '2026-04-12',
    end_date: '2026-04-13',
    days_count: 2,
    cid: 'K52.9 (Gastroenterite aguda)',
    doctor_crm: 'CRM/PR 654321 - Dra. Juliana Santos',
    file_url: 'https://storage.supabase.co/limarh/certs/atestado-mariana.pdf',
    status: 'pendente',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cert-3',
    employee_id: 'emp-4',
    employee_name: 'Camila Ferreira Lima',
    employee_role: 'People Analytics',
    contract_type: 'PJ',
    start_date: '2026-03-20',
    end_date: '2026-04-06',
    days_count: 18,
    cid: 'M54.5 (Lombalgia crônica / Cirurgia)',
    doctor_crm: 'CRM/MG 987654 - Dr. Paulo Freire',
    file_url: 'https://storage.supabase.co/limarh/certs/atestado-camila.pdf',
    status: 'aprovado',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]
