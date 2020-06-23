# Rosetta.MempoolApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**mempool**](MempoolApi.md#mempool) | **POST** /mempool | Get All Mempool Transactions
[**mempoolTransaction**](MempoolApi.md#mempoolTransaction) | **POST** /mempool/transaction | Get a Mempool Transaction



## mempool

> MempoolResponse mempool(mempoolRequest)

Get All Mempool Transactions

Get all Transaction Identifiers in the mempool

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.MempoolApi();
let mempoolRequest = new Rosetta.MempoolRequest(); // MempoolRequest | 
apiInstance.mempool(mempoolRequest, (error, data, response) => {
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
 **mempoolRequest** | [**MempoolRequest**](MempoolRequest.md)|  | 

### Return type

[**MempoolResponse**](MempoolResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## mempoolTransaction

> MempoolTransactionResponse mempoolTransaction(mempoolTransactionRequest)

Get a Mempool Transaction

Get a transaction in the mempool by its Transaction Identifier. This is a separate request than fetching a block transaction (/block/transaction) because some blockchain nodes need to know that a transaction query is for something in the mempool instead of a transaction in a block.  Transactions may not be fully parsable until they are in a block (ex: may not be possible to determine the fee to pay before a transaction is executed). On this endpoint, it is ok that returned transactions are only estimates of what may actually be included in a block.

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.MempoolApi();
let mempoolTransactionRequest = new Rosetta.MempoolTransactionRequest(); // MempoolTransactionRequest | 
apiInstance.mempoolTransaction(mempoolTransactionRequest, (error, data, response) => {
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
 **mempoolTransactionRequest** | [**MempoolTransactionRequest**](MempoolTransactionRequest.md)|  | 

### Return type

[**MempoolTransactionResponse**](MempoolTransactionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

