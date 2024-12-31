import axios from 'axios'

export const copyToClipboard = (text: string): boolean => {
  const textField = document.createElement('textarea')

  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()

  const success = document.execCommand('copy')

  textField.remove()

  return success
}

export const cleanEmptyFieldsPayload = (payload: any): Record<string, any> => {
  if (payload === null || payload === undefined)
    return {}

  const cleanPayload: Record<string, any> = {} // Usando Record para melhor segurança de tipos

  Object.entries(payload).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
      // Recursively clean nested object
      const nestedCleaned = cleanEmptyFieldsPayload(value)

      if (Object.keys(nestedCleaned).length > 0)
        cleanPayload[key] = nestedCleaned
    }
    else if (value !== null
      && value !== undefined
      && value !== ''
      && value !== 'null'
      && value !== 'undefined'
      && value !== '""') {
      cleanPayload[key] = value
    }
  })

  return cleanPayload
}

export async function pesquisaCEP(cep: string): Promise<{
  logradouro: string
  cidade: string
  bairro: string
  estado: string
}> {
  if (!cep || cep.length < 9)
    throw new Error('CEP inválido')

  return await axios
    .get(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => {
      return {
        logradouro: response.data.logradouro,
        cidade: response.data.localidade,
        bairro: response.data.bairro,
        estado: response.data.uf,
      }
    })
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const getExtension = filename => {
  if (filename === null || filename === undefined)
    return

  return filename?.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

export const checkMimeType = (value: string | null): string | false => {
  if (!value) {
    console.log('O valor fornecido é nulo.')

    return false
  }

  let mimeType: string | null | false = null

  // Check if value is a base64 string
  if (value.startsWith('data:')) {
    const mimeRegex = /data:([^;]+);/
    const match = mimeRegex.exec(value)

    mimeType = match ? match[1] : null
  }
  else {
    // Assume value is a file path or URL
    mimeType = getExtension(value)
  }

  if (mimeType) {
    console.log(`O valor tem o MIME type ${mimeType}.`)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return true
  }
  else {
    console.log('Não foi possível determinar o MIME type do valor.')

    return false
  }
}

export const blurHandler = () => {
  const element = document.activeElement as HTMLElement

  if (element)
    element.blur()
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const minifyUnit = (unit: string): string => {
  return unit === 'M2' ? 'm²' : 'ha'
}

/**
 * Retorna uma string indicando a quantidade de elementos em um array,
 * utilizando o singular ou plural da palavra fornecida.
 *
 * @param {any[] | number} value - O array cujo comprimento será calculado ou número.
 * @param {string} singular - A palavra a ser usada no singular.
 * @param {string} [plural] - A palavra a ser usada no plural (opcional).
 * @returns {string} - Uma string indicando a quantidade no singular ou plural.
 */
export const getArrayLengthDescription = (value: any, singular: string, plural?: string) => {
  const length = Array.isArray(value) ? value.length : value
  const pluralForm = plural || `${singular}s`
  const word = length === 1 ? singular : pluralForm

  return `${length} ${word}`
}
