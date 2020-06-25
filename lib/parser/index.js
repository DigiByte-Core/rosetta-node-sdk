function Parser(asserter, exemptOperation) {
  return {
    asserter,
    excemptFunc: exemptOperation,
  };
}

module.exports = Parser;