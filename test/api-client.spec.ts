import { ApiClient } from '../src/lib/api-client';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import { ApiHttpException } from '../src/exceptions/api-http.exception';

describe('ApiClient', () => {
  let sandboxClient: ApiClient;
  let prodClient: ApiClient;
  let httpClient: Axios;

  beforeEach(() => {
    httpClient = {} as unknown as Axios;
    sandboxClient = new ApiClient(true, httpClient);
    prodClient = new ApiClient(false, httpClient);
  });

  describe('paymentUrl', () => {
    it('should return correct url with sandbox mode on', () => {
      expect(sandboxClient.paymentUrl('payment-token-here')).toEqual(
        'https://youcanpay.com/sandbox/payment-form/payment-token-here',
      );
    });

    it('should return correct url with sandbox mode off', () => {
      expect(prodClient.paymentUrl('payment-token-here')).toEqual(
        'https://youcanpay.com/payment-form/payment-token-here',
      );
    });
  });

  describe('post', () => {
    it('should post to correct url with sandbox mode on', async () => {
      httpClient.post = jest.fn().mockReturnValue({
        data: {
          key: 'value',
        },
      });
      await sandboxClient.post('endpoint-here', {
        data: 'value',
      });
      expect(httpClient.post).toBeCalledWith('https://youcanpay.com/sandbox/api/endpoint-here', {
        data: 'value',
      });
    });

    it('should post to correct url with sandbox mode off', async () => {
      httpClient.post = jest.fn().mockReturnValue({
        data: {
          key: 'value',
        },
      });
      await prodClient.post('endpoint-here', {
        data: 'value',
      });
      expect(httpClient.post).toBeCalledWith('https://youcanpay.com/api/endpoint-here', {
        data: 'value',
      });
    });

    it('should return correct response data', async () => {
      const resp = {
        data: {
          key: 'value',
        },
      };
      httpClient.post = jest.fn().mockReturnValue(resp);
      expect(await sandboxClient.post('end', {})).toEqual(resp.data);
    });

    it('should throw correct exception when networking problem', () => {
      httpClient.post = jest.fn().mockImplementation(() => {
        const error = new AxiosError();
        error.cause = new Error('Thrown cause');
        throw error;
      });
      expect(async () => await sandboxClient.post('test', {})).rejects.toThrow('Thrown cause');
    });

    it('should throw correct exception when http problem', () => {
      httpClient.post = jest.fn().mockImplementation(() => {
        const error = new AxiosError();
        error.response = {
          status: 500,
          data: { error: 'Oops' },
        } as unknown as AxiosResponse;
        throw error;
      });
      expect(async () => await sandboxClient.post('test', {})).rejects.toThrow(
        new ApiHttpException(500, { error: 'Oops' }),
      );
    });
  });

  describe('get', () => {
    it('should get correct url with sandbox mode on', async () => {
      httpClient.get = jest.fn().mockReturnValue({
        data: {
          key: 'value',
        },
      });
      await sandboxClient.get('endpoint-here', {
        data: 'value',
      });
      expect(httpClient.get).toBeCalledWith('https://youcanpay.com/sandbox/api/endpoint-here?data=value');
    });

    it('should get correct url with sandbox mode off', async () => {
      httpClient.get = jest.fn().mockReturnValue({
        data: {
          key: 'value',
        },
      });
      await prodClient.get('endpoint-here', {
        data: 'value',
      });
      expect(httpClient.get).toBeCalledWith('https://youcanpay.com/api/endpoint-here?data=value');
    });

    it('should encode query parameters', async () => {
      httpClient.get = jest.fn().mockReturnValue({
        data: {
          key: 'value',
        },
      });
      await prodClient.get('endpoint-here', {
        query: '?=value%',
        test: '?yes',
      });
      expect(httpClient.get).toBeCalledWith('https://youcanpay.com/api/endpoint-here?query=%3F%3Dvalue%25&test=%3Fyes');
    });

    it('should return correct response data', async () => {
      const resp = {
        data: {
          key: 'value',
        },
      };
      httpClient.get = jest.fn().mockReturnValue(resp);
      expect(await sandboxClient.get('end', {})).toEqual(resp.data);
    });

    it('should throw correct exception when networking problem', () => {
      httpClient.get = jest.fn().mockImplementation(() => {
        const error = new AxiosError();
        error.cause = new Error('Thrown cause');
        throw error;
      });
      expect(async () => await sandboxClient.get('test', {})).rejects.toThrow('Thrown cause');
    });

    it('should throw correct exception when http problem', () => {
      httpClient.get = jest.fn().mockImplementation(() => {
        const error = new AxiosError();
        error.response = {
          status: 500,
          data: { error: 'Oops' },
        } as unknown as AxiosResponse;
        throw error;
      });
      expect(async () => await sandboxClient.get('test', {})).rejects.toThrow(
        new ApiHttpException(500, { error: 'Oops' }),
      );
    });
  });
});
