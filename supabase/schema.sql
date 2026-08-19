-- ==============================================================================
-- LimaRH - Script Completo de Inicialização de Tabelas e Enums
-- PostgreSQL / Supabase
-- ==============================================================================

-- 1. Criação das Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criação dos Enums
DO $$ BEGIN
  CREATE TYPE contract_type AS ENUM ('CLT', 'PJ');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE employee_status AS ENUM ('ativo', 'inativo', 'ferias', 'afastado', 'desligado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'rh', 'gestor', 'colaborador');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('rascunho', 'aberta', 'pausada', 'encerrada');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE application_stage AS ENUM ('triagem', 'entrevista_rh', 'teste_tecnico', 'entrevista_gestor', 'proposta', 'aprovado', 'reprovado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE disciplinary_type AS ENUM ('advertencia_verbal', 'advertencia_escrita', 'suspensao');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE certificate_status AS ENUM ('pendente', 'aprovado', 'rejeitado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE feedback_type AS ENUM ('elogio', 'alinhamento', 'orientacao');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE pdi_goal_status AS ENUM ('nao_iniciado', 'em_andamento', 'concluido', 'cancelado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Tabelas de Base e Tenancy
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cnpj TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'colaborador',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. HRIS (Colaboradores CLT & PJ)
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  birth_date DATE,
  contract_type contract_type NOT NULL DEFAULT 'CLT',
  job_title TEXT NOT NULL,
  department TEXT NOT NULL,
  manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  admission_date DATE NOT NULL,
  resignation_date DATE,
  status employee_status NOT NULL DEFAULT 'ativo',
  salary_or_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clt_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID UNIQUE NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  cpf TEXT NOT NULL,
  rg TEXT,
  pis_pasep TEXT,
  ctps_number TEXT,
  ctps_series TEXT,
  transport_voucher BOOLEAN NOT NULL DEFAULT false,
  meal_voucher_value NUMERIC(10, 2),
  health_insurance BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pj_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID UNIQUE NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  trade_name TEXT,
  cnpj TEXT NOT NULL,
  invoice_due_day INTEGER NOT NULL DEFAULT 10,
  contract_valid_until DATE,
  contract_file_url TEXT,
  bank_name TEXT,
  bank_agency TEXT,
  bank_account TEXT,
  pix_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ATS (Recrutamento & Seleção)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  contract_type contract_type NOT NULL DEFAULT 'CLT',
  workplace_model TEXT NOT NULL DEFAULT 'remoto',
  location TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  min_salary NUMERIC(12, 2),
  max_salary NUMERIC(12, 2),
  status job_status NOT NULL DEFAULT 'aberta',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES job_candidates(id) ON DELETE CASCADE,
  stage application_stage NOT NULL DEFAULT 'triagem',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_notes TEXT,
  converted_to_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Ocorrências & Documentos
CREATE TABLE IF NOT EXISTS disciplinary_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type disciplinary_type NOT NULL,
  reason TEXT NOT NULL,
  incident_date DATE NOT NULL,
  days_suspended INTEGER,
  document_url TEXT,
  signed_at TIMESTAMPTZ,
  registered_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  cid TEXT,
  doctor_crm TEXT,
  file_url TEXT,
  status certificate_status NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'outro',
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Performance (1:1s, Feedbacks SBI, PDI)
CREATE TABLE IF NOT EXISTS one_on_ones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  manager_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendada',
  manager_notes TEXT,
  employee_notes TEXT,
  action_items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  from_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  to_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  feedback_type feedback_type NOT NULL DEFAULT 'elogio',
  situation TEXT NOT NULL,
  behavior TEXT NOT NULL,
  impact TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pdis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pdi_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pdi_id UUID NOT NULL REFERENCES pdis(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status pdi_goal_status NOT NULL DEFAULT 'nao_iniciado',
  deadline DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
