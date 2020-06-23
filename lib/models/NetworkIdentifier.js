// NetworkIdentifier.js

export default class NetworkIdentifier {
  constructor() {
    this.blockchain = '';
    this.network = '';
    this.sub_network_identifier = {
      'network': '',
      'metadata': {
        'producer': '',
      },
    }; // Optional
  }
}