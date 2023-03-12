# YouCan Pay SDK for NodeJS
[![Tests](https://github.com/skuidma/ycp-sdk-ts/actions/workflows/node.js.yml/badge.svg)](https://github.com/skuidma/ycp-sdk-ts/actions/workflows/node.js.yml)
![npm](https://img.shields.io/npm/dw/ycp-sdk-ts)
![GitHub package.json version](https://img.shields.io/github/package-json/v/skuidma/ycp-sdk-ts)


Unofficial SDK to use the YouCan Pay service

## Installation
```shell
# Using npm
npm i ycp-sdk-ts
# Using yarn
yarn add ycp-sdk-ts
```

## Usage

### Creating a payment token

To ask a customer for a payment, you first need to generate a Payment token.
You can achieve that by calling the `tokenizePayment` method.

Example code:

```ts
import { YcpFactory } from 'ycp-sdk-ts';

// Create a Youcanpay instance using the factory
const ycp = YcpFactory.ycp({
  // Your API's private key, you can get it from Dashboard > Settings > API Keys
  privateKey: '',
  // True to enable Sandbox mode
  isSandboxMode: true,
});

const token = await ycp.tokenizePayment({
  order_id: '',
  amount: 1337,
  currency: 'MAD',
  customer_ip: '13.37.4.2',
  // URL where to redirect to when payment is successful
  sucess_url: '',
  // URL where to redirect to when payment is not successful
  error_url: '',
  // Information about the customer
  customer: {
    name: 'Hmida Bar9al',
    address: 'Hay takadom',
    zip_code: '21',
    city: 'Fes',
    state: 'Chaouia-ourdigha',
    country_code: 'MA',
    phone: '06',
    email: 'hmida.bar9al@gmail.com',
  },
  // Metadata that will be returned via the webhook
  metadata: {
    anything: 'some value',
  },
});

console.log(token)
```
The result will be:

```json
{
  "tokenId": "payment-token-to-be-used",
  "paymentUrl": "https://youcanpay.com/payment-form/token-id"
}
```

You can use `tokenId` to [display the payment form](https://youcanpay.com/docs#form_display)
or use the `paymentUrl` to take the user directly to the payment page.

### Webhook signature validation

When receiving a webhook, a very necessary step (unfortunately, it is not mentioned in the official documentation) is to validate the webhook's signature to ensure that it is coming from YouCan Pay and not a bad actor.

The signature is sent in a header along with the request, the header's name is `X-Youcanpay-Signature`

Example code:

```ts
import { YcpFactory } from 'ycp-sdk-ts';

// Create a Youcanpay instance using the factory
const ycp = YcpFactory.ycp({
  // Your API's private key, you can get it from Dashboard > Settings > API Keys
  privateKey: '',
  // True to enable Sandbox mode
  isSandboxMode: true,
});

// The signature in the X-Youcanpay-Signature header
const expectedSignature = '';

// The webhook's request body, accepts both a parsed or a string JSON
const body = '';

const isValid = ycp.validateWebhookSignature(body, expectedSignature);

console.log(isValid);
```

The result will be either `true` or `false`