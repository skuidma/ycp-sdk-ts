import { ApiClient } from './api-client';
import { PaymentToken, TokenizePaymentRequest, Transaction } from '../types';

export class Youcanpay {
  constructor(private readonly privateKey: string, private readonly apiClient: ApiClient) {}

  /**
   * Generate a payment token
   * @see https://youcanpay.com/docs/api#tokenize_payment
   * @throws ApiHttpException If the response has a non-successful status code
   * @throws Error if there was a networking error
   */
  async tokenizePayment(data: TokenizePaymentRequest): Promise<PaymentToken> {
    const payload = { ...data, pri_key: this.privateKey };

    const response = await this.apiClient.post('tokenize', payload);
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
    const response = await this.apiClient.get('transactions/' + transactionId, {
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
}
