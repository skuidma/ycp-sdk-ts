import axios, { Axios, AxiosError } from 'axios';
import { ApiHttpException } from '../exceptions/api-http.exception';

export class ApiClient {
  readonly BASE_URL = 'https://youcanpay.com';

  constructor(private readonly isSandboxMode: boolean, private readonly httpClient: Axios) {}

  private getUrl(endpoint: string): string {
    const sandboxPrefix = this.isSandboxMode ? 'sandbox/' : '';
    return `${this.BASE_URL}/${sandboxPrefix}api/${endpoint.replace(/^\//, '')}`;
  }

  /**
   * Endpoint without the base url
   * e.g.: Pass /tokenize to POST to https://youcanpay.com/api/tokenize
   * @param endpoint
   * @param payload
   */
  async post(endpoint: string, payload: object): Promise<any> {
    try {
      const response = await this.httpClient.post(this.getUrl(endpoint), payload);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        // Error is due to networking problem
        if (e.cause) {
          throw e.cause;
        }
        // Error is due to invalid API response
        throw new ApiHttpException(e.response?.status ?? 0, e.response?.data ?? {});
      }
      // Unexpected error
      throw e;
    }
  }

  paymentUrl(token: string): string {
    const sandboxPrefix = this.isSandboxMode ? 'sandbox/' : '';
    return `${this.BASE_URL}/${sandboxPrefix}payment-form/${token}`;
  }
}
