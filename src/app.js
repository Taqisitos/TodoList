import abi from "../build/contracts/TodoList.json" assert { type: "json" };

var todoList; // will be the contract object
var userAccount; // current active user
var accounts; // all accounts

var walletConnected = false;

// gets called when user clicks "Connect Wallet"
async function connectWallet() {
  accounts = await window.ethereum.request({method: "eth_requestAccounts"}).catch((err) => {
     // error handle
     console.log(err.code);
   });
   
   userAccount = accounts[0];
   walletConnected = true;
   console.log(userAccount);
   document.getElementById("connect-btn").innerHTML = accounts;
   getTasksByOwner()
      .then(displayTasks);
}
window.connectWallet = connectWallet; // js module thing, set connect wallet to be global

// web3 connected - start app
async function startApp() {
  console.log("starting dApp");
  const todoListContractAddress = "0xDd9FC4112c33B09694d014ff9a33ef4d64873C3C";
  const contractABI = abi.abi;
  todoList = new web3.eth.Contract(contractABI, todoListContractAddress);

  // monitor which user is currently active
  var accountInterval = setInterval(async function() {
    // Check if account has changed
    
    if (walletConnected) {
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
    }
  }, 100);
}

// returns list of all tasks owned by userAccount
function getTasksByOwner() {
  console.log("getTasksByOwner");
  return todoList.methods.getTasksByOwner().call({from: userAccount});
}

// precon: getTasksByOwner() must be called first, result passed into this function
// displays tasks owned by userAccount
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
      if (task.completed == false) {
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
              <button onclick="markTaskComplete(${task.id})" class="delete">Delete</button>
          </div>
        </div>`
        );
      }
    });
  }
}

// return the task with id id
function getTask(id) {
  return todoList.methods.tasks(id).call();
}

// create new task and refresh page
function makeTask(taskContent) {
  todoList.methods.createTask(taskContent).send({from: userAccount})
  .on('transactionHash', function() {
    getTasksByOwner()
    .then(displayTasks);
  });
}
window.makeTask = makeTask;

// mark task with id taskId complete and refresh page
function markTaskComplete(taskId) {
  todoList.methods.markComplete(taskId).send({from: userAccount})
  .on('transactionHash', function() {
    $("#" + taskId).remove();
  });
}
window.markTaskComplete = markTaskComplete;


// logic starts here
window.addEventListener('load', function() {
  console.log("dApp loading ...");

  document.getElementById("connect-btn").addEventListener("click", connectWallet);

  // check if web3 has been injected by browser
  if (this.window.ethereum !== 'undefined') {
    console.log("web3 has been injected :)");
    const web3 = new Web3(Web3.givenProvider);
  } else {
    this.alert("Install metamask or else Roshan will be sad :'(");
  }

  startApp();
});


