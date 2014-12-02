### /invoices/:invoiceId/refunds POST

***

### Overview

Create a refund request for a BitPay invoice

***

### Parameters
**bitcoinAddress** - The destination bitcoin address to send the refund

**amount** - The amount of the refund

**currency** - The currency in which to price the refund

***

### Notes

If an invoice was paid using payment protocol, the customer already supplied a refund address as part of the payment process.  If an
invoice has the 'refundable' flag set to true, then the 'bitcoinAddress' parameters is optional.

If an invoice is fully paid, the amount and currency parameters are required.

***

### Cryptography

* /invoices/:invoiceId/refunds POST requires cryptographic signing
* the token comes from the response when creating invoices OR from an /invoices GET request
