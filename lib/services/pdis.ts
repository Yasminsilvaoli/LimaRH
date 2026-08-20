import { createClient } from '@/lib/supabase/client'
import { PDIWithGoals } from '@/lib/performance-mock'
import { PDIGoal, PDIGoalStatus } from '@/types'
import { DEFAULT_ORG_ID } from './employees'

export async function fetchPDIs(): Promise<PDIWithGoals[]> {
  const supabase = createClient()

  try {
    const { data, error } = await (supabase.from('pdis') as any)
      .select(`
        *,
        employee:employees!pdis_employee_id_fkey (id, full_name, job_title),
        pdi_goals (*)
      `)
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.warn('Erro ao carregar PDIs do Supabase:', error)
      return []
    }

    return (data as any[]).map((pdi: any) => ({
      id: pdi.id,
      organization_id: pdi.organization_id,
      employee_id: pdi.employee_id,
      employee_name: pdi.employee?.full_name || 'Colaborador',
      employee_role: pdi.employee?.job_title || 'Colaborador',
      title: pdi.title,
      description: pdi.description,
      start_date: pdi.start_date,
      end_date: pdi.end_date,
      status: pdi.status,
      created_at: pdi.created_at,
      updated_at: pdi.updated_at,
      goals: Array.isArray(pdi.pdi_goals) ? pdi.pdi_goals : [],
    }))
  } catch (err) {
    console.error('Falha ao buscar PDIs:', err)
    return []
  }
}

export async function createPDI(data: {
  employee_name: string
  employee_role?: string
  title: string
  description?: string
  start_date: string
  end_date: string
  goals: { title: string; deadline: string }[]
}): Promise<PDIWithGoals | null> {
  const supabase = createClient()

  try {
    let empId: string | null = null

    const { data: existingEmp } = await (supabase.from('employees') as any)
      .select('id')
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
          job_title: data.employee_role || 'Engenharia de Software',
          department: 'Tecnologia',
          admission_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (newEmp) empId = (newEmp as any).id
    }

    if (!empId) return null

    // 1. Inserir PDI
    const { data: pdi, error: pdiError } = await (supabase.from('pdis') as any)
      .insert({
        organization_id: DEFAULT_ORG_ID,
        employee_id: empId,
        title: data.title,
        description: data.description || null,
        start_date: data.start_date,
        end_date: data.end_date,
        status: 'ativo',
      })
      .select()
      .single()

    if (pdiError || !pdi) {
      console.error('Erro ao criar PDI:', pdiError)
      return null
    }

    const savedPdi = pdi as any
    const insertedGoals: PDIGoal[] = []

    for (const goal of data.goals) {
      if (!goal.title.trim()) continue
      const { data: gData } = await (supabase.from('pdi_goals') as any)
        .insert({
          pdi_id: savedPdi.id,
          title: goal.title,
          status: 'em_andamento',
          deadline: goal.deadline || data.end_date,
        })
        .select()
        .single()

      if (gData) insertedGoals.push(gData as PDIGoal)
    }

    return {
      id: savedPdi.id,
      organization_id: savedPdi.organization_id,
      employee_id: savedPdi.employee_id,
      employee_name: data.employee_name,
      employee_role: data.employee_role || 'Engenharia de Software',
      title: savedPdi.title,
      description: savedPdi.description,
      start_date: savedPdi.start_date,
      end_date: savedPdi.end_date,
      status: savedPdi.status,
      created_at: savedPdi.created_at,
      updated_at: savedPdi.updated_at,
      goals: insertedGoals,
    }
  } catch (err) {
    console.error('Falha ao registrar PDI:', err)
    return null
  }
}

export async function updatePDIGoalStatus(
  goalId: string,
  status: PDIGoalStatus,
  completed_at: string | null
): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('pdi_goals') as any)
      .update({
        status,
        completed_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', goalId)

    return !error
  } catch (err) {
    console.error('Falha ao atualizar meta do PDI:', err)
    return false
  }
}

export async function deletePDI(id: string): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('pdis') as any).delete().eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao excluir PDI:', err)
    return false
  }
}
