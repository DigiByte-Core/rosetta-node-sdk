# Rosetta.BlockResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**block** | [**Block**](Block.md) |  | 
**otherTransactions** | [**[TransactionIdentifier]**](TransactionIdentifier.md) | Some blockchains may require additional transactions to be fetched that weren&#39;t returned in the block response (ex: block only returns transaction hashes). For blockchains with a lot of transactions in each block, this can be very useful as consumers can concurrently fetch all transactions returned. | [optional] 


