import { Youcanpay } from '../src/lib/youcanpay';
import { ApiClient } from '../src/lib/api-client';

describe('Youcanpay', () => {
  const privKey = 'PRIVATE_KEY';
  let ycp: Youcanpay;
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = {} as unknown as ApiClient;
    ycp = new Youcanpay(privKey, apiClient);
  });
  describe('tokenizePayment', () => {
    it('should work with minimum required info', async () => {
      const data = {
        order_id: 'order-id-here',
        amount: 1000,
        currency: 'MAD',
        customer_ip: '127.0.0.1',
      };
      apiClient.post = jest.fn().mockReturnValue({ token: { id: 'token-id' } });
      apiClient.paymentUrl = jest.fn().mockReturnValue('payment-url');
      expect(await ycp.tokenizePayment(data)).toEqual({
        tokenId: 'token-id',
        paymentUrl: 'payment-url',
      });
      expect(apiClient.post).toBeCalledWith('tokenize', { ...data, pri_key: privKey });
    });

    it('should work with customer info and metadata', async () => {
      const data = {
        order_id: 'order-id-here',
        amount: 1000,
        currency: 'MAD',
        customer_ip: '127.0.0.1',
        customer: {
          name: 'John Doe',
          city: 'Fes',
          zip_code: '1337',
        },
        metadata: {
          product_name: 'Swing',
        },
      };
      apiClient.post = jest.fn().mockReturnValue({ token: { id: 'token-id' } });
      apiClient.paymentUrl = jest.fn().mockReturnValue('payment-url');
      expect(await ycp.tokenizePayment(data)).toEqual({
        tokenId: 'token-id',
        paymentUrl: 'payment-url',
      });
      expect(apiClient.post).toBeCalledWith('tokenize', { ...data, pri_key: privKey });
    });
  });
});
