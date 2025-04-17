import { HttpClient } from '../core/httpClient';
import { type CreditCardPaymentRequest, type CreditCardPaymentResponse } from '../models/paymentTypes';

/**
 * Serviço para criar pagamentos via API Cielo E-commerce.
 */
export class PaymentService {
  private readonly httpClient: HttpClient;
  private readonly salesBasePath = '/1/sales/';

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Cria uma nova transação de pagamento com Cartão de Crédito.
   * Corresponde à operação 'criar-pagamento-credito' (POST /1/sales/).
   *
   * @param payload Os dados do pagamento (pedido, cliente, detalhes do pagamento).
   * @returns Uma Promise que resolve com os detalhes da transação criada (CreditCardPaymentResponse).
   * @throws {CieloApiError | CieloNetworkError} Em caso de falha na comunicação ou erro da API.
   */
  async createCreditCardPayment(payload: CreditCardPaymentRequest): Promise<CreditCardPaymentResponse> {
    // Validações básicas podem ser adicionadas aqui
    if (!payload.MerchantOrderId) {
        throw new Error('MerchantOrderId is required.');
    }
    if (!payload.Payment || !payload.Payment.CreditCard || !payload.Payment.Amount) {
        throw new Error('Payment details (including CreditCard and Amount) are required.');
    }

    console.log(`[PaymentService] Creating credit card payment for Order ID: ${payload.MerchantOrderId}`);
    return this.httpClient.post<CreditCardPaymentRequest, CreditCardPaymentResponse>(
      this.salesBasePath,
      payload
    );
  }

  // TODO: Adicionar métodos para outros tipos de pagamento (Boleto, Pix, Débito) se necessário.
}