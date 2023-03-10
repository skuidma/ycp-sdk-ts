import { Youcanpay } from './youcanpay';
import { ApiClient } from './api-client';
import axios from 'axios';
import { YoucanpayConfig } from '../types';

export class YcpFactory {
  static ycp(config: YoucanpayConfig): Youcanpay {
    let isSandboxMode: boolean | undefined = config.isSandboxMode;
    if (isSandboxMode === undefined) {
      isSandboxMode = process.env.NODE_ENV !== 'production';
    }

    // Double check if the sandbox is set correctly
    if (isSandboxMode) {
      // Sandbox mode is on in production
      if (process.env.NODE_ENV === 'production') {
        // tslint:disable-next-line:no-console
        console.warn('ycp-sdk-ts: Sandbox mode is on but you seem like you are in production');
      }
    }

    if (!isSandboxMode) {
      if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line:no-console
        console.warn("ycp-sdk-ts: Sandbox mode is off but it doesn't look like a production");
      }
    }

    const httpClient = axios.create({
      headers: {
        'User-Agent': 'skuid-ycp-sdk-ts',
      },
    });

    const client = new ApiClient(isSandboxMode, httpClient);
    return new Youcanpay(config.privateKey, client);
  }
}
