-- ==============================================================================
-- LimaRH - Row Level Security (RLS) & Funções de Segurança
-- PostgreSQL / Supabase
-- ==============================================================================

-- 1. Habilitar RLS em TODAS as Tabelas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE clt_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE pj_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_on_ones ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdis ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdi_goals ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. Funções Utilitárias de Autorização (Security Definer com search_path seguro)
-- ==============================================================================

-- Retorna a role do usuário conectado
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'colaborador'::public.user_role
  );
$$;

-- Verifica se é Admin ou RH
CREATE OR REPLACE FUNCTION public.is_admin_or_rh()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (public.get_current_user_role() IN ('admin', 'rh'));
$$;

-- Verifica se é Gestor
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (public.get_current_user_role() = 'gestor');
$$;

-- Retorna o ID do employee vinculado ao auth.uid()
CREATE OR REPLACE FUNCTION public.get_current_employee_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.employees WHERE profile_id = auth.uid() LIMIT 1;
$$;

-- Verifica se o usuário atual é gestor direto de um determinado colaborador
CREATE OR REPLACE FUNCTION public.is_manager_of(emp_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees
    WHERE id = emp_id AND manager_id = public.get_current_employee_id()
  );
$$;

-- ==============================================================================
-- 3. Políticas de RLS: PROFILES & ORGANIZATIONS
-- ==============================================================================

DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
CREATE POLICY "profiles_select_policy" ON profiles
FOR SELECT USING (
  public.is_admin_or_rh()
  OR id = auth.uid()
  OR organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
CREATE POLICY "profiles_update_policy" ON profiles
FOR UPDATE USING (
  public.is_admin_or_rh() OR id = auth.uid()
);

-- ==============================================================================
-- 4. Políticas de RLS: HRIS (EMPLOYEES, CLT_DETAILS, PJ_DETAILS)
-- ==============================================================================

-- EMPLOYEES
DROP POLICY IF EXISTS "employees_admin_full_access" ON employees;
CREATE POLICY "employees_admin_full_access" ON employees
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "employees_manager_select" ON employees;
CREATE POLICY "employees_manager_select" ON employees
FOR SELECT USING (
  public.is_manager() AND (
    manager_id = public.get_current_employee_id()
    OR id = public.get_current_employee_id()
  )
);

DROP POLICY IF EXISTS "employees_employee_select_self" ON employees;
CREATE POLICY "employees_employee_select_self" ON employees
FOR SELECT USING (
  profile_id = auth.uid()
);

-- CLT DETAILS
DROP POLICY IF EXISTS "clt_details_admin_full" ON clt_details;
CREATE POLICY "clt_details_admin_full" ON clt_details
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "clt_details_self_select" ON clt_details;
CREATE POLICY "clt_details_self_select" ON clt_details
FOR SELECT USING (
  employee_id = public.get_current_employee_id()
);

-- PJ DETAILS
DROP POLICY IF EXISTS "pj_details_admin_full" ON pj_details;
CREATE POLICY "pj_details_admin_full" ON pj_details
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "pj_details_self_select" ON pj_details;
CREATE POLICY "pj_details_self_select" ON pj_details
FOR SELECT USING (
  employee_id = public.get_current_employee_id()
);

-- ==============================================================================
-- 5. Políticas de RLS: OCORRÊNCIAS & DOCUMENTOS
-- ==============================================================================

-- DISCIPLINARY RECORDS
DROP POLICY IF EXISTS "disciplinary_admin_full" ON disciplinary_records;
CREATE POLICY "disciplinary_admin_full" ON disciplinary_records
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "disciplinary_manager_select" ON disciplinary_records;
CREATE POLICY "disciplinary_manager_select" ON disciplinary_records
FOR SELECT USING (
  public.is_manager() AND public.is_manager_of(employee_id)
);

DROP POLICY IF EXISTS "disciplinary_self_select" ON disciplinary_records;
CREATE POLICY "disciplinary_self_select" ON disciplinary_records
FOR SELECT USING (
  employee_id = public.get_current_employee_id()
);

-- MEDICAL CERTIFICATES
DROP POLICY IF EXISTS "medical_certs_admin_full" ON medical_certificates;
CREATE POLICY "medical_certs_admin_full" ON medical_certificates
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "medical_certs_manager_select" ON medical_certificates;
CREATE POLICY "medical_certs_manager_select" ON medical_certificates
FOR SELECT USING (
  public.is_manager() AND public.is_manager_of(employee_id)
);

DROP POLICY IF EXISTS "medical_certs_self_access" ON medical_certificates;
CREATE POLICY "medical_certs_self_access" ON medical_certificates
FOR ALL USING (
  employee_id = public.get_current_employee_id()
);

-- ==============================================================================
-- 6. Políticas de RLS: PERFORMANCE (1:1, FEEDBACK SBI, PDI)
-- ==============================================================================

-- ONE ON ONES
DROP POLICY IF EXISTS "one_on_ones_admin_full" ON one_on_ones;
CREATE POLICY "one_on_ones_admin_full" ON one_on_ones
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "one_on_ones_participants_access" ON one_on_ones;
CREATE POLICY "one_on_ones_participants_access" ON one_on_ones
FOR ALL USING (
  manager_id = public.get_current_employee_id()
  OR employee_id = public.get_current_employee_id()
);

-- FEEDBACKS
DROP POLICY IF EXISTS "feedbacks_admin_full" ON feedbacks;
CREATE POLICY "feedbacks_admin_full" ON feedbacks
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "feedbacks_participants_select" ON feedbacks;
CREATE POLICY "feedbacks_participants_select" ON feedbacks
FOR SELECT USING (
  from_id = public.get_current_employee_id()
  OR to_id = public.get_current_employee_id()
  OR (public.is_manager() AND public.is_manager_of(to_id))
);

DROP POLICY IF EXISTS "feedbacks_insert_policy" ON feedbacks;
CREATE POLICY "feedbacks_insert_policy" ON feedbacks
FOR INSERT WITH CHECK (
  from_id = public.get_current_employee_id()
);

-- PDIS & PDI GOALS
DROP POLICY IF EXISTS "pdis_admin_full" ON pdis;
CREATE POLICY "pdis_admin_full" ON pdis
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "pdis_manager_access" ON pdis;
CREATE POLICY "pdis_manager_access" ON pdis
FOR ALL USING (
  public.is_manager() AND public.is_manager_of(employee_id)
);

DROP POLICY IF EXISTS "pdis_self_select" ON pdis;
CREATE POLICY "pdis_self_select" ON pdis
FOR SELECT USING (
  employee_id = public.get_current_employee_id()
);

DROP POLICY IF EXISTS "pdi_goals_admin_full" ON pdi_goals;
CREATE POLICY "pdi_goals_admin_full" ON pdi_goals
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "pdi_goals_user_access" ON pdi_goals;
CREATE POLICY "pdi_goals_user_access" ON pdi_goals
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.pdis p
    WHERE p.id = pdi_goals.pdi_id
    AND (
      p.employee_id = public.get_current_employee_id()
      OR public.is_manager_of(p.employee_id)
    )
  )
);

-- ==============================================================================
-- 7. Políticas de RLS: ATS (JOBS, CANDIDATES, APPLICATIONS)
-- ==============================================================================

-- JOBS
DROP POLICY IF EXISTS "jobs_admin_full" ON jobs;
CREATE POLICY "jobs_admin_full" ON jobs
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "jobs_select_public_or_internal" ON jobs;
CREATE POLICY "jobs_select_public_or_internal" ON jobs
FOR SELECT USING (
  status = 'aberta'
  OR public.is_admin_or_rh()
  OR (
    public.is_manager() AND department IN (
      SELECT department FROM public.employees WHERE id = public.get_current_employee_id()
    )
  )
);

-- JOB CANDIDATES & APPLICATIONS
DROP POLICY IF EXISTS "candidates_admin_full" ON job_candidates;
CREATE POLICY "candidates_admin_full" ON job_candidates
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "candidates_manager_select" ON job_candidates;
CREATE POLICY "candidates_manager_select" ON job_candidates
FOR SELECT USING (public.is_manager() OR public.is_admin_or_rh());

DROP POLICY IF EXISTS "applications_admin_full" ON job_applications;
CREATE POLICY "applications_admin_full" ON job_applications
FOR ALL USING (public.is_admin_or_rh());

DROP POLICY IF EXISTS "applications_manager_access" ON job_applications;
CREATE POLICY "applications_manager_access" ON job_applications
FOR ALL USING (
  public.is_admin_or_rh()
  OR (
    public.is_manager() AND EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.employees e ON e.id = public.get_current_employee_id()
      WHERE j.id = job_applications.job_id
      AND j.department = e.department
    )
  )
);
