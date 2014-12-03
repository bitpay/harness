### /bills/:billId POST

***

### Overview

Update a BitPay bill

***

### Parameters

**:billId** - The billId can be found on the response when creating bills or in the URL when viewing a bill on bitpay.com

**items** - An array of objects with a description, price, and quantity.

```
[{"price":10,"quantity":1,"description":"Test"}]
```

**currency** - The currency that the item price is expressed in

**email** - The email address of the bill recipient

**status** - Changing the status to "ready" will initiate the process of sending the bill to the recipient


*Note: The updated status will not be reflected in the immediate response.  It will update after the bill has actually been sent.*


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
