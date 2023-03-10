import { ApiClient } from './api-client';

export class Youcanpay {
  constructor(private readonly privateKey: string, private readonly apiClient: ApiClient) {}

  /**
   * Generate a payment token
   * @see https://youcanpay.com/docs/api#tokenize_payment
   */
  async tokenizePayment(data: TokenizePaymentRequest): Promise<PaymentToken> {
    let payload = { ...data, pri_key: this.privateKey };

    const response = await this.apiClient.post('tokenize', payload);
    return {
      tokenId: response.token.id,
      paymentUrl: this.apiClient.paymentUrl(response.token.id),
    };
  }
}
