### /invoices GET

***

### Overview

Query for invoices on an account

***

### Parameters

**status** - invoice status

**orderId** - the optional order id specified at time of invoice creation

**itemCode** - the optional item code specified at the time of invoice creation

**dateStart** - the start of the date window to query for invoices

**dateEnd** - the end of the date window to query for invoices

**limit** - maximum results that the query will return (useful for paging results)

**offset** - number of results to offset (ex. skip 10 will give you results starting with the 11th result)
***

### Cryptography

* /invoices GET requires cryptographic signing
* a Merchant token linked to your key pair and account is required
