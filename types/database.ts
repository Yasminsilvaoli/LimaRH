export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ContractType = 'CLT' | 'PJ'
export type EmployeeStatus = 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'desligado'
export type JobStatus = 'rascunho' | 'aberta' | 'pausada' | 'encerrada'
export type ApplicationStageType = 'triagem' | 'entrevista_rh' | 'teste_tecnico' | 'entrevista_gestor' | 'proposta' | 'aprovado' | 'reprovado'
export type DisciplinaryType = 'advertencia_verbal' | 'advertencia_escrita' | 'suspensao'
export type DocumentCategory = 'contrato' | 'atestado' | 'holerite' | 'nota_fiscal' | 'termo_aditivo' | 'outro'
export type FeedbackType = 'elogio' | 'alinhamento' | 'orientacao'
export type PdiGoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'cancelado'
export type PDIGoalStatus = PdiGoalStatus
export type CertificateStatus = 'pendente' | 'aprovado' | 'rejeitado'

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          cnpj: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          cnpj?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          cnpj?: string | null
          logo_url?: string | null
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          full_name: string
          email: string
          avatar_url: string | null
          role: 'admin' | 'gestor' | 'rh' | 'colaborador'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          full_name: string
          email: string
          avatar_url?: string | null
          role?: 'admin' | 'gestor' | 'rh' | 'colaborador'
          created_at?: string
          updated_at?: string
        }
        Update: {
          organization_id?: string | null
          full_name?: string
          email?: string
          avatar_url?: string | null
          role?: 'admin' | 'gestor' | 'rh' | 'colaborador'
          updated_at?: string
        }
      }
      // ==========================================
      // HRIS (Colaboradores CLT & PJ)
      // ==========================================
      employees: {
        Row: {
          id: string
          organization_id: string
          profile_id: string | null
          full_name: string
          email: string
          phone: string | null
          birth_date: string | null
          contract_type: ContractType
          job_title: string
          department: string
          manager_id: string | null
          admission_date: string
          resignation_date: string | null
          status: EmployeeStatus
          salary_or_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
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
          salary_or_rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          organization_id?: string
          profile_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          birth_date?: string | null
          contract_type?: ContractType
          job_title?: string
          department?: string
          manager_id?: string | null
          admission_date?: string
          resignation_date?: string | null
          status?: EmployeeStatus
          salary_or_rate?: number
          updated_at?: string
        }
      }
      clt_details: {
        Row: {
          id: string
          employee_id: string
          cpf: string
          rg: string | null
          pis_pasep: string | null
          ctps_number: string | null
          ctps_series: string | null
          transport_voucher: boolean
          meal_voucher_value: number | null
          health_insurance: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          cpf: string
          rg?: string | null
          pis_pasep?: string | null
          ctps_number?: string | null
          ctps_series?: string | null
          transport_voucher?: boolean
          meal_voucher_value?: number | null
          health_insurance?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          cpf?: string
          rg?: string | null
          pis_pasep?: string | null
          ctps_number?: string | null
          ctps_series?: string | null
          transport_voucher?: boolean
          meal_voucher_value?: number | null
          health_insurance?: boolean
          updated_at?: string
        }
      }
      pj_details: {
        Row: {
          id: string
          employee_id: string
          company_name: string
          trade_name: string | null
          cnpj: string
          invoice_due_day: number
          contract_valid_until: string | null
          contract_file_url: string | null
          bank_name: string | null
          bank_agency: string | null
          bank_account: string | null
          pix_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
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
          created_at?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          trade_name?: string | null
          cnpj?: string
          invoice_due_day?: number
          contract_valid_until?: string | null
          contract_file_url?: string | null
          bank_name?: string | null
          bank_agency?: string | null
          bank_account?: string | null
          pix_key?: string | null
          updated_at?: string
        }
      }

      // ==========================================
      // ATS (Recrutamento e Seleção)
      // ==========================================
      jobs: {
        Row: {
          id: string
          organization_id: string
          title: string
          department: string
          contract_type: ContractType
          workplace_model: 'presencial' | 'hibrido' | 'remoto'
          location: string | null
          description: string
          requirements: string | null
          benefits: string | null
          min_salary: number | null
          max_salary: number | null
          status: JobStatus
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          title: string
          department: string
          contract_type: ContractType
          workplace_model: 'presencial' | 'hibrido' | 'remoto'
          location?: string | null
          description: string
          requirements?: string | null
          benefits?: string | null
          min_salary?: number | null
          max_salary?: number | null
          status?: JobStatus
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          organization_id?: string
          title?: string
          department?: string
          contract_type?: ContractType
          workplace_model?: 'presencial' | 'hibrido' | 'remoto'
          location?: string | null
          description?: string
          requirements?: string | null
          benefits?: string | null
          min_salary?: number | null
          max_salary?: number | null
          status?: JobStatus
          updated_at?: string
        }
      }
      job_candidates: {
        Row: {
          id: string
          organization_id: string
          full_name: string
          email: string
          phone: string | null
          linkedin_url: string | null
          resume_url: string | null
          portfolio_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          full_name: string
          email: string
          phone?: string | null
          linkedin_url?: string | null
          resume_url?: string | null
          portfolio_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string
          email?: string
          phone?: string | null
          linkedin_url?: string | null
          resume_url?: string | null
          portfolio_url?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          candidate_id: string
          stage: ApplicationStageType
          rating: number | null
          feedback_notes: string | null
          converted_to_employee_id: string | null
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          candidate_id: string
          stage?: ApplicationStageType
          rating?: number | null
          feedback_notes?: string | null
          converted_to_employee_id?: string | null
          applied_at?: string
          updated_at?: string
        }
        Update: {
          stage?: ApplicationStageType
          rating?: number | null
          feedback_notes?: string | null
          converted_to_employee_id?: string | null
          updated_at?: string
        }
      }

      // ==========================================
      // Documentos & Ocorrências
      // ==========================================
      disciplinary_records: {
        Row: {
          id: string
          employee_id: string
          type: DisciplinaryType
          reason: string
          incident_date: string
          days_suspended: number | null
          document_url: string | null
          signed_at: string | null
          registered_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          type: DisciplinaryType
          reason: string
          incident_date: string
          days_suspended?: number | null
          document_url?: string | null
          signed_at?: string | null
          registered_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: DisciplinaryType
          reason?: string
          incident_date?: string
          days_suspended?: number | null
          document_url?: string | null
          signed_at?: string | null
          updated_at?: string
        }
      }
      medical_certificates: {
        Row: {
          id: string
          employee_id: string
          start_date: string
          end_date: string
          days_count: number
          cid: string | null
          doctor_crm: string | null
          file_url: string | null
          status: 'pendente' | 'aprovado' | 'rejeitado'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          start_date: string
          end_date: string
          days_count: number
          cid?: string | null
          doctor_crm?: string | null
          file_url?: string | null
          status?: 'pendente' | 'aprovado' | 'rejeitado'
          created_at?: string
          updated_at?: string
        }
        Update: {
          start_date?: string
          end_date?: string
          days_count?: number
          cid?: string | null
          doctor_crm?: string | null
          file_url?: string | null
          status?: 'pendente' | 'aprovado' | 'rejeitado'
          updated_at?: string
        }
      }
      employee_documents: {
        Row: {
          id: string
          employee_id: string
          title: string
          category: DocumentCategory
          file_url: string
          file_size_bytes: number | null
          mime_type: string | null
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          title: string
          category: DocumentCategory
          file_url: string
          file_size_bytes?: number | null
          mime_type?: string | null
          uploaded_by: string
          created_at?: string
        }
        Update: {
          title?: string
          category?: DocumentCategory
          file_url?: string
        }
      }

      // ==========================================
      // Performance (1:1s, Feedback SBI, PDI)
      // ==========================================
      one_on_ones: {
        Row: {
          id: string
          organization_id: string
          manager_id: string
          employee_id: string
          scheduled_at: string
          status: 'agendada' | 'realizada' | 'cancelada'
          manager_notes: string | null
          employee_notes: string | null
          action_items: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          manager_id: string
          employee_id: string
          scheduled_at: string
          status?: 'agendada' | 'realizada' | 'cancelada'
          manager_notes?: string | null
          employee_notes?: string | null
          action_items?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          scheduled_at?: string
          status?: 'agendada' | 'realizada' | 'cancelada'
          manager_notes?: string | null
          employee_notes?: string | null
          action_items?: Json | null
          updated_at?: string
        }
      }
      feedbacks: {
        Row: {
          id: string
          organization_id: string
          from_id: string
          to_id: string
          feedback_type: FeedbackType
          // Modelo SBI
          situation: string
          behavior: string
          impact: string
          is_anonymous: boolean
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          from_id: string
          to_id: string
          feedback_type: FeedbackType
          situation: string
          behavior: string
          impact: string
          is_anonymous?: boolean
          created_at?: string
        }
        Update: {
          situation?: string
          behavior?: string
          impact?: string
        }
      }
      pdis: {
        Row: {
          id: string
          organization_id: string
          employee_id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          status: 'ativo' | 'concluido' | 'cancelado'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          employee_id: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          status?: 'ativo' | 'concluido' | 'cancelado'
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          status?: 'ativo' | 'concluido' | 'cancelado'
          updated_at?: string
        }
      }
      pdi_goals: {
        Row: {
          id: string
          pdi_id: string
          title: string
          description: string | null
          status: PdiGoalStatus
          deadline: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pdi_id: string
          title: string
          description?: string | null
          status?: PdiGoalStatus
          deadline: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          status?: PdiGoalStatus
          deadline?: string
          completed_at?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      contract_type: ContractType
      employee_status: EmployeeStatus
      job_status: JobStatus
      application_stage: ApplicationStageType
      disciplinary_type: DisciplinaryType
      document_category: DocumentCategory
      feedback_type: FeedbackType
      pdi_goal_status: PdiGoalStatus
    }
  }
}
