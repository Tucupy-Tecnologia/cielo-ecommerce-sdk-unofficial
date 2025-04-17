/**
 * Erro base para problemas específicos da interação com a API Cielo.
 */
export class CieloError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CieloError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Representa um erro retornado pela própria API da Cielo (HTTP status >= 400).
 */
export class CieloApiError extends CieloError {
  /**
   * O código de status HTTP retornado pela API (e.g., 400, 401, 500).
   */
  public readonly statusCode: number;

  /**
   * A mensagem de status HTTP (e.g., "Bad Request").
   */
  public readonly statusText: string;

  /**
   * O corpo da resposta de erro parseado, se disponível.
   * Pode ser um objeto ou um array, dependendo do erro da Cielo.
   * Ex: [{ Code: number, Message: string }] ou { Code: number, Message: string }
   */
  public readonly errorData?: any;

  constructor(statusCode: number, statusText: string, errorData?: any, message?: string) {
    const defaultMessage = `Cielo API Error: ${statusCode} ${statusText}`;
    super(message || defaultMessage);
    this.name = 'CieloApiError';
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.errorData = errorData;
  }
}

/**
 * Representa um erro ocorrido durante a comunicação com a API Cielo
 * (e.g., problema de rede, falha de DNS, timeout).
 */
export class CieloNetworkError extends CieloError {
    /**
     * O erro original que causou a falha de rede, se disponível.
     */
    public readonly cause?: Error;

    constructor(message: string, cause?: Error) {
        super(`Cielo Network Error: ${message}`);
        this.name = 'CieloNetworkError';
        this.cause = cause;
    }
}