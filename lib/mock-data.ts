import { Job, JobCandidate, JobApplication, ApplicationStageType } from '@/types'

export interface JobWithMetrics extends Job {
  total_candidates: number
  in_progress: number
  hired: number
}

export const INITIAL_MOCK_JOBS: JobWithMetrics[] = [
  {
    id: 'job-1',
    organization_id: 'org-1',
    title: 'Desenvolvedor(a) Full Stack Pleno',
    department: 'Engenharia',
    contract_type: 'CLT',
    workplace_model: 'remoto',
    location: 'São Paulo, SP (Remoto)',
    description: 'Buscamos uma pessoa desenvolvedora com experiência em React, Node.js e bancos de dados relacionais para integrar nosso time de produto.',
    requirements: 'React / Next.js, Node.js, TypeScript, SQL e Git.',
    benefits: 'Vale Refeição (R$ 40/dia), Plano de Saúde, Gympass e Auxílio Home Office.',
    min_salary: 7500,
    max_salary: 9500,
    status: 'aberta',
    created_by: 'user-admin',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    total_candidates: 14,
    in_progress: 10,
    hired: 1,
  },
  {
    id: 'job-2',
    organization_id: 'org-1',
    title: 'Product Designer Senior',
    department: 'Design',
    contract_type: 'PJ',
    workplace_model: 'hibrido',
    location: 'Curitiba, PR',
    description: 'Responsável pelo design system, pesquisas de usuário e prototipação de alta fidelidade das novas features.',
    requirements: 'Figma avançado, Design System, UX Research e facilitação de dinâmicas.',
    benefits: 'Recesso remunerado de 30 dias/ano, Horário Flexível e Bônus por metas.',
    min_salary: 12000,
    max_salary: 15000,
    status: 'aberta',
    created_by: 'user-admin',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    total_candidates: 8,
    in_progress: 6,
    hired: 0,
  },
  {
    id: 'job-3',
    organization_id: 'org-1',
    title: 'Analista de Recursos Humanos Jr (BP)',
    department: 'Gente & Gestão',
    contract_type: 'CLT',
    workplace_model: 'presencial',
    location: 'Belo Horizonte, MG',
    description: 'Apoio em processos admissionais, triagem de talentos, integração de novos colaboradores e suporte a lideranças.',
    requirements: 'Superior cursando ou completo em Psicologia/RH, boa comunicação e organização.',
    benefits: 'VT, VR, Plano Odontológico e Seguro de Vida.',
    min_salary: 3500,
    max_salary: 4200,
    status: 'aberta',
    created_by: 'user-admin',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    total_candidates: 22,
    in_progress: 15,
    hired: 0,
  },
]

export interface KanbanCandidateItem {
  application_id: string
  job_id: string
  candidate_id: string
  full_name: string
  email: string
  phone: string | null
  linkedin_url: string | null
  resume_url: string | null
  stage: ApplicationStageType
  rating: number | null
  feedback_notes: string | null
  applied_at: string
}

export const INITIAL_MOCK_CANDIDATES: KanbanCandidateItem[] = [
  {
    application_id: 'app-1',
    job_id: 'job-1',
    candidate_id: 'cand-1',
    full_name: 'Lucas Silveira Mendes',
    email: 'lucas.mendes@exemplo.com',
    phone: '(11) 98765-4321',
    linkedin_url: 'https://linkedin.com/in/lucas-mendes',
    resume_url: '#',
    stage: 'triagem',
    rating: 4,
    feedback_notes: 'Ótimo perfil no GitHub com projetos recentes em Next.js e Tailwind.',
    applied_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    application_id: 'app-2',
    job_id: 'job-1',
    candidate_id: 'cand-2',
    full_name: 'Mariana Duarte Costa',
    email: 'mariana.costa@exemplo.com',
    phone: '(21) 99123-8877',
    linkedin_url: 'https://linkedin.com/in/mariana-costa',
    resume_url: '#',
    stage: 'entrevista_rh',
    rating: 5,
    feedback_notes: 'Excelente alinhamento cultural. Muito comunicativa e com foco em entregas rápidas.',
    applied_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    application_id: 'app-3',
    job_id: 'job-1',
    candidate_id: 'cand-3',
    full_name: 'Rodrigo Barbosa Alencar',
    email: 'rodrigo.alencar@exemplo.com',
    phone: '(31) 98455-1234',
    linkedin_url: 'https://linkedin.com/in/rodrigo-alencar',
    resume_url: '#',
    stage: 'teste_tecnico',
    rating: 4,
    feedback_notes: 'Submeteu o teste de API REST com testes automatizados completos.',
    applied_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    application_id: 'app-4',
    job_id: 'job-1',
    candidate_id: 'cand-4',
    full_name: 'Camila Ferreira Lima',
    email: 'camila.lima@exemplo.com',
    phone: '(41) 99888-7766',
    linkedin_url: 'https://linkedin.com/in/camila-lima',
    resume_url: '#',
    stage: 'entrevista_gestor',
    rating: 5,
    feedback_notes: 'Aprovada tecnicamente pela liderança técnica. Muito consistente em arquitetura.',
    applied_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    application_id: 'app-5',
    job_id: 'job-1',
    candidate_id: 'cand-5',
    full_name: 'Gabriel Albuquerque Rios',
    email: 'gabriel.rios@exemplo.com',
    phone: '(19) 98111-2233',
    linkedin_url: 'https://linkedin.com/in/gabriel-rios',
    resume_url: '#',
    stage: 'aprovado',
    rating: 5,
    feedback_notes: 'Candidato de destaque. Proposta aceita, pronto para admissão.',
    applied_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
]

export const STAGES_CONFIG: {
  id: ApplicationStageType
  label: string
  color: string
}[] = [
  { id: 'triagem', label: 'Triagem', color: 'border-t-slate-400 bg-slate-50/50' },
  { id: 'entrevista_rh', label: 'Entrevista RH', color: 'border-t-blue-500 bg-blue-50/20' },
  { id: 'teste_tecnico', label: 'Teste Técnico', color: 'border-t-amber-500 bg-amber-50/20' },
  { id: 'entrevista_gestor', label: 'Entrevista Gestor', color: 'border-t-purple-500 bg-purple-50/20' },
  { id: 'proposta', label: 'Proposta', color: 'border-t-indigo-500 bg-indigo-50/20' },
  { id: 'aprovado', label: 'Aprovado', color: 'border-t-emerald-500 bg-emerald-50/30' },
  { id: 'reprovado', label: 'Reprovado', color: 'border-t-rose-500 bg-rose-50/20' },
]
