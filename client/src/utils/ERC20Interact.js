import env from "react-dotenv";
import axios from 'axios';
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contract_abi = require("./ERC20-abi.json");
const {ERC20_CONTRACT} = env;

export const ERC20Contract = new web3.eth.Contract(
   contract_abi,
   ERC20_CONTRACT
);

export const mintTokens = async (address, amount) => {
   const transactionParameters = {
      to: ERC20_CONTRACT,
      from: address,
      data: ERC20Contract.methods.mint(amount).encodeABI()
   }

   try {
      const txHash = await window.ethereum.request({
         method: "eth_sendTransaction",
         params: [transactionParameters]
      });
      console.log(txHash);
   } catch (err) {
      console.log(err.message)
   }
   
}

export const getTotalSupply = async () => {
   const supply = await ERC20Contract.methods.totalSupply().call();
   return supply;
}

export const getCirculation = async () => {
   const circulation = await ERC20Contract.methods.circulatingSupply().call();
   return circulation;
}

export const balanceOf = async (address) => {
   const bal = await ERC20Contract.methods.balanceOf(address).call();
   return bal;
}

export const stake = async (amount, address, stake) => {
   const tx = {
      from: address,
      to: ERC20_CONTRACT,
      data: ERC20Contract.methods.stake(Number(amount), address).encodeABI(),
   }
   try {
      const txHash = await window.ethereum.request({
         method: "eth_sendTransaction",
         params: [tx]
      });
      const interval = setInterval(function() {
        console.log("Attempting to get transaction receipt...");
        web3.eth.getTransactionReceipt(txHash, async function(err, rec) {
          if (rec) {
            console.log(rec);
            await axios.post("http://localhost:8080/addStake", stake)
            .then((res) => {
               console.log(res.response);
            })
            .catch((error) => {
               console.log(error);
            });
            clearInterval(interval);
          }
        });
      }, 1000)    
   } catch (err) {
      console.log(err.message)
   }
}

export const getStakes = async (address) => {
   console.log(address);
   const summary = await ERC20Contract.methods.getSummary(address).call();
   return summary;
}

export const sendToContract = async (address) => {
   const tx = {
      from: address,
      to: ERC20_CONTRACT,
      data: ERC20Contract.methods.sendToContract("0xeAa610F6C2b8da2561E24c4809eF9F709bB1e312", 100).encodeABI()
   }
   try {
      const txHash = await window.ethereum.request({
         method: "eth_sendTransaction",
         params: [tx]
      });
      const interval = setInterval(function() {
        console.log("Attempting to get transaction receipt...");
        web3.eth.getTransactionReceipt(txHash, async function(err, rec) {
          if (rec) {
            console.log(rec);
            clearInterval(interval);
          }
        });
      }, 1000)    
   } catch (err) {
      console.log(err.message)
   }
}

export const totalAmount = async () => {
   const res = await ERC20Contract.methods.getTotalAmountStaked().call();
   return res;
}

export const subscribeToTransfer = async () => {
   ERC20Contract.events.Transfer({}, (error, data) => {
      if (error) {
         console.log(error);
      } else {
         console.log(data)
      }
   })
}

