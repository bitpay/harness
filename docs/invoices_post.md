### /invoices POST

***

### Overview

Create a BitPay invoice

***

### Parameters
**price** - The numeric price for the invoice

**currency** - The currency that the price is expressed in

**orderId** - An optional order id to associate the invoice with an order in your system

**itemDesc** - A description of the item being invoiced

**itemCode** - A code that corresponds to the item being invoiced

***

#### Additional Parameters (not pictured on the request builder)

**notificationEmail** - E-mail to notify with status updates about this invoice (may be different than the account-wide e-mail)

**notificationURL** - URL to post IPN updates about this invoice to (may be different than the account-wide notification URL)

**redirectURL** - URL to link customer to following payment

**posData** - ???

**transactionSpeed** - Setting for how many confirmations are required to accept the invoice as paid (high, medium, low)

**fullNotifications** - ???

**physical** - ???

**buyer** - ALL THE FIELDS

***

### Cryptography

* /invoices POST generally requires cryptographic signing as well as a Merchant or POS token linked to your key pair
* It is possible to create a POS token that does not require signing on the API Tokens page
