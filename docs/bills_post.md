### /bills POST

***

### Overview

Create a BitPay bill

***

### Parameters
**items** - An array of objects with a description, price, and quantity.

```
[{"price":10,"quantity":1,"description":"Test"}]
```

**currency** - The currency that the item price is expressed in

**email** - The email address of the bill recipient

***

#### Additional Parameters (not pictured on the request builder)

**name** - The name of the bill recipient

**showRate** - Boolean/string, whether to show an exchange rate or not

**address1** - The first line of the bill recipient's address

**address2** - The second line of the bill recipient's address

**city** - The city or locality of the bill recipient's address

**state** - The state or region of the bill recipient's address

**zip** - The zip or postal code of the bill recipient's address

**country** - The country code of the bill recipient's address

**phone** - The phone number of the bill recipient

***

### Cryptography

* /bills POST requires cryptographic signing
* a Merchant token linked to your key pair and account is required
