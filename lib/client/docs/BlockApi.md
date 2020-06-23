# Rosetta.BlockApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**block**](BlockApi.md#block) | **POST** /block | Get a Block
[**blockTransaction**](BlockApi.md#blockTransaction) | **POST** /block/transaction | Get a Block Transaction



## block

> BlockResponse block(blockRequest)

Get a Block

Get a block by its Block Identifier. If transactions are returned in the same call to the node as fetching the block, the response should include these transactions in the Block object. If not, an array of Transaction Identifiers should be returned so /block/transaction fetches can be done to get all transaction information.

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.BlockApi();
let blockRequest = new Rosetta.BlockRequest(); // BlockRequest | 
apiInstance.block(blockRequest, (error, data, response) => {
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
 **blockRequest** | [**BlockRequest**](BlockRequest.md)|  | 

### Return type

[**BlockResponse**](BlockResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## blockTransaction

> BlockTransactionResponse blockTransaction(blockTransactionRequest)

Get a Block Transaction

Get a transaction in a block by its Transaction Identifier. This endpoint should only be used when querying a node for a block does not return all transactions contained within it.  All transactions returned by this endpoint must be appended to any transactions returned by the /block method by consumers of this data. Fetching a transaction by hash is considered an Explorer Method (which is classified under the Future Work section).  Calling this endpoint requires reference to a BlockIdentifier because transaction parsing can change depending on which block contains the transaction. For example, in Bitcoin it is necessary to know which block contains a transaction to determine the destination of fee payments. Without specifying a block identifier, the node would have to infer which block to use (which could change during a re-org).  Implementations that require fetching previous transactions to populate the response (ex: Previous UTXOs in Bitcoin) may find it useful to run a cache within the Rosetta server in the /data directory (on a path that does not conflict with the node).

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.BlockApi();
let blockTransactionRequest = new Rosetta.BlockTransactionRequest(); // BlockTransactionRequest | 
apiInstance.blockTransaction(blockTransactionRequest, (error, data, response) => {
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
 **blockTransactionRequest** | [**BlockTransactionRequest**](BlockTransactionRequest.md)|  | 

### Return type

[**BlockTransactionResponse**](BlockTransactionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

