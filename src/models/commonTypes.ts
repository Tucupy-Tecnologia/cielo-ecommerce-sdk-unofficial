/**
 * Representa um link HATEOAS retornado pela API.
 */
export interface Link {
  Method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  Rel: string; // Relação do link (e.g., 'self', 'void', 'capture')
  Href: string; // URL do link
}

/**
 * Representa um endereço genérico.
 */
export interface Address {
  Street: string;
  Number: string;
  Complement?: string;
  ZipCode: string;
  City: string;
  State: string; // Sigla do estado (2 caracteres)
  Country: string; // Código ISO Alpha-3 (e.g., 'BRA') ou nome
}

/**
 * Representa um endereço de cobrança (Billing).
 * Pode ter campos adicionais ou diferentes do endereço padrão.
 */
export interface BillingAddress {
    Street: string;
    Number: string;
    Complement?: string;
    Neighborhood?: string;
    ZipCode: string;
    City: string;
    State: string; // Sigla do estado (2 caracteres)
    Country: string; // Código ISO Alpha-2 (e.g., 'BR')
}

/**
 * Representa os dados do cliente (comprador).
 */
export interface Customer {
  Name: string;
  Status?: 'NEW' | 'EXISTING';
  Identity?: string; 
  IdentityType?: 'CPF' | 'CNPJ';
  Email?: string;
  Birthdate?: string; // Formato YYYY-MM-DD
  Address?: Address;
  DeliveryAddress?: Address;
  Billing?: BillingAddress;
}

/**
 * Representa o objeto CardOnFile, usado para indicar
 * o propósito de armazenamento do cartão.
 * Usado tanto em ZeroAuth quanto em Pagamentos.
 */
export interface CardOnFile {
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