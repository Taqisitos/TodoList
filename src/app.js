// gets called when user clicks "Connect Wallet"
async function connectWallet() {
  accounts = await window.ethereum.request({method: "eth_requestAccounts"}).catch((err) => {
     // error handle
     console.log(err.code);
   });
 
   console.log(accounts);
   document.getElementById("connect-btn").innerHTML = accounts;
}

App = {
    load: async () => {
        console.log("dApp loading ...");
        await App.connectToBlockchain();
        await App.loadAccount();
    },


    connectToBlockchain: async () => {
        if (typeof window.ethereum !== 'undefined') {
          App.web3Provider = window.ethereum.currentProvider
          //window.ethereum = new Web3(window.ethereum.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
          // TODO: functionality for user pressing connect wallet button
        //   const ethereumButton = document.querySelector('.enableEthereumButton');
        //   ethereumButton.addEventListener('click', () => {
        //     //Will Start the metamask extension
        //     ethereum.request({ method: 'eth_requestAccounts' });
        //   });
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

      loadAccount: async () => {
        App.account = web3.eth.accounts[0];
        console.log(App.account);
      }
}

$(() => {
    $(window).load(() => {
        App.load();
    })
})
