/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get an Account Balance
* Get an array of all Account Balances for an Account Identifier and the Block Identifier at which the balance lookup was performed.  Some consumers of account balance data need to know at which block the balance was calculated to reconcile account balance changes.  To get all balances associated with an account, it may be necessary to perform multiple balance requests with unique Account Identifiers.  If the client supports it, passing nil AccountIdentifier metadata to the request should fetch all balances (if applicable).  It is also possible to perform a historical balance lookup (if the server supports it) by passing in an optional BlockIdentifier.
*
* accountBalanceRequest AccountBalanceRequest 
* returns AccountBalanceResponse
* */
const accountBalance = ({ accountBalanceRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        accountBalanceRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  accountBalance,
};
