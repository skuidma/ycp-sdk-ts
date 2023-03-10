import { Youcanpay } from './youcanpay';
import { ApiClient } from './api-client';
import axios from 'axios';
import { YoucanpayConfig } from "../types";

export class YcpFactory {
  static ycp(config: YoucanpayConfig): Youcanpay {
    let isSandboxMode: boolean | undefined = config.isSandboxMode;
    if (isSandboxMode === undefined) {
      isSandboxMode = process.env.NODE_ENV !== 'production';
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
