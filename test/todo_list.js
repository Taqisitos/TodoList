const TodoList = artifacts.require("TodoList");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("TodoList", function (accounts) {
  let [alice, bob] = accounts;
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await TodoList.new();
  });
  it("should create task and update task count", async () => {
    await contractInstance.createTask("Task 0", {from: alice});
    const result = await contractInstance.taskCount();
    assert.equal(result.toNumber(), 1);
    const task = await contractInstance.tasks(0);
    assert.equal(task.content, "Task 0");
    assert.equal(task.completed, false);
    assert.equal(task.owner, alice);
  });
  it("should toggle task complete", async () => {
    await contractInstance.createTask("Task 0", {from: alice});
    await contractInstance.markComplete(0, {from: alice}); // mark task 0 complete
    const task = await contractInstance.tasks(0);
    assert.equal(task.completed, true);
  });
  it("should update individual user task counts", async () => {
    await contractInstance.createTask("Task 0", {from: alice});
    await contractInstance.createTask("Task 1", {from: bob});
    const aliceTaskCount = await contractInstance.userToTaskCount(alice, {from: alice});
    const bobTaskCount = await contractInstance.userToTaskCount(bob, {from: bob});
    assert.equal(aliceTaskCount.toNumber(), 1);
    assert.equal(bobTaskCount.toNumber(), 1);
  });
  it("should get all tasks that belong to a specific user", async () => {
    await contractInstance.createTask("Task 0", {from: alice});
    await contractInstance.createTask("Task 1", {from: bob});
    await contractInstance.createTask("Task 2", {from: alice});
    await contractInstance.createTask("Task 3", {from: bob});
    const aliceTasks = await contractInstance.getTasksByOwner({from: alice});
    const bobTasks = await contractInstance.getTasksByOwner({from: bob});
    let id = 0;
    for (let i = 0; i < 2; i++) {
      const aliceTask = aliceTasks[i];
      const bobTask = bobTasks[i];
      assert.equal(aliceTask.toNumber(), id);
      assert.equal(bobTask.toNumber(), id + 1);
      id += 2;
    }
  });
});
