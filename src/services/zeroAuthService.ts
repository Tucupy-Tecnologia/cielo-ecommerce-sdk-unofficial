import { HttpClient } from '../core/httpClient';
import {
  type ZeroAuthCardRequest,
  type ZeroAuthEWalletRequest,
  type ZeroAuthResponse
} from '../models/zeroAuthTypes';

/**
 * Serviço para interagir com os endpoints da API Zero Auth da Cielo.
 */
export class ZeroAuthService {
  private readonly httpClient: HttpClient;
  private readonly basePathV1 = '/1/zeroauth/';
  private readonly basePathV2 = '/2/zeroauth/';

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Valida um cartão padrão (crédito ou débito) usando o Zero Auth V1.
   * Corresponde à operação 'validar-cartao' (POST /1/zeroauth/).
   *
   * @param payload Os dados do cartão a serem validados.
   * @returns Uma Promise que resolve com o resultado da validação (ZeroAuthResponse).
   * @throws {CieloApiError | CieloNetworkError} Em caso de falha na comunicação ou erro da API.
   */
  async validateCard(payload: ZeroAuthCardRequest): Promise<ZeroAuthResponse> {
    console.log('[ZeroAuthService] Validating standard card...');
    return this.httpClient.post<ZeroAuthCardRequest, ZeroAuthResponse>(this.basePathV1, payload);
  }

  /**
   * Valida um cartão armazenado em uma e-wallet usando o Zero Auth V2.
   * Corresponde à operação 'validar-cartao-e-wallet' (POST /2/zeroauth/).
   *
   * @param payload Os dados do cartão e da e-wallet.
   * @returns Uma Promise que resolve com o resultado da validação (ZeroAuthResponse).
   * @throws {CieloApiError | CieloNetworkError} Em caso de falha na comunicação ou erro da API.
   */
  async validateEWalletCard(payload: ZeroAuthEWalletRequest): Promise<ZeroAuthResponse> {
     console.log('[ZeroAuthService] Validating e-wallet card...');
     return this.httpClient.post<ZeroAuthEWalletRequest, ZeroAuthResponse>(this.basePathV2, payload);
  }
}