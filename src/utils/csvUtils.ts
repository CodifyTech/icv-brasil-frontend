/**
 * Utilitários para manipulação de arquivos CSV no frontend
 */

export interface CSVExportOptions {
  filename?: string
  separator?: string
  addBOM?: boolean
}

export class CSVUtils {
  /**
   * Faz download de um blob como arquivo CSV
   */
  static downloadCSVFromBlob(blob: Blob, options: CSVExportOptions = {}): void {
    const {
      filename = `export_${new Date().toISOString().split('T')[0]}.csv`,
    } = options

    // Criar URL do blob
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    // Configurar o link
    link.href = url
    link.setAttribute('download', filename)
    link.style.display = 'none'

    // Adicionar ao DOM, clicar e remover
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Limpar a URL do objeto
    window.URL.revokeObjectURL(url)
  }

  /**
   * Converte array de objetos para CSV
   */
  static arrayToCSV(
    data: Record<string, any>[],
    headers?: string[],
    options: CSVExportOptions = {},
  ): string {
    const {
      separator = ';',
      addBOM = true,
    } = options

    if (!data || data.length === 0)
      return ''

    // Se não foram fornecidos headers, usar as chaves do primeiro objeto
    const csvHeaders = headers || Object.keys(data[0])

    // Função para escapar valores CSV
    const escapeCSVValue = (value: any): string => {
      if (value === null || value === undefined)
        return ''

      const stringValue = String(value)

      // Se contém separador, quebras de linha ou aspas, precisa ser escapado
      if (stringValue.includes(separator) || stringValue.includes('"') || stringValue.includes('\n'))
        return `"${stringValue.replace(/"/g, '""')}"`

      return stringValue
    }

    // Criar as linhas do CSV
    const csvLines: string[] = []

    // Adicionar cabeçalho
    csvLines.push(csvHeaders.map(escapeCSVValue).join(separator))

    // Adicionar dados
    data.forEach(row => {
      const csvRow = csvHeaders.map(header => escapeCSVValue(row[header]))

      csvLines.push(csvRow.join(separator))
    })

    // Juntar todas as linhas
    let csvContent = csvLines.join('\n')

    // Adicionar BOM se necessário
    if (addBOM)
      csvContent = `\uFEFF${csvContent}`

    return csvContent
  }

  /**
   * Gera e baixa CSV a partir de array de objetos
   */
  static downloadCSVFromArray(
    data: Record<string, any>[],
    headers?: string[],
    options: CSVExportOptions = {},
  ): void {
    const csvContent = this.arrayToCSV(data, headers, options)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    this.downloadCSVFromBlob(blob, options)
  }

  /**
   * Formata data para CSV (formato brasileiro)
   */
  static formatDateForCSV(date: string | Date | null | undefined): string {
    if (!date)
      return ''

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date

      return dateObj.toLocaleDateString('pt-BR')
    }
    catch {
      return ''
    }
  }

  /**
   * Formata valor monetário para CSV
   */
  static formatCurrencyForCSV(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '')
      return ''

    try {
      const numValue = typeof value === 'string' ? Number.parseFloat(value) : value

      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(numValue)
    }
    catch {
      return ''
    }
  }

  /**
   * Limpa e formata string para CSV
   */
  static formatStringForCSV(value: any): string {
    if (value === null || value === undefined)
      return ''

    return String(value)
      .trim()
      .replace(/\s+/g, ' ') // Substitui múltiplos espaços por um só
      .replace(/[\r\n]/g, ' ') // Remove quebras de linha
  }
}

export default CSVUtils
