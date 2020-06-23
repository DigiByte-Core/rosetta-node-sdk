# Rosetta.NetworkApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**networkList**](NetworkApi.md#networkList) | **POST** /network/list | Get List of Available Networks
[**networkOptions**](NetworkApi.md#networkOptions) | **POST** /network/options | Get Network Options
[**networkStatus**](NetworkApi.md#networkStatus) | **POST** /network/status | Get Network Status



## networkList

> NetworkListResponse networkList(metadataRequest)

Get List of Available Networks

This endpoint returns a list of NetworkIdentifiers that the Rosetta server can handle.

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.NetworkApi();
let metadataRequest = new Rosetta.MetadataRequest(); // MetadataRequest | 
apiInstance.networkList(metadataRequest, (error, data, response) => {
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
 **metadataRequest** | [**MetadataRequest**](MetadataRequest.md)|  | 

### Return type

[**NetworkListResponse**](NetworkListResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## networkOptions

> NetworkOptionsResponse networkOptions(networkRequest)

Get Network Options

This endpoint returns the version information and allowed network-specific types for a NetworkIdentifier. Any NetworkIdentifier returned by /network/list should be accessible here.  Because options are retrievable in the context of a NetworkIdentifier, it is possible to define unique options for each network.

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.NetworkApi();
let networkRequest = new Rosetta.NetworkRequest(); // NetworkRequest | 
apiInstance.networkOptions(networkRequest, (error, data, response) => {
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
 **networkRequest** | [**NetworkRequest**](NetworkRequest.md)|  | 

### Return type

[**NetworkOptionsResponse**](NetworkOptionsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## networkStatus

> NetworkStatusResponse networkStatus(networkRequest)

Get Network Status

This endpoint returns the current status of the network requested. Any NetworkIdentifier returned by /network/list should be accessible here.

### Example

```javascript
import Rosetta from 'rosetta';

let apiInstance = new Rosetta.NetworkApi();
let networkRequest = new Rosetta.NetworkRequest(); // NetworkRequest | 
apiInstance.networkStatus(networkRequest, (error, data, response) => {
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
 **networkRequest** | [**NetworkRequest**](NetworkRequest.md)|  | 

### Return type

[**NetworkStatusResponse**](NetworkStatusResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

