const TodoList = artifacts.require("TodoList");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("TodoList", function (accounts) {
  let alice = accounts[0];
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await TodoList.new();
  });
  it("should update task count correctly", async function () {
    await contractInstance.createTask("Task 1", {from: alice});
    const result = await contractInstance.taskCount();
    assert.equal(result.toNumber(), 1);
  });
  it("should toggle task complete correctly", async () => {
    await contractInstance.markComplete(0, {from: alice}); // mark task 0 complete
    const task = await contractInstance.tasks[0];
    assert.equal(task.completed, true);
  });
});
