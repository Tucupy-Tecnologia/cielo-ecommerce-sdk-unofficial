/**
 * Define os ambientes disponíveis para a API Cielo.
 */
export enum Environment {
  SANDBOX = 'https://apisandbox.cieloecommerce.cielo.com.br',
  /**
   * Ambiente de Produção para transações reais.
   */
  PRODUCTION = 'https://api.cieloecommerce.cielo.com.br',
}

/**
 * Interface para as configurações necessárias para inicializar o SDK.
 */
export interface CieloConfig {
  /**
   * Identificador da loja na Cielo (Merchant ID).
   * Obtido durante o credenciamento.
   */
  merchantId: string;

  /**
   * Chave da loja na Cielo (Merchant Key).
   * Obtida durante o credenciamento.
   */
  merchantKey: string;

  /**
   * O ambiente onde as requisições serão feitas (Sandbox ou Produção).
   */
  environment: Environment;

  /**
   * Opcional: Uma função para gerar IDs de requisição únicos.
   * Útil para idempotência e rastreamento. Se não fornecido, usa crypto.randomUUID().
   */
  requestIdGenerator?: () => string;
}
