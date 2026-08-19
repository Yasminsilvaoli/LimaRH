import { Database } from './database'

export * from './database'

export type Organization = Database['public']['Tables']['organizations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Employee = Database['public']['Tables']['employees']['Row']
export type CLTDetails = Database['public']['Tables']['clt_details']['Row']
export type PJDetails = Database['public']['Tables']['pj_details']['Row']
export type Job = Database['public']['Tables']['jobs']['Row']
export type JobCandidate = Database['public']['Tables']['job_candidates']['Row']
export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type DisciplinaryRecord = Database['public']['Tables']['disciplinary_records']['Row']
export type MedicalCertificate = Database['public']['Tables']['medical_certificates']['Row']
export type EmployeeDocument = Database['public']['Tables']['employee_documents']['Row']
export type OneOnOne = Database['public']['Tables']['one_on_ones']['Row']
export type Feedback = Database['public']['Tables']['feedbacks']['Row']
export type PDI = Database['public']['Tables']['pdis']['Row']
export type PDIGoal = Database['public']['Tables']['pdi_goals']['Row']

// Tipos combinados para UI
export type EmployeeWithDetails = Employee & {
  clt_details?: CLTDetails | null
  pj_details?: PJDetails | null
  manager?: {
    id: string
    full_name: string
  } | null
}

export type ApplicationWithCandidate = JobApplication & {
  candidate: JobCandidate
}
