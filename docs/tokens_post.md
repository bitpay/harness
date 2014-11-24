### /tokens POST

***

### Overview

To request a token to pair with your account.

To claim a token for use on a POS system.

***

### Parameters
**id** - The identity string of the key to register (aka SIN)

**facade** - The level of authorization that you want to give to the token being created

**pairingCode** - A code issued at bitpay.com for pairing a POS system with your account

> pairingCode and facade are mutually exclusive and are not used together.

***

### Cryptography

* /tokens POST never requires a cryptographic signature
* It is typically executed during initial setup of an integration or POS device
