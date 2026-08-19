import { OneOnOne, Feedback, PDI, PDIGoal } from '@/types'

export interface OneOnOneWithUsers extends OneOnOne {
  manager_name: string
  employee_name: string
  employee_role: string
  employee_avatar?: string
}

export interface FeedbackWithUsers extends Feedback {
  from_name: string
  from_role: string
  to_name: string
  to_role: string
}

export interface PDIWithGoals extends PDI {
  employee_name: string
  employee_role: string
  goals: PDIGoal[]
}

export const INITIAL_MOCK_1ON1S: OneOnOneWithUsers[] = [
  {
    id: '1on1-1',
    organization_id: 'org-1',
    manager_id: 'mgr-1',
    employee_id: 'emp-1',
    manager_name: 'Ana Paula Rocha (Head de Gente)',
    employee_name: 'Lucas Silveira Mendes',
    employee_role: 'Desenvolvedor Full Stack',
    scheduled_at: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: 'agendada',
    manager_notes: 'Alinhar entregas da primeira sprint e adaptação ao time de engenharia.',
    employee_notes: 'Gostaria de tirar dúvidas sobre o fluxo de deploy e métricas de code review.',
    action_items: [
      { id: '1', text: 'Liberar acessos ao ambiente de homologação', done: true },
      { id: '2', text: 'Marcar onboarding técnico com tech lead', done: false },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '1on1-2',
    organization_id: 'org-1',
    manager_id: 'mgr-1',
    employee_id: 'emp-2',
    manager_name: 'Carlos Eduardo Ramos (CTO)',
    employee_name: 'Mariana Duarte Costa',
    employee_role: 'Product Designer',
    scheduled_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'realizada',
    manager_notes: 'Revisão das entregas do novo design system. Excelente evolução de consistência visual.',
    employee_notes: 'Apresentei as melhorias de acessibilidade para o módulo de admissão.',
    action_items: [
      { id: '1', text: 'Finalizar documentação de tokens no Figma', done: true },
      { id: '2', text: 'Apresentar resultados do teste de usabilidade para o time', done: true },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const INITIAL_MOCK_FEEDBACKS: FeedbackWithUsers[] = [
  {
    id: 'fb-1',
    organization_id: 'org-1',
    from_id: 'mgr-1',
    to_id: 'emp-1',
    from_name: 'Carlos Eduardo Ramos',
    from_role: 'CTO',
    to_name: 'Lucas Silveira Mendes',
    to_role: 'Desenvolvedor Full Stack',
    feedback_type: 'elogio',
    situation: 'Durante a entrega crítica do release v1.4 na última quinta-feira à tarde',
    behavior: 'Você identificou um gargalo na query do banco de dados e propôs uma otimização com indexação antes de subir para produção',
    impact: 'Isso evitou lentidão para mais de 10.000 usuários simultâneos e garantiu estabilidade máxima no lançamento.',
    is_anonymous: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'fb-2',
    organization_id: 'org-1',
    from_id: 'mgr-2',
    to_id: 'emp-2',
    from_name: 'Ana Paula Rocha',
    from_role: 'Head de Gente',
    to_name: 'Mariana Duarte Costa',
    to_role: 'Product Designer',
    feedback_type: 'orientacao',
    situation: 'Na reunião de refinamento com os stakeholders do time financeiro semana passada',
    behavior: 'Os protótipos foram apresentados sem validação prévia de viabilidade técnica com o time de engenharia',
    impact: 'Gerou retrabalho de 3 dias para ajustar componentes complexos que não estavam previstos no sprint.',
    is_anonymous: false,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]

export const INITIAL_MOCK_PDIS: PDIWithGoals[] = [
  {
    id: 'pdi-1',
    organization_id: 'org-1',
    employee_id: 'emp-1',
    employee_name: 'Lucas Silveira Mendes',
    employee_role: 'Desenvolvedor Full Stack Pleno',
    title: 'Evolução Técnica para Engenheiro Sênior',
    description: 'Desenvolver competências em arquitetura em nuvem, liderança técnica de projetos e observabilidade.',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'ativo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    goals: [
      {
        id: 'g-1',
        pdi_id: 'pdi-1',
        title: 'Obter certificação Cloud Solutions Architect',
        description: 'Estudos e realização do exame oficial.',
        status: 'em_andamento',
        deadline: '2026-06-30',
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'g-2',
        pdi_id: 'pdi-1',
        title: 'Conduzir mentoria técnica com 1 dev júnior do time',
        description: 'Sessões quinzenais de code review e boas práticas.',
        status: 'concluido',
        deadline: '2026-04-30',
        completed_at: '2026-04-20',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'g-3',
        pdi_id: 'pdi-1',
        title: 'Implementar tracing distribuído e métricas OpenTelemetry',
        description: 'Melhorar a observabilidade dos microserviços críticos.',
        status: 'nao_iniciado',
        deadline: '2026-09-30',
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
]
