import { Axios, AxiosError } from 'axios';
import { ApiHttpException } from '../exceptions/api-http.exception';

export class ApiClient {
  readonly BASE_URL = 'https://youcanpay.com';

  constructor(private readonly isSandboxMode: boolean, private readonly httpClient: Axios) {}

  /**
   * Send a POST request
   *
   * @param endpoint Endpoint without the base url
   * e.g.: Pass /tokenize to POST https://youcanpay.com/api/tokenize
   *
   * @param payload Payload to send
   * @throws ApiHttpException If the response has a non-successful status code
   * @throws Error if there was a networking error
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

  /**
   * Send a GET request
   * @param endpoint Endpoint without the base url
   * e.g.: Pass /tokenize to GET https://youcanpay.com/api/tokenize
   * @param query Get parameters to add to the URL
   * @throws ApiHttpException If the response has a non-successful status code
   * @throws Error if there was a networking error
   */
  async get(endpoint: string, query: { [key: string]: string }): Promise<any> {
    try {
      const url = new URL(this.getUrl(endpoint));
      for (const queryKey of Object.keys(query)) {
        url.searchParams.set(queryKey, query[queryKey]);
      }
      const response = await this.httpClient.get(url.toString());
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

  private getUrl(endpoint: string): string {
    const sandboxPrefix = this.isSandboxMode ? 'sandbox/' : '';
    return `${this.BASE_URL}/${sandboxPrefix}api/${endpoint.replace(/^\//, '')}`;
  }
}
