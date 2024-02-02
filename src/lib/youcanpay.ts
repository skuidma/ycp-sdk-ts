import { ApiClient } from './api-client';
import { PaymentToken, TokenizePaymentRequest, Transaction } from '../types';
import * as crypto from 'crypto';

/**
 * The response from the tokenize endpoint, the one in the documentation is not accurate
 * @see https://youcanpay.com/docs/api#tokenize_payment
 */
interface TokenizeResponse {
  token: {
    id: string;
  };
}

/**
 * The response from the transaction endpoint
 * For field descriptions see the Transaction interface
 */
interface TransactionResponse {
  id: string;
  status: number;
  order_id: string;
  amount: string;
  currency: string;
  base_currency: string | null;
  base_amount: string | null;
  created_at: string;
}

export class Youcanpay {
  constructor(
    private readonly privateKey: string,
    private readonly apiClient: ApiClient,
  ) {}

  /**
   * Generate a payment token
   * @see https://youcanpay.com/docs/api#tokenize_payment
   * @throws ApiHttpException If the response has a non-successful status code
   * @throws Error if there was a networking error
   */
  async tokenizePayment(data: TokenizePaymentRequest): Promise<PaymentToken> {
    const payload = { ...data, pri_key: this.privateKey };

    const response = await this.apiClient.post<TokenizeResponse>('tokenize', payload);
    return {
      tokenId: response.token.id,
      paymentUrl: this.apiClient.paymentUrl(response.token.id),
    };
  }

  /**
   * Get transaction details
   * @throws ApiHttpException If the response has a non-successful status code
   * @throws Error if there was a networking error
   */
  async getTransaction(transactionId: string): Promise<Transaction> {
    const response = await this.apiClient.get<TransactionResponse>('transactions/' + transactionId, {
      pri_key: this.privateKey,
    });
    return {
      ...response,
      ...{
        amount: parseInt(response.amount, 10),
        base_amount: response.base_amount === null ? null : parseInt(response.base_amount, 10),
        created_at: new Date(response.created_at),
      },
    };
  }

  /**
   * Validate a webhook's signature
   * @param webhookPayload Object of the payload e.g.: in ExpressJS you will pass request.body or the body as a JSON string
   * @param expectedSignature The signature found in the X-Youcanpay-Signature header
   */
  validateWebhookSignature(webhookPayload: object | string, expectedSignature: string): boolean {
    if (typeof webhookPayload !== 'string') {
      webhookPayload = JSON.stringify(webhookPayload);
    }

    const actualSignature = crypto.createHmac('sha256', this.privateKey).update(webhookPayload).digest('hex');

    // If they are not the same length timingSafeEqual will throw an error
    if (expectedSignature.length !== actualSignature.length) {
      return false;
    }

    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(actualSignature));
  }

  /**
   * Generate a payment URL from the token
   * @param token
   */
  paymentUrlFromToken(token: string): string {
    return this.apiClient.paymentUrl(token);
  }
}
