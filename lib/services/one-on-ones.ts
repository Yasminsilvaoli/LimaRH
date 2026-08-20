import { createClient } from '@/lib/supabase/client'
import { OneOnOneWithUsers } from '@/lib/performance-mock'
import { DEFAULT_ORG_ID } from './employees'

export async function fetchOneOnOnes(): Promise<OneOnOneWithUsers[]> {
  const supabase = createClient()

  try {
    const { data, error } = await (supabase.from('one_on_ones') as any)
      .select(`
        *,
        employee:employees!one_on_ones_employee_id_fkey (id, full_name, job_title),
        manager:employees!one_on_ones_manager_id_fkey (id, full_name)
      `)
      .order('scheduled_at', { ascending: false })

    if (error || !data) {
      console.warn('Erro ao carregar 1:1s do Supabase:', error)
      return []
    }

    return (data as any[]).map((item: any) => ({
      id: item.id,
      organization_id: item.organization_id,
      manager_id: item.manager_id,
      employee_id: item.employee_id,
      manager_name: item.manager?.full_name || 'Gestor Responsável',
      employee_name: item.employee?.full_name || 'Colaborador',
      employee_role: item.employee?.job_title || 'Colaborador',
      scheduled_at: item.scheduled_at,
      status: item.status,
      manager_notes: item.manager_notes,
      employee_notes: item.employee_notes,
      action_items: Array.isArray(item.action_items) ? item.action_items : [],
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))
  } catch (err) {
    console.error('Falha ao buscar reuniões 1:1:', err)
    return []
  }
}

export async function createOneOnOne(data: {
  employee_id?: string
  employee_name: string
  employee_role?: string
  manager_name?: string
  scheduled_at: string
  manager_notes?: string
  action_items?: any[]
}): Promise<OneOnOneWithUsers | null> {
  const supabase = createClient()

  try {
    let targetEmpId = data.employee_id

    if (!targetEmpId) {
      const { data: existingEmp } = await (supabase.from('employees') as any)
        .select('id')
        .eq('full_name', data.employee_name)
        .maybeSingle()

      if (existingEmp) {
        targetEmpId = (existingEmp as any).id
      } else {
        const { data: newEmp } = await (supabase.from('employees') as any)
          .insert({
            organization_id: DEFAULT_ORG_ID,
            full_name: data.employee_name,
            email: `${data.employee_name.toLowerCase().replace(/\s+/g, '.')}@limarh.com`,
            job_title: data.employee_role || 'Colaborador',
            department: 'Geral',
            admission_date: new Date().toISOString().split('T')[0],
          })
          .select()
          .single()

        if (newEmp) targetEmpId = (newEmp as any).id
      }
    }

    if (!targetEmpId) {
      console.error('Não foi possível associar um colaborador à 1:1')
      return null
    }

    const { data: meeting, error } = await (supabase.from('one_on_ones') as any)
      .insert({
        organization_id: DEFAULT_ORG_ID,
        manager_id: targetEmpId,
        employee_id: targetEmpId,
        scheduled_at: data.scheduled_at,
        status: 'agendada',
        manager_notes: data.manager_notes || null,
        action_items: data.action_items || [],
      })
      .select()
      .single()

    if (error || !meeting) {
      console.error('Erro ao salvar reunião 1:1:', error)
      return null
    }

    const saved = meeting as any

    return {
      id: saved.id,
      organization_id: saved.organization_id,
      manager_id: saved.manager_id,
      employee_id: saved.employee_id,
      manager_name: data.manager_name || 'Gestor Responsável',
      employee_name: data.employee_name,
      employee_role: data.employee_role || 'Colaborador',
      scheduled_at: saved.scheduled_at,
      status: saved.status,
      manager_notes: saved.manager_notes,
      employee_notes: saved.employee_notes,
      action_items: Array.isArray(saved.action_items) ? saved.action_items : [],
      created_at: saved.created_at,
      updated_at: saved.updated_at,
    }
  } catch (err) {
    console.error('Falha ao criar reunião 1:1:', err)
    return null
  }
}

export async function updateOneOnOneStatus(id: string, status: string): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('one_on_ones') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao atualizar status da 1:1:', err)
    return false
  }
}

export async function updateOneOnOneActionItems(id: string, action_items: any[]): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('one_on_ones') as any)
      .update({ action_items, updated_at: new Date().toISOString() })
      .eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao atualizar compromissos da 1:1:', err)
    return false
  }
}

export async function deleteOneOnOne(id: string): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('one_on_ones') as any).delete().eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao excluir 1:1:', err)
    return false
  }
}
