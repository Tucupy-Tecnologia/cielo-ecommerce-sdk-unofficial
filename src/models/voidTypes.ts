import { type Link } from './commonTypes';

/**
 * Resposta da operação de cancelamento (PUT .../void).
 */
export interface VoidResponse {
  /** Novo Status da transação (geralmente 10 para Cancelado ou 11 se estorno parcial) */
  Status: number;
  Tid?: string; // Pode não vir em todas as respostas de cancelamento
  ProofOfSale?: string; // NSU do cancelamento
  AuthorizationCode?: string; // Código de autorização original
  ReturnCode: string; // Código de retorno da operação de cancelamento (e.g., "00" ou "9")
  ReturnMessage: string; // Mensagem de retorno
  Links?: Link[]; // Links HATEOAS atualizados
}