import { Youcanpay } from '../src';
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
        success_url: 'somewhere',
        error_url: 'somewhere2',
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
        success_url: 'somewhere',
        error_url: 'somewhere2',
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

  describe('getTransaction', () => {
    it('should return correct data types', async () => {
      apiClient.get = jest.fn().mockReturnValue({
        id: 'some-uuid-here',
        status: 1,
        order_id: 'order-uuid-here',
        amount: '1337',
        currency: 'MAD',
        base_currency: null,
        base_amount: '1337',
        created_at: '2023-02-25T21:50:37.000000Z',
      });

      expect(await ycp.getTransaction('transaction-id')).toEqual({
        id: 'some-uuid-here',
        status: 1,
        order_id: 'order-uuid-here',
        amount: 1337,
        currency: 'MAD',
        base_currency: null,
        base_amount: 1337,
        created_at: new Date('2023-02-25T21:50:37.000000Z'),
      });
      expect(apiClient.get).toBeCalledWith('transactions/transaction-id', {
        pri_key: privKey,
      });
    });
  });

  describe('validateWebhookSignature', () => {
    const webhookPayload = {
      id: '73518e4a-2be7-46b1-87ad-8730c97ebf45',
      event_name: 'transaction.paid',
      sandbox: true,
      payload: {
        transaction: {
          id: 'e7a4a07e-9eb0-49e9-a109-26a824be9cae',
          status: 1,
          order_id: 'ca7b425b-8fb2-43dc-b444-0c5ce1eb2a52',
          amount: '5000',
          currency: 'MAD',
          base_currency: null,
          base_amount: null,
          created_at: '2023-03-12T18:57:11.000000Z',
        },
        payment_method: {
          id: 1,
          name: 'credit_card',
          card: {
            id: '18700233-27f0-459c-a77d-e0c5fbecb516',
            country_code: null,
            brand: null,
            last_digits: '4242',
            fingerprint: 'df276a45f62277bd43775616827f0718',
            is_3d_secure: false,
          },
        },
        token: { id: '520ce7d4-853f-45ab-b118-4c2eadab7bf1' },
        event: { name: 'transaction.paid' },
        customer: {
          id: 'fe36f275-ef6e-4fa2-b10f-d6caa09773db',
          email: null,
          name: null,
          address: null,
          phone: null,
          country_code: null,
          city: null,
          state: null,
          zip_code: null,
        },
        metadata: [],
      },
    };
    const webhookBody =
      '{"id":"73518e4a-2be7-46b1-87ad-8730c97ebf45","event_name":"transaction.paid","sandbox":true,"payload":{"transaction":{"id":"e7a4a07e-9eb0-49e9-a109-26a824be9cae","status":1,"order_id":"ca7b425b-8fb2-43dc-b444-0c5ce1eb2a52","amount":"5000","currency":"MAD","base_currency":null,"base_amount":null,"created_at":"2023-03-12T18:57:11.000000Z"},"payment_method":{"id":1,"name":"credit_card","card":{"id":"18700233-27f0-459c-a77d-e0c5fbecb516","country_code":null,"brand":null,"last_digits":"4242","fingerprint":"df276a45f62277bd43775616827f0718","is_3d_secure":false}},"token":{"id":"520ce7d4-853f-45ab-b118-4c2eadab7bf1"},"event":{"name":"transaction.paid"},"customer":{"id":"fe36f275-ef6e-4fa2-b10f-d6caa09773db","email":null,"name":null,"address":null,"phone":null,"country_code":null,"city":null,"state":null,"zip_code":null},"metadata":[]}}';

    it('should return true with valid signature and object payload', () => {
      expect(
        ycp.validateWebhookSignature(
          webhookPayload,
          'b75f83eed7bfab306e98a1ed1c18d4af380a0ab4ade077258e7f99913cbb87fd',
        ),
      ).toBeTruthy();
    });

    it('should return true with valid signature and string payload', () => {
      expect(
        ycp.validateWebhookSignature(webhookBody, 'b75f83eed7bfab306e98a1ed1c18d4af380a0ab4ade077258e7f99913cbb87fd'),
      ).toBeTruthy();
    });

    it('should return false with invalid signature and object payload', () => {
      expect(
        ycp.validateWebhookSignature(
          webhookPayload,
          '1a2fc26dc7ea5a2a4748b7cb2b1ef193d96ab2c99f93092f69e63075b28d1278',
        ),
      ).toBeFalsy();
    });

    it('should return false with invalid signature and string payload', () => {
      expect(
        ycp.validateWebhookSignature(webhookBody, '1a2fc26dc7ea5a2a4748b7cb2b1ef193d96ab2c99f93092f69e63075b28d1278'),
      ).toBeFalsy();
    });

    it('should return false with invalid length signature', () => {
      expect(ycp.validateWebhookSignature(webhookBody, 'short-signature')).toBeFalsy();
    });
  });

  describe('paymentUrlFromToken', () => {
    it('should return the correct payment url', () => {
      apiClient.paymentUrl = jest.fn().mockReturnValue('returned-url');
      expect(ycp.paymentUrlFromToken('token-here')).toEqual('returned-url');
      expect(apiClient.paymentUrl).toBeCalledWith('token-here');
    });
  });
});
