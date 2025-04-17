import { type CieloConfig, Environment } from './core/config';
import { HttpClient } from './core/httpClient';
import { ZeroAuthService } from './services/zeroAuthService';

export * from './core/errors';
export * from './models/zeroAuthTypes';
export { Environment, type CieloConfig };

/**
 * Classe principal do SDK para a API Cielo Zero Auth.
 * Ponto de entrada para configurar e acessar os serviços.
 */
export class CieloEcommerceSDK {
  /**
   * Serviço para realizar operações de validação Zero Auth.
   */
  readonly zeroAuth: ZeroAuthService;

  // Mantém uma instância interna do HttpClient configurado
  private httpClient: HttpClient;

  /**
   * Cria uma nova instância do SDK Zero Auth.
   * @param config As configurações necessárias (MerchantId, MerchantKey, Environment).
   */
  constructor(config: CieloConfig) {
    this.httpClient = new HttpClient(config);
    this.zeroAuth = new ZeroAuthService(this.httpClient);

    console.log(`[CieloZeroAuthSDK] Initialized for environment: ${config.environment}`);
  }
}
