import type { HeadersInit } from 'bun';
import { type CieloConfig } from './config';
import { CieloApiError, CieloNetworkError } from './errors';

/**
 * Cliente HTTP responsável por fazer as requisições para a API Cielo.
 * Abstrai a configuração de headers e tratamento básico de erros.
 */
export class HttpClient {
  private readonly config: CieloConfig;
  private readonly requestIdGenerator: () => string;

  constructor(config: CieloConfig) {
    if (!config.merchantId || !config.merchantKey) {
        throw new Error('MerchantId and MerchantKey are required in CieloConfig.');
    }
    if (!config.environment) {
        throw new Error('Environment (SANDBOX or PRODUCTION) is required in CieloConfig.');
    }
    this.config = config;
    this.requestIdGenerator = config.requestIdGenerator ?? crypto.randomUUID;
  }

  /**
   * Monta os headers padrão para as requisições Cielo.
   * @param hasBody Indica se a requisição terá corpo (para Content-Type).
   * @returns Objeto de HeadersInit pronto para ser usado com fetch.
   */
  private getHeaders(hasBody: boolean = true): HeadersInit {
    const headers: HeadersInit = {
        'MerchantId': this.config.merchantId,
        'MerchantKey': this.config.merchantKey,
        'RequestId': this.requestIdGenerator(),
    };
    if (hasBody) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  /**
   * Processa a resposta HTTP, tratando sucessos e erros.
   * @param response A resposta do fetch.
   * @returns A resposta parseada como JSON em caso de sucesso.
   * @throws {CieloApiError} Se a API retornar um status de erro (>= 400).
   */
  private async handleResponse<TResponse>(response: Response): Promise<TResponse> {
    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
        console.error(`[HTTP Client] API Error Response Body:`, errorData);
      } catch (e) {
        try {
          errorData = await response.text();
          console.error(`[HTTP Client] API Error Response Text:`, errorData);
        } catch {
          console.error(`[HTTP Client] Failed to parse error response body.`);
          errorData = 'Failed to parse error response body';
        }
      }
      throw new CieloApiError(response.status, response.statusText, errorData);
    }

    if (response.status === 204) { // No Content
      console.log(`[HTTP Client] Received ${response.status} No Content`);
      return {} as TResponse;
    }

    // Para 201 Created ou 200 OK com corpo
    const responseData = await response.json() as TResponse;
    console.log(`[HTTP Client] Success Response Body (${response.status}):`, responseData);
    return responseData;
  }

  /**
   * Realiza uma requisição POST para a API Cielo.
   */
  async post<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse> {
    const url = `${this.config.environment}${path}`;
    const headers = this.getHeaders(true); // POST tem corpo
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    };

    console.log(`[HTTP Client] POST ${url}`);

    try {
      const response = await fetch(url, requestOptions);
      // O status 201 (Created) também é sucesso para POST /1/sales/
      return await this.handleResponse<TResponse>(response);
    } catch (error) {
      if (error instanceof CieloApiError) throw error;
      console.error(`[HTTP Client] Network or unexpected error on POST ${url}:`, error);
      throw new CieloNetworkError((error as Error).message ?? 'Unknown network error', error as Error);
    }
  }

  /**
   * Realiza uma requisição PUT para a API Cielo.
   * Usado para Captura e Cancelamento.
   * @param path O caminho do endpoint (ex: '/1/sales/{id}/capture').
   * @param queryParams Parâmetros de query string (opcional).
   * @param body Corpo da requisição (opcional, geralmente não usado em PUTs da Cielo).
   * @returns Uma Promise que resolve com a resposta da API parseada como TResponse.
   */
  async put<TResponse>(path: string, queryParams?: Record<string, string | number | boolean | undefined>, body?: any): Promise<TResponse> {
    const url = new URL(`${this.config.environment}${path}`);

    // Adiciona query parameters se existirem
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) { // Adiciona apenas se tiver valor
          url.searchParams.append(key, String(value));
        }
      });
    }

    const urlString = url.toString();
    const hasBody = body !== undefined && body !== null;
    const headers = this.getHeaders(hasBody);
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: headers,
        body: hasBody ? JSON.stringify(body) : undefined,
    };

    console.log(`[HTTP Client] PUT ${urlString}`);

    try {
      const response = await fetch(urlString, requestOptions);
      return await this.handleResponse<TResponse>(response);
    } catch (error) {
      if (error instanceof CieloApiError) throw error;
      console.error(`[HTTP Client] Network or unexpected error on PUT ${urlString}:`, error);
      throw new CieloNetworkError((error as Error).message ?? 'Unknown network error', error as Error);
    }
  }

  /**
   * Realiza uma requisição GET para a API Cielo.
   * (Implementação básica para futuras consultas)
   * @param path O caminho do endpoint (ex: '/1/sales/{id}').
   * @returns Uma Promise que resolve com a resposta da API parseada como TResponse.
   */
  async get<TResponse>(path: string): Promise<TResponse> {
    const url = `${this.config.environment}${path}`;
    const headers = this.getHeaders(false); // GET não tem corpo
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
    };

    console.log(`[HTTP Client] GET ${url}`);

    try {
      const response = await fetch(url, requestOptions);
      return await this.handleResponse<TResponse>(response);
    } catch (error) {
      if (error instanceof CieloApiError) throw error;
      console.error(`[HTTP Client] Network or unexpected error on GET ${url}:`, error);
      throw new CieloNetworkError((error as Error).message ?? 'Unknown network error', error as Error);
    }
  }
}