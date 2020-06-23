# Rosetta.OperationIdentifier

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**index** | **Number** | The operation index is used to ensure each operation has a unique identifier within a transaction.  To clarify, there may not be any notion of an operation index in the blockchain being described. | 
**networkIndex** | **Number** | Some blockchains specify an operation index that is essential for client use. For example, Bitcoin uses a network_index to identify which UTXO was used in a transaction.  network_index should not be populated if there is no notion of an operation index in a blockchain (typically most account-based blockchains). | [optional] 


