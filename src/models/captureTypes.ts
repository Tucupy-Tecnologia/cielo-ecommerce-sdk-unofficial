import { type Link } from './commonTypes';

/**
 * Resposta da operação de captura (PUT /1/sales/{PaymentId}/capture).
 */
export interface CaptureResponse {
  /** Novo Status da transação (geralmente 2 para Capturado) */
  Status: number;
  Tid?: string; // Pode não vir em todas as respostas de captura
  ProofOfSale?: string; // NSU da captura
  AuthorizationCode?: string; // Código de autorização original ou da captura
  ReturnCode: string; // Código de retorno da operação de captura
  ReturnMessage: string; // Mensagem de retorno
  Links?: Link[]; // Links HATEOAS atualizados
}