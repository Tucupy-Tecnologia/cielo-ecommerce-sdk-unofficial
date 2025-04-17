// --- Tipos para Request ---

/**
 * Representa o objeto CardOnFile, usado para indicar
 * o propósito de armazenamento do cartão.
 */
export interface ZeroAuthCardOnFile {
  /**
   * 'First' se o cartão foi armazenado e é seu primeiro uso.
   * 'Used' se o cartão já foi utilizado anteriormente.
   */
  Usage: 'First' | 'Used';
  /**
   * Indica o propósito de armazenamento se Usage for 'Used'.
   * 'Recurring': Compra recorrente programada.
   * 'Unscheduled': Compra recorrente sem agendamento.
   * 'Installments': Parcelamento através da recorrência.
   */
  Reason?: 'Recurring' | 'Unscheduled' | 'Installments';
}

/**
 * Payload para a requisição de validação de cartão padrão (Zero Auth).
 */
export interface ZeroAuthCardRequest {
  /**
   * Tipo do cartão: 'CreditCard' ou 'DebitCard'.
   */
  CardType: 'CreditCard' | 'DebitCard';
  /**
   * Número do cartão.
   */
  CardNumber: string;
  /**
   * Nome do portador como impresso no cartão.
   */
  Holder: string;
  /**
   * Data de validade no formato MM/YYYY.
   */
  ExpirationDate: string;
  /**
   * Código de segurança (CVV).
   */
  SecurityCode: string;
  /**
   * Bandeira do cartão: 'Visa', 'Master', 'Elo', etc.
   * (Verificar documentação Cielo para lista completa suportada).
   */
  Brand: string; // Considerar usar um Enum se as bandeiras forem fixas e conhecidas
  /**
   * Opcional: Token do cartão previamente gerado pela API E-commerce Cielo.
   * Se informado, os outros dados do cartão (exceto SecurityCode talvez) podem não ser necessários.
   */
  CardToken?: string;
  /**
   * Opcional: Informações sobre o uso do cartão armazenado.
   */
  CardOnFile?: ZeroAuthCardOnFile;
}

// --- Tipos para E-Wallet Request ---

/**
 * Detalhes do cartão dentro da requisição de e-wallet.
 */
export interface ZeroAuthEWalletCard {
  CardType: 'CreditCard' | 'DebitCard';
  CardNumber: string;
  Holder: string;
  ExpirationDate: string; // MM/YYYY
  SecurityCode: string;
  Brand: string; // Visa, Master, Elo...
  CardOnFile?: ZeroAuthCardOnFile;
}

/**
 * Detalhes da carteira digital (e-wallet).
 */
export interface ZeroAuthWallet {
  /**
   * Tipo da e-wallet: 'ApplePay', 'SamsungPay', 'GooglePay'.
   */
  Type: 'ApplePay' | 'SamsungPay' | 'GooglePay';
  /**
   * Campo de validação retornado pela e-wallet (Cryptogram).
   */
  Cavv: string;
  /**
   * Electronic Commerce Indicator.
   */
  Eci: string; // Geralmente um número, mas a API especifica string.
}

/**
 * Payload completo para a requisição de validação de cartão de e-wallet.
 */
export interface ZeroAuthEWalletRequest {
  Card: ZeroAuthEWalletCard;
  Wallet: ZeroAuthWallet;
}

// --- Tipos para Response (combinando os cenários de sucesso e erro do 200 OK) ---

/**
 * Representa uma resposta de sucesso da validação (Cartão Válido).
 * Baseado no schema "Cartão válido" / "Positiva - cartão válido".
 */
export interface ZeroAuthSuccessResponse {
  Valid: true;
  ReturnCode: string; // "00"
  ReturnMessage: string; // "Transacao autorizada"
  IssuerTransactionId?: string; // Pode existir ou não
}

/**
 * Representa uma resposta de falha na validação (Cartão Inválido).
 * Baseado no schema "Cartão inválido" / "Negativa - cartão inválido".
 */
export interface ZeroAuthInvalidCardResponse {
  Valid: false;
  ReturnCode: string; // "57" ou outros códigos de negação
  ReturnMessage: string; // "Autorizacao negada" ou outra mensagem
  IssuerTransactionId?: string; // Pode existir ou não
}

/**
 * Representa uma resposta de erro específico retornado com status 200 OK.
 * Baseado nos schemas "Bandeira inválida", "Restrição cadastral".
 */
export interface ZeroAuthInlineErrorResponse {
  Valid?: false; // O campo 'Valid' pode não estar presente nestes erros
  Code: number; // Código numérico do erro (e.g., 57, 389)
  Message: string; // Mensagem descritiva do erro
}

/**
 * Tipo unificado para as possíveis respostas de sucesso (200 OK) do Zero Auth.
 * Usa a união discriminated union baseada na presença/valor de 'Valid' ou 'Code'.
 */
export type ZeroAuthResponse =
  | ZeroAuthSuccessResponse
  | ZeroAuthInvalidCardResponse
  | ZeroAuthInlineErrorResponse;


// --- Tipos para Response (Erros HTTP 400) ---

/**
 * Item individual dentro da resposta de erro 400 (Bad Request).
 */
export interface ZeroAuthBadRequestErrorItem {
  ReturnCode: number; // Código numérico do erro (e.g., 322)
  ReturnMessage: string; // Mensagem descritiva (e.g., "Zero Dollar Auth is not enabled")
}

/**
 * Resposta completa para um erro 400 (Bad Request), que é um array de itens.
 */
export type ZeroAuthBadRequestResponse = ZeroAuthBadRequestErrorItem[];