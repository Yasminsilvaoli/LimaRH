import { notFound } from 'next/navigation'
import { INITIAL_MOCK_EMPLOYEES } from '@/lib/hris-mock'
import { EmployeeProfileView } from '@/components/modules/hris/employee-profile-view'

interface EmployeeProfilePageProps {
  params: Promise<{
    employeeId: string
  }>
}

export default async function EmployeeProfilePage({
  params,
}: EmployeeProfilePageProps) {
  const { employeeId } = await params
  const employee = INITIAL_MOCK_EMPLOYEES.find((e) => e.id === employeeId)

  if (!employee) {
    notFound()
  }

  return <EmployeeProfileView employee={employee} />
}
