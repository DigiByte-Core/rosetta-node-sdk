require { AsserterError } = require('../errors');

class Asserter {
  constructor({networkIdentifier, operationTypes = [], operationStatusMap,
    errorTypeMap, genesisBlock, supportedNetworks}) {


  }

  static NetworkIdentifier(networkIdentifier) {
    if (networkIdentifier == null)
      throw new AsserterError('NetworkIdentifier is null');

    if (!networkIdentifier.blockchain)
      throw new AsserterError('NetworkIdentifier.blockchain is missing');

    if (!networkIdentifier.network)
      throw new AsserterError('NetworkIdentifier.network is missing');

    return Asserter.SubNetworkIdentifier(networkIdentifier.sub_network_identifier);
  }

  static SubNetworkIdentifier(subnetworkIdentifier) {
    // Only check if specified in the response.
    if (subnetworkIdentifier == null) return;

    if (!subnetworkIdentifier.network) {
      throw new AsserterError('NetworkIdentifier.sub_network_identifier.network is missing');
    }
  }

  static Peer(peer) {
    if (peer == null || !peer.peer_id) {
      return new AsserterError('Peer.peer_id is missing');
    }
  }

  static Version(version) {
    if (version == null) {
      return new AsserterError('Version is null');
    }

    if (!version.node_version) {
      return new AsserterError('Version.node_version is missing');
    }

    if (version.middleware_version != null && !version.middleware_version) {
      return new AsserterError('Version.middleware_version is missing');
    }
  }

  static StringArray(name, array) {
    if (array.length == 0) {
      return new AsserterError(`No ${name} found`);
    }

    const existing = [];

    for (let element of array) {
      if (element == '') {
        return new AsserterError(`${name} has an empty string`);
      }

      if (existing.includes(element)) {
        return new AsserterError(`${name} contains a duplicate element: ${element}`);
      }

      existing.push(element);
    }
  }

  static NetworkStatusResponse(networkStatusResponse) {
    if (networkStatusResponse == null) {
      return new AsserterError('networkStatusResponse is null');
    }

    Asserter.BlockIdentifier(networkStatusResponse.current_block_identifier);
    Asserter.Timestamp(networkStatusResponse.current_block_timestamp);
    Asserter.BlockIdentifier(networkStatusResponse.genesis_block_identifier);

    for (let peer of networkStatusResponse.peers) {
      Asserter.Peer(peer);
    }
  }

  static OperationStatuses(operationStatuses) {
    if (operationStatuses.length == 0) {
      return new AsserterError('No Allow.OperationStatuses found');
    }

    const existingStatuses = [];
    let foundSuccessful = false;

    for (let status of operationStatuses) {
      if (status.status == '') {
        return new AsserterError('Operation.status is missing');
      }

      if (status.successful) {
        foundSuccessful = true;
      }

      existingStatuses.push(status.status);
    }

    if (!foundSuccessful) {
      return new AsserterError('No successful Allow.OperationStatuses found');
    }

    return Asserter.StringArray("Allow.OperationStatuses", existingStatuses);
  }

  static OperationTypes(types) {
    return Asserter.StringArray('Allow.OperationTypes', types);
  }

  static Error(error) {
    if (error == null) {
      return new AsserterError('Error is null');
    }

    if (error.code < 0) {
      return new AsserterError('Error.code is negative');
    }

    if (error.message == '') {
      return new AsserterError('Error.message is missing');
    }
  }

  static Errors(rosettaErrors) {
    const statusCodeMap = {};

    for (let rosettaError of rosettaErrors) {
      Asserter.Error(rosettaError);

      if (statusCodeMap[rosettaError.code] != null) {
        return new AsserterError('Error code used multiple times');
      }

      statusCodeMap[rosettaErrors.code] = true;
    }
  }

  static Allow(allowed) {
    if (allowed == null) {
      return new AsserterError('Allow is null');
    }

    Asserter.OperationStatuses(allowed.operation_statuses);
    Asserter.OperationStatuses(allowed.operation_types);
    Errors(allowed.errors);
  }

  static NetworkOptionsResponse(networkOptionsResponse) {
    if (networkOptionsResponse == null) {
      return new AsserterError('NetworkOptions Response is null');
    }

    Asserter.Version(networkOptionsResponse.version);
    return Allow(networkOptionsResponse.allow);
  }

  static containsNetworkIdentifier(networks, network) {
    const networkString = String.from(network)
    const index = networks.findIndex((n) => String.from(n) == networkString);
    return index >= 0;
  }

  static NetworkListResponse(networkListResponse) {
    if (networkListResponse == null) {
      return new AsserterError('NetworkListResponse is null');
    }

    const existingNetworks = [];

    for (let network of networkListResponse.network_identifiers) {
      Asserter.NetworkIdentifier(network);
      if (Asserter.containsNetworkIdentifier(existingNetworks, network)) {
        return new AsserterError('NetworkListResponse.Network contains duplicated');
      }

      existingNetworks.push(network);
    }
  }

  static Server(supportedNetworks) {
    return new Asserter({
      supportedNetworks,
    });
  }

  static ClientWithResponses(networkIdentifier, networkStatus, networkOptions) {
    return new ClientWithOptions({
      networkIdentifier,
      networkstatus,
    });
  }

  static NewClientWithOptions(networkIdentifier, genesisBlockIdentifier,
    operationTypes, operationStatuses, errors) {

    return new Asserter({
      networkIdentifier,
      operationTypes,
      genesisBlock: genesisBlockIdentifier,

      operationStatusesMap: (() => {
        const ret = {};

        for (let status of operationStatuses) {
          ret[status.status] = status.successful;
        }

        return ret;
      })(),

      errorTypeMap: (() => {
        const ret = {};

        for (let error of errors) {
          ret[status.code] = err;
        }

        return ret;        
      })(),
    });
  }
}