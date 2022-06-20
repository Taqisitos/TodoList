const TodoList = artifacts.require("TodoList");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("TodoList", function (/* accounts */) {
  it("should assert true", async function () {
    await TodoList.deployed();
    return assert.isTrue(true);
  });
});
