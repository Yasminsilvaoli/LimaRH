import { createClient } from '@/lib/supabase/client'
import { JobWithMetrics, KanbanCandidateItem } from '@/lib/mock-data'
import { Job, ApplicationStageType } from '@/types'
import { DEFAULT_ORG_ID } from './employees'

export async function fetchJobs(): Promise<JobWithMetrics[]> {
  const supabase = createClient()

  try {
    const { data: jobs, error } = await (supabase.from('jobs') as any)
      .select(`
        *,
        job_applications (id, stage)
      `)
      .order('created_at', { ascending: false })

    if (error || !jobs) {
      console.warn('Erro ao carregar vagas do Supabase:', error)
      return []
    }

    return (jobs as any[]).map((j: any) => {
      const apps = Array.isArray(j.job_applications) ? j.job_applications : []
      const total_candidates = apps.length
      const in_progress = apps.filter((a: any) => a.stage !== 'aprovado' && a.stage !== 'reprovado').length
      const hired = apps.filter((a: any) => a.stage === 'aprovado').length

      return {
        ...j,
        total_candidates,
        in_progress,
        hired,
      }
    })
  } catch (err) {
    console.error('Falha ao buscar vagas:', err)
    return []
  }
}

export async function createJob(data: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<JobWithMetrics | null> {
  const supabase = createClient()

  try {
    const { data: job, error } = await (supabase.from('jobs') as any)
      .insert({
        organization_id: DEFAULT_ORG_ID,
        title: data.title,
        department: data.department,
        contract_type: data.contract_type,
        workplace_model: data.workplace_model,
        location: data.location || 'São Paulo, SP',
        description: data.description,
        requirements: data.requirements || 'A definir',
        benefits: data.benefits || 'A definir',
        min_salary: data.min_salary || null,
        max_salary: data.max_salary || null,
        status: data.status || 'aberta',
      })
      .select()
      .single()

    if (error || !job) {
      console.error('Erro ao cadastrar vaga:', error)
      return null
    }

    const savedJob = job as any

    return {
      ...savedJob,
      total_candidates: 0,
      in_progress: 0,
      hired: 0,
    }
  } catch (err) {
    console.error('Falha ao criar vaga:', err)
    return null
  }
}

export async function deleteJob(id: string): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('jobs') as any).delete().eq('id', id)
    return !error
  } catch (err) {
    console.error('Falha ao excluir vaga:', err)
    return false
  }
}

export async function fetchCandidatesForJob(jobId: string): Promise<KanbanCandidateItem[]> {
  const supabase = createClient()

  try {
    const { data, error } = await (supabase.from('job_applications') as any)
      .select(`
        id,
        job_id,
        stage,
        rating,
        feedback_notes,
        applied_at,
        candidate:job_candidates!job_applications_candidate_id_fkey (*)
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return (data as any[]).map((app: any) => ({
      application_id: app.id,
      job_id: app.job_id,
      candidate_id: app.candidate?.id || app.id,
      full_name: app.candidate?.full_name || 'Candidato',
      email: app.candidate?.email || 'email@exemplo.com',
      phone: app.candidate?.phone || null,
      linkedin_url: app.candidate?.linkedin_url || null,
      resume_url: app.candidate?.resume_url || '#',
      stage: app.stage,
      rating: app.rating,
      feedback_notes: app.feedback_notes,
      applied_at: app.applied_at,
    }))
  } catch (err) {
    console.error('Falha ao buscar candidatos da vaga:', err)
    return []
  }
}

export async function updateApplicationStage(applicationId: string, stage: ApplicationStageType): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await (supabase.from('job_applications') as any)
      .update({ stage, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
    return !error
  } catch (err) {
    console.error('Falha ao atualizar etapa do candidato:', err)
    return false
  }
}
