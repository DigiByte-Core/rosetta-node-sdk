# Rosetta.ConstructionApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**constructionMetadata**](ConstructionApi.md#constructionMetadata) | **POST** /construction/metadata | Get Transaction Construction Metadata
[**constructionSubmit**](ConstructionApi.md#constructionSubmit) | **POST** /construction/submit | Submit a Signed Transaction



## constructionMetadata

> ConstructionMetadataResponse constructionMetadata(constructionMetadataRequest)

Get Transaction Construction Metadata

Get any information required to construct a transaction for a specific network. Metadata returned here could be a recent hash to use, an account sequence number, or even arbitrary chain state. It is up to the client to correctly populate the options object with any network-specific details to ensure the correct metadata is retrieved.  It is important to clarify that this endpoint should not pre-construct any transactions for the client (this should happen in the SDK). This endpoint is left purposely unstructured because of the wide scope of metadata that could be required.  In a future version of the spec, we plan to pass an array of Rosetta Operations to specify which metadata should be received and to create a transaction in an accompanying SDK. This will help to insulate the client from chain-specific details that are currently required here.

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.ConstructionApi();
let constructionMetadataRequest = new Rosetta.ConstructionMetadataRequest(); // ConstructionMetadataRequest | 
apiInstance.constructionMetadata(constructionMetadataRequest, (error, data, response) => {
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
 **constructionMetadataRequest** | [**ConstructionMetadataRequest**](ConstructionMetadataRequest.md)|  | 

### Return type

[**ConstructionMetadataResponse**](ConstructionMetadataResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## constructionSubmit

> ConstructionSubmitResponse constructionSubmit(constructionSubmitRequest)

Submit a Signed Transaction

Submit a pre-signed transaction to the node. This call should not block on the transaction being included in a block. Rather, it should return immediately with an indication of whether or not the transaction was included in the mempool.  The transaction submission response should only return a 200 status if the submitted transaction could be included in the mempool. Otherwise, it should return an error.

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.ConstructionApi();
let constructionSubmitRequest = new Rosetta.ConstructionSubmitRequest(); // ConstructionSubmitRequest | 
apiInstance.constructionSubmit(constructionSubmitRequest, (error, data, response) => {
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
 **constructionSubmitRequest** | [**ConstructionSubmitRequest**](ConstructionSubmitRequest.md)|  | 

### Return type

[**ConstructionSubmitResponse**](ConstructionSubmitResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

