import { EmployeesList } from '@/components/modules/hris/employees-list'

export const metadata = {
  title: 'Colaboradores (HRIS) | LimaRH',
  description: 'Gestão unificada de colaboradores CLT e PJ',
}

export default function EmployeesPage() {
  return <EmployeesList initialEmployees={[]} />
}
