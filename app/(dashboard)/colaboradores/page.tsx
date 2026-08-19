import { EmployeesList } from '@/components/modules/hris/employees-list'
import { INITIAL_MOCK_EMPLOYEES } from '@/lib/hris-mock'

export const metadata = {
  title: 'Colaboradores (HRIS) | LimaRH',
  description: 'Gestão unificada de colaboradores CLT e PJ',
}

export default function EmployeesPage() {
  return <EmployeesList initialEmployees={INITIAL_MOCK_EMPLOYEES} />
}
