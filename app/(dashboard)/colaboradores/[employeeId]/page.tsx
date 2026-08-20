import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { EmployeeProfileView } from '@/components/modules/hris/employee-profile-view'
import { EmployeeWithDetails } from '@/types'

interface EmployeeProfilePageProps {
  params: Promise<{
    employeeId: string
  }>
}

export default async function EmployeeProfilePage({
  params,
}: EmployeeProfilePageProps) {
  const { employeeId } = await params
  const supabase = createClient()

  const { data: emp, error } = await (supabase.from('employees') as any)
    .select(`
      *,
      clt_details (*),
      pj_details (*)
    `)
    .eq('id', employeeId)
    .maybeSingle()

  if (error || !emp) {
    notFound()
  }

  const typedEmp = emp as any

  const formattedEmployee: EmployeeWithDetails = {
    ...typedEmp,
    clt_details: Array.isArray(typedEmp.clt_details) ? typedEmp.clt_details[0] || null : typedEmp.clt_details || null,
    pj_details: Array.isArray(typedEmp.pj_details) ? typedEmp.pj_details[0] || null : typedEmp.pj_details || null,
    manager: typedEmp.manager_id ? { id: typedEmp.manager_id, full_name: 'Gestor Responsável' } : null,
  }

  return <EmployeeProfileView employee={formattedEmployee} />
}
