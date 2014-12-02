### /invoices/:invoiceId/refunds/:requestId DElETE

***

### Overview

Cancel a refund request

***

### Parameters

None

***

### Cryptography

* /invoices/:invoiceId/refunds/:requestId GET requires cryptographic signing
* **NOTE** the token required is the support request token you get when the refund is requested (not the invoice token)
