import env from "react-dotenv";
import axios from 'axios';
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contract_abi = require("./ERC20-abi.json");
const {ERC20_CONTRACT} = env;
const moment = require("moment");

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

export const stake = async (address, stake, setUploading, dispatch, calculateReward, id, setTotalStaked) => {
   const tx = {
      from: address,
      to: ERC20_CONTRACT,
      data: ERC20Contract.methods.stake(Number(stake.amount), address, id).encodeABI(),
   }
   try {
      const txHash = await window.ethereum.request({
         method: "eth_sendTransaction",
         params: [tx]
      });
      setTimeout(  
         function() {
            setUploading(true);
            dispatch({type: "tx/setTx", tx: txHash})
            const interval = setInterval(function() {
            console.log("Attempting to get transaction receipt...");
            web3.eth.getTransactionReceipt(txHash, async function(err, rec) {
              if (rec) {
                console.log(rec);
                clearInterval(interval);
                dispatch({type: "tx/setStatus", status: rec.status});
                if (rec.status) {
                  dispatch({type: "user/updateBalance", wallet: {balanceType: "balance", value: stake.amount }})
                  dispatch({type: "staking/addStaking", stake: {amount: stake.amount, date: moment().unix(),
                     reward: calculateReward(moment().unix(), stake.amount), id: id}
                   });
                   setTotalStaked(prev => Number(prev) + Number(stake.amount / (10 ** 3)));
                   dispatch({type: "token/updateStaked", staked: Number(stake.amount )})
                  return true;
                }
              }
            });
          }, 1000)  
         },  
      1000)
      
   } catch (err) {
      console.log(err.message)
   }
}

export const getStakes = async (address) => {
   console.log(address);
   const summary = await ERC20Contract.methods.getSummary(address).call();
   return summary;
}

export const getUserStakes = async (address) => {
   const summary = await ERC20Contract.methods.getUserStakes(address).call();
   return summary;
}

export const getStakesCount = async () => {
   const res = await ERC20Contract.methods.getTotalStakes().call();
   return res;
}
 
export const sendToContract = async (address, recipient, amount, dispatch) => {
   console.log(address + " SPACE " + ERC20_CONTRACT);
   const tx = {
      from: address,
      to: ERC20_CONTRACT,
      data: ERC20Contract.methods.sendToContract(recipient, amount * (10 ** 3)).encodeABI()
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
            dispatch({type: "tx/setStatus", status: rec.status})
          }
        });
      }, 1000)    
   } catch (err) {
      console.log(err.message)
   }
}

export const transfer = async (address, recipient, amount, dispatch, setUploading) => {
   const tx = {
      from: address,
      to: ERC20_CONTRACT,
      data: ERC20Contract.methods.transferFrom(address, recipient, amount * (10 ** 3)).encodeABI()
   }
   try {
      const txHash = await window.ethereum.request({
         method: "eth_sendTransaction",
         params: [tx]
      });
      setTimeout(  
         function() {
            setUploading(true);
            dispatch({type: "tx/setTx", tx: txHash})
            const interval = setInterval(function() {
            console.log("Attempting to get transaction receipt...");
            web3.eth.getTransactionReceipt(txHash, async function(err, rec) {
              if (rec) {
                console.log(rec);
                clearInterval(interval);
                dispatch({type: "tx/setStatus", status: rec.status});
                if (rec.status) {
                  dispatch({type: "user/updateBalance", wallet: {balanceType: "balance", value: amount * (10 ** 3)}})
                }
              }
            });
          }, 1000)  
         },  
      1000)
      
   } catch (err) {
      console.log(err.message)
   }
}

export const totalAmount = async () => {
   const res = await ERC20Contract.methods.getTotalAmountStaked().call();
   return res;
}

export const withdrawStake = async (initialAmount, amount, amountMint, address, id, setUploading, dispatch, balance, setTotalStaked) => {
   const tx = {
      from: address,
      to: ERC20_CONTRACT,
      data: ERC20Contract.methods.withdrawStake(initialAmount, Math.ceil(amount), Math.ceil(amountMint), address, id).encodeABI()
   }
   try {
      const txHash = await window.ethereum.request({
         method: "eth_sendTransaction",
         params: [tx]
      });
      setTimeout(
         function() {
           setUploading(true);
           dispatch({type: "tx/setTx", tx: txHash})
           var interval = setInterval(function() {
             console.log("Attempting to get transaction receipt...");
             web3.eth.getTransactionReceipt(txHash, async function(err, rec) {
               if (rec) {
                 console.log(rec);
                 clearInterval(interval);
                 dispatch({type: "tx/setStatus", status: rec.status})
                 if (rec.status) {
                  dispatch({type: "user/updateBalance", wallet: {balanceType: "balance", value: -amountMint}})
                  dispatch({type: "staking/removeStaking", id: {id}});
                  dispatch({type: "token/updateStaked", staked: -initialAmount})
                  setTotalStaked(prev => prev - Number(initialAmount / (10 ** 3)));
                  await axios.post("/claimStake",  {address: address, value: amountMint})
                  .then((res) => {
                     console.log(res.response);
                  })
                  .catch((error) => {
                     console.log(error);
                  });
                 }
               }
             });
           }, 1000)
         },
         1000
       )
   } catch (err) {
      console.log(err.message)
   }
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

