export interface YoucanpayConfig {
  /**
   * Your merchant's private key, can be found in your account's settings
   */
  privateKey: string;

  /**
   * Set to true to enable sandbox mode.
   * Default value is to base it on the NODE_ENV value, false when NODE_ENV === 'production'
   */
  isSandboxMode?: boolean;
}

export interface CustomerInfo {
  name?: string;
  address?: string;
  zip_code?: string;
  city?: string;
  state?: string;
  country_code?: string;
  phone?: string;
  email?: string;
}

export interface TokenizePaymentRequest {
  /**
   * The order ID corresponding to the transaction, used to track which order the transaction is for on your store.
   */
  order_id: string;

  /**
   * Integer representing the payment amount in minor units
   * e.g. for 10 MAD the amount will be 1000
   */
  amount: number;

  /**
   * ISO-4217 currency code.
   * e.g. MAD
   */
  currency: string;

  customer_ip: string;

  customer?: CustomerInfo;

  metadata?: { [key: string]: any };
}

export interface PaymentToken {
  tokenId: string;

  paymentUrl: string;
}
