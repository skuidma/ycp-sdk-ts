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

  /**
   * Details about the customer
   */
  customer?: CustomerInfo;

  /**
   * Any extra details to attach with the payment
   * This metadata will be included with the payment webhook
   */
  metadata?: { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * URL where to redirect to when payment is successful
   */
  success_url: string;

  /**
   * URL where to redirect to when payment is not successful
   */
  error_url: string;
}

/**
 * Token used to process a payment
 */
export interface PaymentToken {
  /**
   * Token ID to be used when rendering the payment form
   */
  tokenId: string;

  /**
   * A URL for a standalone payment form on the YouCan Pay website
   */
  paymentUrl: string;
}

/**
 * Transaction returned via the API's transactions endpoint
 */
export interface Transaction {
  /**
   * Transaction UUID
   */
  id: string;

  /**
   * Transaction status
   * TODO: make the possible values clearer and use an Enum instead
   */
  status: number;

  /**
   * The order id you sent along the payment tokenization step
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

  base_currency: string | null;

  base_amount: number | null;

  created_at: Date;
}
