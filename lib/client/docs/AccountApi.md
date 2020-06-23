# Rosetta.AccountApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**accountBalance**](AccountApi.md#accountBalance) | **POST** /account/balance | Get an Account Balance



## accountBalance

> AccountBalanceResponse accountBalance(accountBalanceRequest)

Get an Account Balance

Get an array of all Account Balances for an Account Identifier and the Block Identifier at which the balance lookup was performed.  Some consumers of account balance data need to know at which block the balance was calculated to reconcile account balance changes.  To get all balances associated with an account, it may be necessary to perform multiple balance requests with unique Account Identifiers.  If the client supports it, passing nil AccountIdentifier metadata to the request should fetch all balances (if applicable).  It is also possible to perform a historical balance lookup (if the server supports it) by passing in an optional BlockIdentifier.

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.AccountApi();
let accountBalanceRequest = new Rosetta.AccountBalanceRequest(); // AccountBalanceRequest | 
apiInstance.accountBalance(accountBalanceRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountBalanceRequest** | [**AccountBalanceRequest**](AccountBalanceRequest.md)|  | 

### Return type

[**AccountBalanceResponse**](AccountBalanceResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

