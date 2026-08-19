import { exportToExcel, exportToCSV, ExcelColumn } from '@/lib/excel-export'

export interface JobTemplateRow {
  titulo: string
  departamento: string
  tipo_contrato: 'CLT' | 'PJ'
  modelo_trabalho: 'presencial' | 'hibrido' | 'remoto'
  localizacao: string
  salario_minimo: number
  salario_maximo: number
  descricao: string
  requisitos: string
  beneficios: string
}

const jobTemplateColumns: ExcelColumn<JobTemplateRow>[] = [
  {
    header: 'titulo',
    key: 'titulo',
    type: 'string',
    width: 28,
  },
  {
    header: 'departamento',
    key: 'departamento',
    type: 'string',
    width: 20,
  },
  {
    header: 'tipo_contrato',
    key: 'tipo_contrato',
    type: 'string',
    align: 'center',
    width: 15,
  },
  {
    header: 'modelo_trabalho',
    key: 'modelo_trabalho',
    type: 'string',
    align: 'center',
    width: 18,
  },
  {
    header: 'localizacao',
    key: 'localizacao',
    type: 'string',
    width: 25,
  },
  {
    header: 'salario_minimo',
    key: 'salario_minimo',
    type: 'currency',
    width: 18,
  },
  {
    header: 'salario_maximo',
    key: 'salario_maximo',
    type: 'currency',
    width: 18,
  },
  {
    header: 'descricao',
    key: 'descricao',
    type: 'wrapText',
    width: 45,
  },
  {
    header: 'requisitos',
    key: 'requisitos',
    type: 'wrapText',
    width: 45,
  },
  {
    header: 'beneficios',
    key: 'beneficios',
    type: 'wrapText',
    width: 40,
  },
]

const sampleJobRows: JobTemplateRow[] = [
  {
    titulo: 'Engenheiro de Dados Senior',
    departamento: 'Engenharia',
    tipo_contrato: 'CLT',
    modelo_trabalho: 'remoto',
    localizacao: 'Sao Paulo, SP (Remoto)',
    salario_minimo: 12000,
    salario_maximo: 15000,
    descricao: 'Construcao de pipelines de dados em tempo real e data warehouse moderno.',
    requisitos: 'SQL avancado, Python, Apache Spark, Airflow e AWS.',
    beneficios: 'VR de R$ 45/dia, Plano de Saude Nacional, Gympass e Auxilio Home Office.',
  },
  {
    titulo: 'Tech Recruiter Pleno',
    departamento: 'Gente & Gestao',
    tipo_contrato: 'PJ',
    modelo_trabalho: 'hibrido',
    localizacao: 'Curitiba, PR',
    salario_minimo: 7000,
    salario_maximo: 8500,
    descricao: 'Conducao de processos seletivos end-to-end para posicoes de tecnologia.',
    requisitos: 'Experiencia previa em ATS, sourcing no LinkedIn e entrevistas por competencias.',
    beneficios: 'Horario flexivel, bonus semestral e recesso remunerado de 30 dias.',
  },
]

export async function downloadJobTemplateExcel() {
  await exportToExcel({
    filename: 'modelo_importacao_vagas_limarh.xlsx',
    sheetName: 'Modelo de Vagas',
    columns: jobTemplateColumns,
    data: sampleJobRows,
  })
}

export function downloadJobTemplateCSV() {
  exportToCSV({
    filename: 'modelo_importacao_vagas_limarh.csv',
    columns: jobTemplateColumns,
    data: sampleJobRows,
  })
}