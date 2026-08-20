import { createClient } from '@/lib/supabase/client'
import { FeedbackWithUsers } from '@/lib/performance-mock'
import { FeedbackType } from '@/types'
import { DEFAULT_ORG_ID } from './employees'

export async function fetchFeedbacks(): Promise<FeedbackWithUsers[]> {
  const supabase = createClient()

  try {
    const { data, error } = await (supabase.from('feedbacks') as any)
      .select(`
        *,
        from_emp:employees!feedbacks_from_id_fkey (id, full_name, job_title),
        to_emp:employees!feedbacks_to_id_fkey (id, full_name, job_title)
      `)
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.warn('Erro ao carregar feedbacks do Supabase:', error)
      return []
    }

    return (data as any[]).map((item: any) => ({
      id: item.id,
      organization_id: item.organization_id,
      from_id: item.from_id,
      to_id: item.to_id,
      from_name: item.from_emp?.full_name || 'Liderança',
      from_role: item.from_emp?.job_title || 'Gestão',
      to_name: item.to_emp?.full_name || 'Colaborador',
      to_role: item.to_emp?.job_title || 'Colaborador',
      feedback_type: item.feedback_type,
      situation: item.situation,
      behavior: item.behavior,
      impact: item.impact,
      is_anonymous: item.is_anonymous || false,
      created_at: item.created_at,
    }))
  } catch (err) {
    console.error('Falha ao buscar feedbacks:', err)
    return []
  }
}

export async function createFeedback(data: {
  from_name?: string
  to_name: string
  feedback_type: FeedbackType
  situation: string
  behavior: string
  impact: string
}): Promise<FeedbackWithUsers | null> {
  const supabase = createClient()

  try {
    let toEmpId: string | null = null

    const { data: existingTo } = await (supabase.from('employees') as any)
      .select('id')
      .eq('full_name', data.to_name)
      .maybeSingle()

    if (existingTo) {
      toEmpId = (existingTo as any).id
    } else {
      const { data: newEmp } = await (supabase.from('employees') as any)
        .insert({
          organization_id: DEFAULT_ORG_ID,
          full_name: data.to_name,
          email: `${data.to_name.toLowerCase().replace(/\s+/g, '.')}@limarh.com`,
          job_title: 'Colaborador',
          department: 'Geral',
          admission_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (newEmp) toEmpId = (newEmp as any).id
    }

    if (!toEmpId) return null

    const { data: fb, error } = await (supabase.from('feedbacks') as any)
      .insert({
        organization_id: DEFAULT_ORG_ID,
        from_id: toEmpId,
        to_id: toEmpId,
        feedback_type: data.feedback_type,
        situation: data.situation,
        behavior: data.behavior,
        impact: data.impact,
        is_anonymous: false,
      })
      .select()
      .single()

    if (error || !fb) {
      console.error('Erro ao salvar feedback:', error)
      return null
    }

    const savedFb = fb as any

    return {
      id: savedFb.id,
      organization_id: savedFb.organization_id,
      from_id: savedFb.from_id,
      to_id: savedFb.to_id,
      from_name: data.from_name || 'Liderança / RH',
      from_role: 'Gente & Gestão',
      to_name: data.to_name,
      to_role: 'Colaborador',
      feedback_type: savedFb.feedback_type,
      situation: savedFb.situation,
      behavior: savedFb.behavior,
      impact: savedFb.impact,
      is_anonymous: savedFb.is_anonymous,
      created_at: savedFb.created_at,
    }
  } catch (err) {
    console.error('Falha ao criar feedback:', err)
    return null
  }
}

export async function deleteFeedback(id: string): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('feedbacks') as any).delete().eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao excluir feedback:', err)
    return false
  }
}
