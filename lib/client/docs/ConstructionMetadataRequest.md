# Rosetta.ConstructionMetadataRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**networkIdentifier** | [**NetworkIdentifier**](NetworkIdentifier.md) |  | 
**options** | [**Object**](.md) | Some blockchains require different metadata for different types of transaction construction (ex: delegation versus a transfer). Instead of requiring a blockchain node to return all possible types of metadata for construction (which may require multiple node fetches), the client can populate an options object to limit the metadata returned to only the subset required. | 


