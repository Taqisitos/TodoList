import abi from "../build/contracts/TodoList.json" assert { type: "json" };

var todoList; // will be the contract object
var userAccount; // current active user
var accounts; // all accounts

// gets called when user clicks "Connect Wallet"
async function connectWallet() {
  accounts = await window.ethereum.request({method: "eth_requestAccounts"}).catch((err) => {
     // error handle
     console.log(err.code);
   });
   
   userAccount = accounts[0];
   console.log(userAccount);
   document.getElementById("connect-btn").innerHTML = accounts;
   getTasksByOwner()
      .then(displayTasks);
}
window.connectWallet = connectWallet; // js module thing, set connect wallet to be global

async function startApp() {
  console.log("starting dApp");
  const todoListContractAddress = "0xa277b064B6c7aE9Bc60f0AcCEc0743a0dA05CeA4";
  const contractABI = abi.abi;
  todoList = new web3.eth.Contract(contractABI, todoListContractAddress);

  // monitor which user is currently active
  var accountInterval = setInterval(async function() {
    // Check if account has changed
    
    accounts = await window.ethereum.request({method: "eth_requestAccounts"}).catch((err) => {
      // error handle
      console.log(err.code);
    });
    if (accounts[0] !== userAccount) {
      console.log("accounts[0] !== userAccount");
      userAccount = accounts[0];
      // Call a function to update the UI with the new account
      getTasksByOwner()
      .then(displayTasks);
    }
  }, 100);
}

function getTasksByOwner() {
  console.log("getTasksByOwner");
  // TODO: error on ln 49. 
  return todoList.methods.getTasksByOwner().call({from: userAccount});
}

function displayTasks(ids) {
  console.log("displayTasks() called");
  $("#tasks").empty();
  todoList.methods.userToTaskCount(userAccount).call().then(function(result) {
    if (result == 0) {
      $("#tasks").append(`<p>You have no tasks!<p>`);
    }
  });
  // loop through tasks
  for (let id of ids) {
    getTask(id)
    .then(function(task) {
      // add html form of task
      $("#tasks").append(`
      <div class="task" id="${task.id}">
        <div class="content">
          <input 
            type="text" 
            class="text" 
            value="${task.content}"
            readonly>
        </div>
        <div class="actions">
            <button class="edit">Edit</button>
            <button onclick="markTaskComplete(${task.id})" class="delete">Delete</button>
        </div>
      </div>`
      );
    });
  }
}

function getTask(id) {
  return todoList.methods.tasks(id).call();
}

function makeTask(taskContent) {
  todoList.methods.createTask(taskContent).send({from: userAccount});
}
window.makeTask = makeTask;

function markTaskComplete(taskId) {
  todoList.methods.markComplete(taskId).send({from: userAccount});
}
window.markTaskComplete = markTaskComplete;


// logic starts here
window.addEventListener('load', function() {
  console.log("dApp loading ...");

  // check if web3 has been injected by browser
  if (this.window.ethereum !== 'undefined') {
    console.log("web3 has been injected :)");
    const web3 = new Web3(Web3.givenProvider);
  } else {
    this.alert("Install metamask or else Roshan will be sad :'(");
  }

  startApp();
});


