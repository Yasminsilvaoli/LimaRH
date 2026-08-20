import { createClient } from '@/lib/supabase/client'
import {
  DisciplinaryRecordWithEmployee,
  MedicalCertificateWithEmployee,
} from '@/lib/ocorrencias-mock'
import { DisciplinaryType, CertificateStatus } from '@/types'
import { DEFAULT_ORG_ID } from './employees'

export async function fetchDisciplinaryRecords(): Promise<DisciplinaryRecordWithEmployee[]> {
  const supabase = createClient()

  try {
    const { data, error } = await (supabase.from('disciplinary_records') as any)
      .select(`
        *,
        employee:employees!disciplinary_records_employee_id_fkey (id, full_name, job_title, contract_type)
      `)
      .order('incident_date', { ascending: false })

    if (error || !data) {
      console.warn('Erro ao buscar medidas disciplinares:', error)
      return []
    }

    return (data as any[]).map((rec: any) => ({
      id: rec.id,
      employee_id: rec.employee_id,
      employee_name: rec.employee?.full_name || 'Colaborador',
      employee_role: rec.employee?.job_title || 'Colaborador',
      contract_type: rec.employee?.contract_type || 'CLT',
      type: rec.type,
      reason: rec.reason,
      incident_date: rec.incident_date,
      days_suspended: rec.days_suspended,
      document_url: rec.document_url,
      signed_at: rec.signed_at,
      registered_by: rec.registered_by,
      created_at: rec.created_at,
      updated_at: rec.updated_at,
    }))
  } catch (err) {
    console.error('Falha ao conectar com o Supabase para medidas disciplinares:', err)
    return []
  }
}

export async function createDisciplinaryRecord(data: {
  employee_name: string
  type: DisciplinaryType
  reason: string
  incident_date: string
  days_suspended?: number | null
  document_url?: string | null
}): Promise<DisciplinaryRecordWithEmployee | null> {
  const supabase = createClient()

  try {
    let empId: string | null = null

    const { data: existingEmp } = await (supabase.from('employees') as any)
      .select('id, job_title, contract_type')
      .eq('full_name', data.employee_name)
      .maybeSingle()

    if (existingEmp) {
      empId = (existingEmp as any).id
    } else {
      const { data: newEmp } = await (supabase.from('employees') as any)
        .insert({
          organization_id: DEFAULT_ORG_ID,
          full_name: data.employee_name,
          email: `${data.employee_name.toLowerCase().replace(/\s+/g, '.')}@limarh.com`,
          job_title: 'Colaborador Operacional',
          department: 'Operações',
          admission_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (newEmp) empId = (newEmp as any).id
    }

    if (!empId) return null

    const { data: rec, error } = await (supabase.from('disciplinary_records') as any)
      .insert({
        employee_id: empId,
        type: data.type,
        reason: data.reason,
        incident_date: data.incident_date,
        days_suspended: data.days_suspended || null,
        document_url: data.document_url || null,
        registered_by: 'Equipe de Gente & Gestão',
      })
      .select()
      .single()

    if (error || !rec) {
      console.error('Erro ao inserir medida disciplinar:', error)
      return null
    }

    const savedRec = rec as any

    return {
      id: savedRec.id,
      employee_id: savedRec.employee_id,
      employee_name: data.employee_name,
      employee_role: (existingEmp as any)?.job_title || 'Colaborador Operacional',
      contract_type: (existingEmp as any)?.contract_type || 'CLT',
      type: savedRec.type,
      reason: savedRec.reason,
      incident_date: savedRec.incident_date,
      days_suspended: savedRec.days_suspended,
      document_url: savedRec.document_url,
      signed_at: savedRec.signed_at,
      registered_by: savedRec.registered_by,
      created_at: savedRec.created_at,
      updated_at: savedRec.updated_at,
    }
  } catch (err) {
    console.error('Falha ao criar ocorrência disciplinar:', err)
    return null
  }
}

export async function deleteDisciplinaryRecord(id: string): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('disciplinary_records') as any).delete().eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao excluir registro disciplinar:', err)
    return false
  }
}

export async function fetchMedicalCertificates(): Promise<MedicalCertificateWithEmployee[]> {
  const supabase = createClient()

  try {
    const { data, error } = await (supabase.from('medical_certificates') as any)
      .select(`
        *,
        employee:employees!medical_certificates_employee_id_fkey (id, full_name, job_title, contract_type)
      `)
      .order('start_date', { ascending: false })

    if (error || !data) {
      console.warn('Erro ao buscar atestados médicos:', error)
      return []
    }

    return (data as any[]).map((cert: any) => ({
      id: cert.id,
      employee_id: cert.employee_id,
      employee_name: cert.employee?.full_name || 'Colaborador',
      employee_role: cert.employee?.job_title || 'Colaborador',
      contract_type: cert.employee?.contract_type || 'CLT',
      start_date: cert.start_date,
      end_date: cert.end_date,
      days_count: cert.days_count,
      cid: cert.cid,
      doctor_crm: cert.doctor_crm,
      file_url: cert.file_url,
      status: cert.status,
      created_at: cert.created_at,
      updated_at: cert.updated_at,
    }))
  } catch (err) {
    console.error('Falha ao buscar atestados:', err)
    return []
  }
}

export async function createMedicalCertificate(data: {
  employee_name: string
  start_date: string
  end_date: string
  days_count: number
  cid?: string | null
  doctor_crm?: string | null
}): Promise<MedicalCertificateWithEmployee | null> {
  const supabase = createClient()

  try {
    let empId: string | null = null

    const { data: existingEmp } = await (supabase.from('employees') as any)
      .select('id, job_title, contract_type')
      .eq('full_name', data.employee_name)
      .maybeSingle()

    if (existingEmp) {
      empId = (existingEmp as any).id
    } else {
      const { data: newEmp } = await (supabase.from('employees') as any)
        .insert({
          organization_id: DEFAULT_ORG_ID,
          full_name: data.employee_name,
          email: `${data.employee_name.toLowerCase().replace(/\s+/g, '.')}@limarh.com`,
          job_title: 'Colaborador Operacional',
          department: 'Operações',
          admission_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (newEmp) empId = (newEmp as any).id
    }

    if (!empId) return null

    const { data: cert, error } = await (supabase.from('medical_certificates') as any)
      .insert({
        employee_id: empId,
        start_date: data.start_date,
        end_date: data.end_date,
        days_count: data.days_count,
        cid: data.cid || null,
        doctor_crm: data.doctor_crm || null,
        file_url: 'https://storage.supabase.co/limarh/certs/atestado.pdf',
        status: 'pendente',
      })
      .select()
      .single()

    if (error || !cert) {
      console.error('Erro ao cadastrar atestado médico:', error)
      return null
    }

    const savedCert = cert as any

    return {
      id: savedCert.id,
      employee_id: savedCert.employee_id,
      employee_name: data.employee_name,
      employee_role: (existingEmp as any)?.job_title || 'Colaborador Operacional',
      contract_type: (existingEmp as any)?.contract_type || 'CLT',
      start_date: savedCert.start_date,
      end_date: savedCert.end_date,
      days_count: savedCert.days_count,
      cid: savedCert.cid,
      doctor_crm: savedCert.doctor_crm,
      file_url: savedCert.file_url,
      status: savedCert.status,
      created_at: savedCert.created_at,
      updated_at: savedCert.updated_at,
    }
  } catch (err) {
    console.error('Falha ao criar atestado:', err)
    return null
  }
}

export async function updateCertificateStatus(id: string, status: CertificateStatus): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('medical_certificates') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao atualizar status do atestado:', err)
    return false
  }
}

export async function deleteMedicalCertificate(id: string): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('medical_certificates') as any).delete().eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao excluir atestado:', err)
    return false
  }
}
