import { HttpClient } from '../core/httpClient';
import { type CaptureResponse } from '../models/captureTypes';
import { type VoidResponse } from '../models/voidTypes';
// import { QueryResponse } from '../models/queryTypes';

/**
 * Parâmetros opcionais para operações de captura e cancelamento.
 */
interface TransactionModificationParams {
  /** Valor em centavos a ser capturado/cancelado. Se omitido, captura/cancela o valor total pendente. */
  amount?: number;
  /** Apenas para captura em empresas aéreas. */
  serviceTaxAmount?: number;
}

/**
 * Serviço para gerenciar transações existentes (Captura, Cancelamento, Consulta).
 */
export class TransactionService {
  private readonly httpClient: HttpClient;
  private readonly salesBasePath = '/1/sales/';

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Captura uma transação previamente autorizada usando o PaymentId.
   * Corresponde à operação 'capturar-apos-autorizacao' (PUT /1/sales/{PaymentId}/capture).
   *
   * @param paymentId O ID do pagamento retornado na criação da transação.
   * @param params Parâmetros opcionais como 'amount' e 'serviceTaxAmount'.
   * @returns Uma Promise que resolve com a resposta da operação de captura.
   * @throws {CieloApiError | CieloNetworkError} Em caso de falha.
   */
  async captureByPaymentId(paymentId: string, params?: Pick<TransactionModificationParams, 'amount' | 'serviceTaxAmount'>): Promise<CaptureResponse> {
    if (!paymentId) throw new Error('PaymentId is required for capture.');
    const path = `${this.salesBasePath}${paymentId}/capture`;
    console.log(`[TransactionService] Capturing transaction ${paymentId} with params:`, params);
    return this.httpClient.put<CaptureResponse>(path, params);
  }

  /**
   * Cancela (Void) uma transação usando o PaymentId.
   * Pode ser usado para cancelar uma autorização não capturada ou estornar uma transação capturada.
   * Corresponde à operação 'cancelamento-paymentid' (PUT /1/sales/{PaymentId}/void).
   *
   * @param paymentId O ID do pagamento retornado na criação da transação.
   * @param params Parâmetros opcionais como 'amount' para cancelamento parcial.
   * @returns Uma Promise que resolve com a resposta da operação de cancelamento.
   * @throws {CieloApiError | CieloNetworkError} Em caso de falha.
   */
  async voidByPaymentId(paymentId: string, params?: Pick<TransactionModificationParams, 'amount'>): Promise<VoidResponse> {
    if (!paymentId) throw new Error('PaymentId is required for void.');
    const path = `${this.salesBasePath}${paymentId}/void`;
     console.log(`[TransactionService] Voiding transaction ${paymentId} with params:`, params);
    return this.httpClient.put<VoidResponse>(path, params);
  }

  /**
   * Cancela (Void) uma transação usando o MerchantOrderId.
   * Útil se você não armazenou o PaymentId mas tem o ID do seu pedido.
   * Corresponde à operação 'cancelamento-merchantorderid' (PUT /1/sales/OrderId/{MerchantOrderId}/void).
   *
   * @param merchantOrderId O ID do pedido usado na criação da transação.
   * @param params Parâmetros opcionais como 'amount' para cancelamento parcial.
   * @returns Uma Promise que resolve com a resposta da operação de cancelamento.
   * @throws {CieloApiError | CieloNetworkError} Em caso de falha.
   */
  async voidByMerchantOrderId(merchantOrderId: string, params?: Pick<TransactionModificationParams, 'amount'>): Promise<VoidResponse> {
    if (!merchantOrderId) throw new Error('MerchantOrderId is required for void.');
    // Codifica o MerchantOrderId caso ele contenha caracteres que precisam ser escapados na URL
    const encodedMerchantOrderId = encodeURIComponent(merchantOrderId);
    const path = `${this.salesBasePath}OrderId/${encodedMerchantOrderId}/void`;
     console.log(`[TransactionService] Voiding transaction by Order ID ${merchantOrderId} with params:`, params);
    return this.httpClient.put<VoidResponse>(path, params);
  }

  /**
   * Consulta uma transação existente usando o PaymentId.
   * (Implementação futura - GET /1/sales/{PaymentId})
   *
   * @param paymentId O ID do pagamento retornado na criação da transação.
   * @returns Uma Promise que resolve com os detalhes da transação consultada.
   */
  // async queryByPaymentId(paymentId: string): Promise<QueryResponse> {
  //   if (!paymentId) throw new Error('PaymentId is required for query.');
  //   const path = `${this.salesBasePath}${paymentId}`;
  //   console.log(`[TransactionService] Querying transaction ${paymentId}`);
  //   return this.httpClient.get<QueryResponse>(path);
  // }

  /**
   * Consulta uma transação existente usando o MerchantOrderId.
   * (Implementação futura - GET /1/sales?merchantOrderId={MerchantOrderId})
   *
   * @param merchantOrderId O ID do pedido usado na criação da transação.
   * @returns Uma Promise que resolve com os detalhes da transação consultada.
   */
    // async queryByMerchantOrderId(merchantOrderId: string): Promise<QueryResponse> { 
    //   if (!merchantOrderId) throw new Error('MerchantOrderId is required for query.');
    //   const encodedMerchantOrderId = encodeURIComponent(merchantOrderId);
    //   const path = `${this.salesBasePath}?merchantOrderId=${encodedMerchantOrderId}`;
    //   console.log(`[TransactionService] Querying transaction by Order ID ${merchantOrderId}`);
    //   return this.httpClient.get<QueryResponse>(path); 
    // }
}