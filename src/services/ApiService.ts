import { objectToFormData } from '@octetstream/object-to-form-data'
import type { AxiosError } from 'axios'
import useApi from '@/composables/useApi'
import { cleanEmptyFieldsPayload } from '@/utils/generals'

class ApiService {
  private readonly _endpoint: string
  private readonly _isPublic: boolean

  /**
   * Initializes a new instance of the class with the specified endpoint.
   *
   * @param {string} endpoint - The endpoint to be set for the instance.
   * @param isPublic
   * @return {void}
   */
  public constructor(endpoint: string, isPublic = false) {
    this._endpoint = endpoint
    this._isPublic = isPublic
  }

  /**
   * Determines if the provided data contains any File or Blob objects.
   *
   * @param {any} data - The data object to inspect for File or Blob instances.
   * @return {boolean} - Returns true if any value in the data is a File or Blob, otherwise false.
   */
  protected hasFiles(data: any): boolean {
    if (!data || typeof data !== 'object')
      return false

    // Verifica se o próprio valor é um File ou Blob
    if (data instanceof File || data instanceof Blob)
      return true

    // Se for um array, verifica recursivamente cada elemento
    if (Array.isArray(data))
      return data.some(item => this.hasFiles(item))

    // Se for um objeto, verifica recursivamente cada valor
    return Object.values(data).some(value => this.hasFiles(value))
  }

  /**
   * Preprocesses the provided data object. If the data contains files, it is
   * converted to FormData. Otherwise, empty fields within the data are cleaned.
   *
   * @param httpVerb
   * @param {object} data - The data object to be processed. Defaults to an empty object.
   * @param formData
   * @return {any} - Processed data, either in FormData format or cleaned.
   */
  protected preprocessData(data = {}, formData?: boolean): any {
    data = cleanEmptyFieldsPayload(data)

    console.log('preprocessData', this.hasFiles(data))

    if (this.hasFiles(data) || formData) {
      // Se há arquivos, usa FormData
      return objectToFormData(data)
    }

    return data
  }

  /**
   * Constructs a full URL by appending a query string to the base URL.
   *
   * @param {string} url - The base URL to which the query string will be appended.
   * @param {object} [query] - An optional object representing the query parameters.
   * @return {string} The full URL with the query string appended.
   */
  protected getURL(url: string, query?: any): string {
    query = cleanEmptyFieldsPayload(query)
    query = objectToFormData(query)

    // Converte o objeto de consulta em uma string de consulta
    const queryString = new URLSearchParams(query as any).toString()

    // Remove trailing slash if it exists
    const sanitizedUrl = url.replace(/\/$/, '')

    return queryString ? `${sanitizedUrl}?${queryString}` : sanitizedUrl
  }

  /**
   * Sends a POST or PUT request to the specified endpoint.
   *
   * @param {string} httpVerb - The HTTP verb to be used for the request (either 'POST' or 'PUT').
   * @param {object|string} [data] - The data to be sent with the request. Can be an object or a string.
   * @param {string} [id] - An optional identifier to be appended to the endpoint URL.
   * @param formData
   * @return {Promise<TRequest|undefined>} - Returns a promise that resolves with the response data or undefined if an error occurs.
   */
  public async postOrPutRequest<TRequest>(
    httpVerb: string,
    data?: object | string,
    id?: string,
    formData?: boolean,
  ): Promise<TRequest> {
    // Pre-processa dados
    const payload = this.preprocessData(data, formData)

    let url = id === null || id === undefined ? this._endpoint : `${this._endpoint}/${id}`

    if (typeof data === 'string')
      url = `${this._endpoint}/${data}`

    if (payload instanceof FormData && httpVerb === 'PUT') {
      payload.append('_method', 'PUT')
      httpVerb = 'POST'
    }

    return await useApi.request<TRequest>({
      url,
      method: httpVerb,
      data: payload,
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data', 'public': this._isPublic } : { public: this._isPublic },
    }).then(({ data }) => {
      return data
    })
      .catch(error => {
        this.handleError(error as AxiosError)

        throw error
      })
  }

  /**
   * Send an HTTP GET or DELETE request.
   *
   * @param {string} httpVerb - The HTTP verb to use ('GET' or 'DELETE').
   * @param {any} [query] - Optional query parameters.
   * @param {string} [id] - Optional ID to append to the endpoint URL.
   * @return {Promise<TRequest>} The response data of type TRequest or undefined if an error occurs.
   */
  public async getOrDeleteRequest<TRequest>(
    httpVerb: string,
    query?: any,
    id?: string,
  ): Promise<TRequest> {
    const url = this.getURL(id === null || id === undefined ? this._endpoint : `${this._endpoint}/${id}`, query)

    return await useApi.request<TRequest>({
      url,
      method: httpVerb,
      headers: {
        'Content-Type': 'application/json',
        'public': this._isPublic,
      },
    })
      .then(({ data }) => {
        return data
      })
      .catch(error => {
        this.handleError(error as AxiosError)

        throw error
      })
  }

  /**
   * Sends a POST request to create a new resource with the provided data.
   * If an ID is also provided, it might update an existing resource.
   *
   * @param {object} data - The data to be sent with the POST request.
   * @param {string} [id] - An optional ID indicating the resource to update.
   * @param formData
   * @return {Promise<TRequest>} - A promise that resolves to the created resource or undefined.
   */
  public async create<TRequest>(data: object, id?: string, formData?: boolean): Promise<TRequest> {
    return await this.postOrPutRequest<TRequest>('POST', data, id, formData)
  }

  /**
   * Sends a POST request with the specified data and optional ID.
   *
   * @param {object} data - The data to be sent in the POST request.
   * @param {string} [id] - An optional ID to be included in the request.
   * @param formData
   * @return {Promise<TRequest>} - A promise resolving to the response of the POST request, or undefined if the request fails.
   */
  public async post<TRequest>(data: object, id?: string, formData?: boolean): Promise<TRequest> {
    return await this.postOrPutRequest<TRequest>('POST', data, id, formData)
  }

  /**
   * Sends a PATCH request with the given data and optional ID.
   *
   * @param data - An object containing the field and value to be patched.
   * @param id - An optional string representing the resource ID.
   * @return A promise that resolves to the patched request data or undefined.
   */
  public async patch<TRequest>(data: { field: string; value: any }, id?: string): Promise<TRequest> {
    return await this.postOrPutRequest<TRequest>('PATCH', data, id)
  }

  /**
   * Updates a resource identified by the given ID with the provided data.
   *
   * @param {object} data - The data to update the resource with.
   * @param {string} id - The unique identifier of the resource to be updated.
   * @param formData
   * @return {Promise<TRequest>} A promise that resolves to the updated resource or undefined if not found.
   */
  public async update<TRequest>(data: object, id: string, formData?: boolean): Promise<TRequest> {
    return await this.postOrPutRequest<TRequest>('PUT', data, id, formData)
  }

  /**
   * Fetches all data based on the given query and URL.
   *
   * @param {any} [query] - Optional query parameters to filter the results.
   * @param {string} [url] - Optional URL to override the default endpoint.
   * @return {Promise<TRequest>} - A promise that resolves with the fetched data or undefined if not found.
   */
  public async fetchAll<TRequest>(query?: any, url?: string): Promise<TRequest> {
    return await this.getOrDeleteRequest<TRequest>('GET', query, url)
  }

  /**
   * Fetches data based on the provided ID.
   *
   * @param {string} id - The identifier for the data to be fetched.
   * @return {Promise<TRequest>} A promise that resolves to the fetched data of type TRequest, or undefined if not found.
   */
  public async fetch<TRequest>(id: string): Promise<TRequest> {
    return await this.getOrDeleteRequest<TRequest>('GET', undefined, id)
  }

  /**
   * Deletes a resource identified by the given ID.
   *
   * @param {string} id - The unique identifier of the resource to be deleted.
   * @return {Promise<TRequest>} - A promise that resolves to the deleted resource or undefined.
   */
  public async destroy<TRequest>(id: string): Promise<TRequest> {
    return await this.getOrDeleteRequest<TRequest>('DELETE', undefined, id)
  }

  /**
   * Searches for a record based on the specified field and value, with optional pagination, relation, and ordering.
   *
   * @param {string} field - The field of the record to search by.
   * @param {string} value - The value of the field to search for.
   * @param {number} page - The page number for pagination.
   * @param {string} [relation] - An optional parameter to specify related records.
   * @param {object} [orderBy] - An optional parameter to specify sorting order.
   * @param params
   * @param {string} orderBy.key - The field to order by.
   * @param {string} orderBy.order - The order direction (e.g., 'asc' or 'desc').
   *
   * @return {Promise<TRequest>} A promise that resolves to the search result or undefined if not found.
   */
  async search<TRequest>(field: string, value: string, page: number, relation?: string, orderBy?: any, params?: any): Promise<TRequest> {
    const valueEncode = encodeURIComponent(value)

    return await this.getOrDeleteRequest<TRequest>('GET', {
      page,
      sort_by: orderBy.key,
      sort_order: orderBy.order,
      ...params,
    }, `pesquisarpor/${field}/${valueEncode}/${relation}`)
  }

  /**
   * Handles errors encountered during an API call. If in a development environment,
   * logs the error to the console and rethrows it.
   * @param {AxiosError} error - The error object received from the Axios call.
   * @return {void}
   */
  protected handleError(error: AxiosError) {
    if (import.meta.env.DEV) {
      console.error('APIService Error:', error)
      throw error
    }
  }
}

export default ApiService
