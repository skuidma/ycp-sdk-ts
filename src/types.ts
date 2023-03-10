interface YoucanpayConfig {
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

interface CustomerInfo {
    name?: string;
    address?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    countryCode?: string;
    phone?: string;
    email?: string;
}

interface TokenizePayment {
    /**
     * The order ID corresponding to the transaction, used to track which order the transaction is for on your store.
     */
    orderId: string;

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

    customerIp: string;

    customerInfo?: CustomerInfo;

    metadata?: { [key: string]: any; };
}