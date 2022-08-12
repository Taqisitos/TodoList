import TodoList from "/build/contracts/TodoList.json" assert { type: "json" };

// gets called when user clicks "Connect Wallet"
async function connectWallet() {
  accounts = await window.ethereum.request({method: "eth_requestAccounts"}).catch((err) => {
     // error handle
     console.log(err.code);
   });
 
   console.log(accounts);
   document.getElementById("connect-btn").innerHTML = accounts;
}


var todoList; // will be the contract object

function startApp() {
  console.log("starting dApp");
  var todoListContractAddress = "0x3CfdFd1e9953bab02808Ee1EFdd3C1bB78804FaD";
  todoList = new web3.eth.Contract(TodoList.abi, todoListContractAddress);
}


function displayTasks() {

}

function createTask() {

}

function markTaskComplete() {

}


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


