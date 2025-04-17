import { type CardOnFile, type Customer, type Link } from './commonTypes';

/**
 * Detalhes do cartão de crédito na requisição de pagamento.
 */
export interface CreditCardDetailsRequest {
  CardNumber: string;
  Holder: string; // Nome como no cartão, sem caracteres especiais
  ExpirationDate: string; // MM/YYYY
  /** Código de segurança. Não obrigatório se SaveCard=true e for transação recorrente */
  SecurityCode?: string;
  /** Define se o cartão deve ser salvo para gerar um CardToken */
  SaveCard?: boolean;
  Brand: string; // 'Visa', 'Master', 'Amex', 'Elo', 'Aura', 'JCB', 'Diners', 'Discover', 'Hipercard'
  CardOnFile?: CardOnFile;
}

/**
 * Indicador de transação iniciada (CIT/MIT) - Obrigatório para Mastercard.
 */
export interface InitiatedTransactionIndicator {
  Category: 'C1' | 'M1' | 'M2'; // C1=Portador, M1=Loja Recorrente/Parcelada, M2=Loja
  Subcategory?: string; // Varia conforme Category (CredentialsOnFile, StandingOrder, Subscription, Installment, PartialShipment, RelatedOrDelayedCharge, NoShow, Resubmission)
}

/**
 * Dados de autenticação externa (3DS).
 */
export interface ExternalAuthentication {
  Cavv: string; // Obrigatório se autenticado com sucesso ou Data Only
  Xid?: string; // Obrigatório se 3DS >= 2
  Eci: number; // Electronic Commerce Indicator
  ReferenceId?: string; // Obrigatório se 3DS >= 2 (RequestId da autenticação)
  Version: string; // '2.1.0' ou '2.2.0' (Obrigatório se autenticado)
  DataOnly?: boolean; // Obrigatório se for Data Only
}

/**
 * Dados específicos para companhias aéreas.
 */
export interface AirlineData {
  TicketNumber?: string;
}

/**
 * Detalhes do objeto Payment na requisição de criação de pagamento.
 */
export interface PaymentDetailsRequest {
  /** Tipo do pagamento (Sempre 'CreditCard' neste contexto) */
  Type: 'CreditCard';
  /** Valor em centavos */
  Amount: number;
  /** Número de parcelas (1 para à vista ou recorrência) */
  Installments: number;
  /** Moeda (e.g., 'BRL') */
  Currency?: string;
  /** País (e.g., 'BRA') */
  Country?: string;
  /** Tipo de parcelamento ('ByMerchant' ou 'ByIssuer') */
  Interest?: 'ByMerchant' | 'ByIssuer';
  /** Define se a captura é automática (true) ou posterior (false) */
  Capture?: boolean;
  /** Indica se a transação foi autenticada via 3DS */
  Authenticate?: boolean;
  /** Indica se é uma transação recorrente (sem CVV) */
  Recurrent?: boolean;
  /** Descrição na fatura (máx 13 chars, sem especiais) */
  SoftDescriptor?: string;
  /** URL para notificação de mudança de status (webhook) */
  ReturnUrl?: string; // Não presente no openapi.json fornecido, mas comum na API V3
  /** Dados do cartão de crédito */
  CreditCard: CreditCardDetailsRequest;
  /** Indicador CIT/MIT (Obrigatório Mastercard) */
  InitiatedTransactionIndicator?: InitiatedTransactionIndicator;
  /** Dados de autenticação externa (3DS) */
  ExternalAuthentication?: ExternalAuthentication;
  /** Opcional: Provedor (e.g., 'Cielo') */
  Provider?: string;
  /** Opcional: Valor da taxa de serviço (empresas aéreas) */
  ServiceTaxAmount?: number;
  /** Opcional: Identifica se é uma gorjeta */
  Tip?: boolean;
  /** Opcional: Dados de cia aérea */
  AirlineData?: AirlineData;
  /** Opcional: Define se é uma negociação de criptomoeda */
  IsCryptocurrencyNegociation?: boolean; // Corrigido de IsCryptoCurrencyNegotiation
}

/**
 * Payload completo para a requisição de criação de pagamento com cartão de crédito.
 */
export interface CreditCardPaymentRequest {
  MerchantOrderId: string;
  Customer?: Customer
  Payment: PaymentDetailsRequest;
}


// --- Tipos para Response da Criação de Pagamento (201 Created) ---

/**
 * Detalhes do cartão de crédito na resposta de pagamento.
 */
export interface CreditCardDetailsResponse extends Omit<CreditCardDetailsRequest, 'SecurityCode' | 'SaveCard'> {
  CardNumber: string; // Vem mascarado (e.g., '455187******0183')
  SaveCard?: boolean; // Indica se foi solicitado salvar
  PaymentAccountReference?: string; // Referência da conta de pagamento (PAR)
}

/**
 * Detalhes do objeto Payment na resposta de criação de pagamento.
 */
export interface PaymentResponseDetails extends Omit<PaymentDetailsRequest, 'CreditCard' | 'ExternalAuthentication'> {
  PaymentId: string; // ID da transação Cielo
  Tid: string; // Transaction ID
  ProofOfSale: string; // NSU (Número Sequencial Único)
  AuthorizationCode?: string; // Código de autorização (se autorizado)
  /** Status da transação (0=Pendente, 1=Autorizado, 2=Pago, 3=Negado, 10=Cancelado, 11=Devolvido, 12=Pendente, 13=Abortado, 20=Agendada) - Consultar documentação! */
  Status: number;
  ReturnCode: string; // Código de retorno da adquirente/banco
  ReturnMessage: string; // Mensagem de retorno
  SoftDescriptor?: string; // O que foi enviado/definido
  CapturedAmount?: number; // Valor capturado (se Capture=true)
  VoidedAmount?: number; // Valor cancelado (se aplicável)
  /** Valor autorizado (pode ser diferente do Amount se houver ServiceTaxAmount) */
  AuthorizedAmount?: number;
  Currency: string; // Ex: BRL
  Country: string; // Ex: BRA
  Links?: Link[]; // Links HATEOAS (para consultar, cancelar, capturar)
  CreditCard: CreditCardDetailsResponse; // Detalhes do cartão (mascarado)
  /** Código de recomendação da bandeira (Merchant Advice Code) */
  MerchantAdviceCode?: string;
  /** Indica se a Cielo tentará cancelar automaticamente em caso de erro após autorização */
  TryAutomaticCancellation?: boolean;
  /** Coleção de dados extras (uso específico) */
  ExtraDataCollection?: { Name: string; Value: string }[];
}

/**
 * Resposta completa para a criação de pagamento bem-sucedida (201 Created).
 */
export interface CreditCardPaymentResponse {
  MerchantOrderId: string;
  Customer: Customer | null;
  Payment: PaymentResponseDetails;
}