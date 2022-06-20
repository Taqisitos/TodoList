// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
  uint public taskCount = 0;

    struct Task {
        uint id;
        address owner;
        string content;
        bool completed;
    }

    Task[] public tasks;
    mapping (address => uint256) userToTaskCount;

    // creates new task specific to user making the transaction
    function createTask(string memory _content) public {
        require(bytes(_content).length <= 140); // set char limit to 140
        tasks.push(Task(taskCount, msg.sender, _content, false));
        taskCount++;
        userToTaskCount[msg.sender]++;
    }

    // marks corresponding task as complete
    function markComplete(uint id) public {
        require(tasks[id].owner == msg.sender);
        tasks[id].completed = true;
    }

    // gives user making the transaction an array of all task ids they own
    function getTasksByOwner() external view returns (uint[] memory) {
        uint counter = 0;
        uint[] memory result = new uint[](userToTaskCount[msg.sender]);
        for (uint id = 0; id < tasks.length; id++) {
            if (tasks[id].owner == msg.sender) {
                result[counter] = id;
                counter++;
            }
        }
        return result;
    }
}
