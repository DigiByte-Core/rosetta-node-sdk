# Rosetta.SubAccountIdentifier

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **String** | The SubAccount address may be a cryptographic value or some other identifier (ex: bonded) that uniquely specifies a SubAccount. | 
**metadata** | [**Object**](.md) | If the SubAccount address is not sufficient to uniquely specify a SubAccount, any other identifying information can be stored here.  It is important to note that two SubAccounts with identical addresses but differing metadata will not be considered equal by clients. | [optional] 


