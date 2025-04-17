# SDK Não Oficial Cielo E-commerce para Node.js/Bun.js (TypeScript)

[![npm version](https://badge.fury.io/js/cielo-ecommerce-sdk-unofficial.svg)](https://badge.fury.io/js/cielo-ecommerce-sdk-unofficial) [![Build Status](https://travis-ci.org/your-username/your-repo.svg?branch=main)](https://travis-ci.org/your-username/your-repo) **⚠️ AVISO IMPORTANTE: Este SDK NÃO é oficial e NÃO é mantido ou endossado pela Cielo S.A. É um projeto comunitário/independente.** Use por sua conta e risco. Sempre consulte a [documentação oficial da Cielo API E-commerce](https://desenvolvedores.cielo.com.br/) como fonte primária de informação.

## Descrição

Este SDK fornece uma interface em TypeScript para interagir com algumas das principais funcionalidades da API Cielo E-commerce V3, facilitando a integração de pagamentos em aplicações Node.js ou Bun.js.

## Funcionalidades Implementadas

* **Zero Auth:**
    * Validação de Cartão (`/1/zeroauth/`)
    * Validação de Cartão E-Wallet (`/2/zeroauth/`)
* **Cartão de Crédito:**
    * Criação de Pagamento (`POST /1/sales/`)
    * Captura de Pagamento (`PUT /1/sales/{PaymentId}/capture`)
    * Cancelamento (Void) por PaymentId (`PUT /1/sales/{PaymentId}/void`)
    * Cancelamento (Void) por MerchantOrderId (`PUT /1/sales/OrderId/{MerchantOrderId}/void`)
* **Pix:**
    * Criação de Pagamento (Geração de QR Code) (`POST /1/sales/`)
    * Solicitação de Devolução (Refund) (`PUT /1/sales/{PaymentId}/void`)

*(Funcionalidades como consulta, boleto, cartão de débito, etc., podem ser adicionadas no futuro).*

## Instalação

Usando Bun:
```bash
bun add @tucupy-tecnologia/cielo-ecommerce-sdk-unofficial
````

Usando npm:

```bash
npm install @tucupy-tecnologia/cielo-ecommerce-sdk-unofficial
```

Usando yarn:

```bash
yarn add @tucupy-tecnologia/cielo-ecommerce-sdk-unofficial
```
## Configuração

O SDK precisa das suas credenciais da Cielo (`MerchantId` e `MerchantKey`) e do ambiente desejado (`SANDBOX` ou `PRODUCTION`). É **altamente recomendado** usar variáveis de ambiente para armazenar suas credenciais, nunca as coloque diretamente no código.

Crie um arquivo `.env` na raiz do seu projeto (e adicione-o ao `.gitignore`\!):

```dotenv
# .env
CIELO_MERCHANT_ID="SEU_MERCHANT_ID_AQUI"
CIELO_MERCHANT_KEY="SUA_MERCHANT_KEY_AQUI"
```

## Uso Básico

```typescript
import {
    CieloEcommerceSDK,
    Environment,
    CreditCardPaymentRequest, // ou PixPaymentRequest, ZeroAuthCardRequest, etc.
    CieloApiError
} from 'cielo-ecommerce-sdk-unofficial'; // Substitua pelo nome real do pacote

// Carrega as credenciais do ambiente
const merchantId = process.env.CIELO_MERCHANT_ID;
const merchantKey = process.env.CIELO_MERCHANT_KEY;

if (!merchantId || !merchantKey) {
    throw new Error("Credenciais Cielo não definidas nas variáveis de ambiente.");
}

// 1. Instancia o SDK
const cieloSDK = new CieloEcommerceSDK({
    environment: Environment.SANDBOX, // Mude para Environment.PRODUCTION em produção!
    merchantId: merchantId,
    merchantKey: merchantKey,
});

// 2. Exemplo: Criar um pagamento com cartão de crédito (requer Capture=false para testar captura depois)
async function criarPagamento() {
    const payload: CreditCardPaymentRequest = {
        MerchantOrderId: `MeuPedido-${Date.now()}`,
        Payment: {
            Type: 'CreditCard',
            Amount: 1000, // R$ 10,00 em centavos
            Installments: 1,
            Capture: false, // Apenas autoriza
            CreditCard: {
                CardNumber: "4551870000000183", // Cartão de teste Sandbox
                Holder: "Teste Comprador",
                ExpirationDate: "12/2030",
                SecurityCode: "123",
                Brand: "Visa"
            }
        }
    };

    try {
        console.log("Criando pagamento...");
        const response = await cieloSDK.payment.createCreditCardPayment(payload);
        console.log("Pagamento criado/autorizado!");
        console.log("Payment ID:", response.Payment.PaymentId); // Guarde este ID!
        console.log("Status:", response.Payment.Status);

        // Exemplo: Capturar o pagamento autorizado (opcional)
        if (response.Payment.Status === 1 && response.Payment.PaymentId) { // Status 1 = Autorizado
             console.log("\nCapturando pagamento...");
             const captureResponse = await cieloSDK.transaction.captureByPaymentId(response.Payment.PaymentId);
             console.log("Captura realizada!");
             console.log("Novo Status:", captureResponse.Status); // Deve ser 2 (Capturado)
        }

    } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        if (error instanceof CieloApiError) {
            console.error("Detalhes do erro da API:", error.errorData);
        }
    }
}

criarPagamento();
```

## Serviços Disponíveis

A instância do `CieloEcommerceSDK` expõe os seguintes serviços:

  * `sdk.zeroAuth`: Métodos para validação de cartões.
      * `validateCard(...)`
      * `validateEWalletCard(...)`
  * `sdk.payment`: Métodos para criar pagamentos.
      * `createCreditCardPayment(...)`
      * `createPixPayment(...)`
  * `sdk.transaction`: Métodos para gerenciar transações existentes.
      * `captureByPaymentId(...)`
      * `voidByPaymentId(...)`
      * `voidByMerchantOrderId(...)`
      * `refundPixByPaymentId(...)`
      * *(Métodos de consulta podem ser adicionados futuramente)*

Consulte os tipos TypeScript exportados para detalhes sobre os payloads de requisição e os formatos de resposta esperados.

## Tratamento de Erros

O SDK lança erros customizados:

  * `CieloApiError`: Ocorre quando a API da Cielo retorna um erro HTTP (status \>= 400). Contém `statusCode`, `statusText` e `errorData` (o corpo da resposta de erro da Cielo, se disponível).
  * `CieloNetworkError`: Ocorre em caso de falha na comunicação com a API (problemas de rede, DNS, timeout, etc.). Contém a mensagem do erro original e, opcionalmente, o erro `cause`.

Sempre envolva as chamadas aos métodos do SDK em blocos `try...catch` para tratar esses erros adequadamente.

## Contribuição

Contribuições são bem-vindas\! Se você deseja ajudar a melhorar este SDK, siga estas diretrizes:

1.  **Issues:** Antes de iniciar um trabalho ou submeter um Pull Request (PR) para uma nova funcionalidade ou correção significativa, por favor, abra uma [Issue](https://www.google.com/search?q=https://github.com/your-username/your-repo/issues) (substitua pelo link real do seu repositório) para discutir a mudança proposta.
2.  **Fork e Branch:** Faça um fork do repositório e crie um branch para sua funcionalidade ou correção (`git checkout -b feature/minha-feature` ou `git checkout -b fix/meu-bug`).
3.  **Código:**
      * Mantenha o estilo de código existente (use linters como ESLint/Prettier, se configurados).
      * Escreva código claro e comentado quando necessário.
      * Adicione/atualize os tipos TypeScript correspondentes.
      * Adicione testes unitários para novas funcionalidades ou correções de bugs.
4.  **Testes:** Certifique-se de que todos os testes passam (`bun test`).
5.  **Pull Request:** Submeta um Pull Request (PR) para o branch `main` (ou o branch de desenvolvimento principal). Descreva claramente as mudanças realizadas no PR.
6.  **Revisão:** Aguarde a revisão do seu PR. Pode ser necessário fazer ajustes com base no feedback.

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Contato

Para questões gerais, sugestões ou parcerias relacionadas a este SDK (não relacionadas a suporte direto da Cielo), entre em contato:

**contato@tucupy.com**

**Lembre-se:** Para problemas com sua conta Cielo, transações específicas ou dúvidas sobre as regras de negócio da Cielo, contate diretamente o [suporte oficial da Cielo](https://www.cielo.com.br/atendimento).

