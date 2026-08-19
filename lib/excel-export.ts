import ExcelJS from 'exceljs'

export interface ExcelColumn<T = any> {
  header: string
  key: string
  width?: number
  type?: 'string' | 'number' | 'currency' | 'date' | 'wrapText'
  align?: 'left' | 'center' | 'right'
  formatter?: (value: any, item: T) => any
}

export interface ExportExcelOptions<T> {
  filename: string
  sheetName?: string
  columns: ExcelColumn<T>[]
  data: T[]
}

/**
 * Utilitario generico para exportacao nativa em .xlsx com ExcelJS:
 * - Auto-fit de largura de colunas dinamico
 * - Cabecalhos em negrito com fundo destacado e Freeze Panes (congelamento de linha)
 * - Formatacao monetaria explicita (R$ #,##0.00)
 * - Quebra de linha (wrap text) em descricoes e textos longos
 * - Linhas com bordas suaves e zebra striping para facil visualizacao
 */
export async function exportToExcel<T>({
  filename,
  sheetName = 'Dados',
  columns,
  data,
}: ExportExcelOptions<T>) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'LimaRH'
  workbook.created = new Date()

  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1, xSplit: 0 }],
  })

  // 1. Configuracao e Auto-fit das Colunas
  worksheet.columns = columns.map((col) => {
    let maxLen = col.header.length

    data.forEach((item) => {
      const rawVal = col.formatter ? col.formatter((item as any)[col.key], item) : (item as any)[col.key]
      if (rawVal !== null && rawVal !== undefined) {
        const strVal = String(rawVal)
        if (strVal.length > maxLen) {
          maxLen = col.type === 'wrapText' ? Math.min(strVal.length, 45) : strVal.length
        }
      }
    })

    const calculatedWidth = col.width || Math.max(maxLen + 4, 14)

    return {
      header: col.header,
      key: col.key,
      width: Math.min(Math.max(calculatedWidth, 12), col.type === 'wrapText' ? 50 : 40),
    }
  })

  // 2. Estilizacao do Cabecalho (Linha 1)
  const headerRow = worksheet.getRow(1)
  headerRow.height = 28
  headerRow.eachCell((cell, colNumber) => {
    const colDef = columns[colNumber - 1]
    cell.font = {
      name: 'Segoe UI',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F172A' }, // Slate escuro
    }
    cell.alignment = {
      vertical: 'middle',
      horizontal: colDef?.align || (colDef?.type === 'currency' || colDef?.type === 'number' ? 'right' : 'left'),
    }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF334155' } },
      bottom: { style: 'medium', color: { argb: 'FF0284C7' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      right: { style: 'thin', color: { argb: 'FF334155' } },
    }
  })

  // 3. Insercao e Estilizacao dos Dados
  data.forEach((item, index) => {
    const rowValues: Record<string, any> = {}

    columns.forEach((col) => {
      const rawVal = (item as any)[col.key]
      const formattedVal = col.formatter ? col.formatter(rawVal, item) : rawVal
      rowValues[col.key] = formattedVal ?? ''
    })

    const row = worksheet.addRow(rowValues)
    row.height = 22

    const isEven = index % 2 === 0

    row.eachCell((cell, colNumber) => {
      const colDef = columns[colNumber - 1]

      cell.font = {
        name: 'Segoe UI',
        size: 10,
        color: { argb: 'FF1E293B' },
      }

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF8FAFC' },
      }

      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      }

      if (colDef?.type === 'currency') {
        cell.numFmt = '"R$"\\ #,##0.00;[Red]("-R$"\\ #,##0.00);"R$"\\ 0.00'
        cell.alignment = { vertical: 'middle', horizontal: 'right' }
        if (typeof cell.value === 'string') {
          const num = Number(cell.value)
          if (!isNaN(num)) cell.value = num
        }
      } else if (colDef?.type === 'number') {
        cell.numFmt = '#,##0.00'
        cell.alignment = { vertical: 'middle', horizontal: 'right' }
        if (typeof cell.value === 'string') {
          const num = Number(cell.value)
          if (!isNaN(num)) cell.value = num
        }
      } else if (colDef?.type === 'wrapText') {
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
      } else if (colDef?.align) {
        cell.alignment = { vertical: 'middle', horizontal: colDef.align }
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' }
      }
    })
  })

  // 4. Download no Navegador
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.xlsx') ? filename : filename + '.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Utilitario para exportacao em .csv com padrao brasileiro (ponto e virgula e UTF-8 BOM)
 */
export function exportToCSV<T>({
  filename,
  columns,
  data,
}: {
  filename: string
  columns: ExcelColumn<T>[]
  data: T[]
}) {
  const headers = columns.map((c) => c.header)

  const rows = data.map((item) => {
    return columns.map((col) => {
      const rawVal = (item as any)[col.key]
      const formattedVal = col.formatter ? col.formatter(rawVal, item) : rawVal

      if (col.type === 'currency' && typeof formattedVal === 'number') {
        return 'R$ ' + formattedVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }

      if (formattedVal === null || formattedVal === undefined) return ''
      return String(formattedVal)
    })
  })

  // Delimitador ponto e virgula (;) e aspas duplas com escape
  const csvContent = [
    headers.map((h) => '"' + h.replace(/"/g, '""') + '"').join(';'),
    ...rows.map((row) =>
      row.map((field) => '"' + String(field).replace(/"/g, '""') + '"').join(';')
    ),
  ].join('\r\n')

  // Inclusao do UTF-8 BOM (\uFEFF) para correta identificacao de acentuacao no Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : filename + '.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}