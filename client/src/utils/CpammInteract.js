import env from "react-dotenv";
import { BigNumber, ethers} from 'ethers';
import { ParseGMS } from "../helpers/ParseGMS";
import { parseEther } from "ethers/lib/utils";
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contract_abi = require("./cpamm-abi.json");
const {CPAMM_ADDRESS, ERC20_CONTRACT} = env;
const moment = require("moment");

export const CPAMMContract = new web3.eth.Contract(
  contract_abi,
  CPAMM_ADDRESS
);

export const getEthReserve = async () => {
   const count = await CPAMMContract.methods.reserve_ETH().call();
   return count;
}

export const getGmsReserve = async () => {
   const count = await CPAMMContract.methods.reserve_GMS().call();
   return count;
}

export const getUserShares = async (address) => {
   const shares = await CPAMMContract.methods.balanceOf(address).call();
   return shares
}

export const removeLiquidity = async (shares, address, setUploading, dispatch) => {
   const transactionParameters = {
      to: CPAMM_ADDRESS,
      from: address,
      data: CPAMMContract.methods.removeLiquidity(shares).encodeABI(),
    }
  
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters]
      })
  
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
              }
            });
          }, 1000)
        },
        1000
      )
  
    } catch (err) {
      console.log(err.message);
    }
}

export const addLiquidity = async (address, amountGMS, amountETH, setUploading, dispatch) => {
   const total = amountETH / (10 ** 18);
   const value = total.toString();
   const transactionParameters = {
      to: CPAMM_ADDRESS,
      from: address,
      data: CPAMMContract.methods.addLiquidity(amountGMS, amountETH).encodeABI(),
      value: ethers.utils.parseEther(value).toHexString()
    }
  
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters]
      })
  
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
              }
            });
          }, 1000)
        },
        1000
      )
  
    } catch (err) {
      console.log(err.message);
    }
}

export const swapTokens = async (address, addressIn, amountIn, setUploading, dispatch) => {
  let transactionParameters;
  if (addressIn === ERC20_CONTRACT) {
    transactionParameters = {
       to: CPAMM_ADDRESS,
       from: address,
       data: CPAMMContract.methods.swap(addressIn, ParseGMS(amountIn * (10 ** 18))).encodeABI(),
     }
  } else {
    const total = amountIn / (10 ** 18);
    const value = total.toString();  
    transactionParameters = {
      to: CPAMM_ADDRESS,
      from: address,
      data: CPAMMContract.methods.swap(addressIn, value.toString()).encodeABI(),
      value: ethers.utils.parseEther(value).toHexString()
    }
  }
 
   try {
     const txHash = await window.ethereum.request({
       method: "eth_sendTransaction",
       params: [transactionParameters]
     })
 
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
             }
           });
         }, 1000)
       },
       1000
     )
 
   } catch (err) {
     console.log(err.message);
   }
}

export const stake = async (address, stake, setUploading, dispatch, calculateReward, id, setTotalStaked) => {
   const tx = {
      from: address,
      to: CPAMM_ADDRESS,
      data: CPAMMContract.methods.stake(stake.amount, id).encodeABI(),
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
                  dispatch({type: "user/updateBalance", wallet: {balanceType: "shares", value: stake.amount }})
                  dispatch({type: "staking/addStaking", stake: {amount: stake.amount, date: moment().unix(),
                     reward: calculateReward(moment().unix(), stake.amount), id: id}
                   });
                   setTotalStaked(prev => Number(prev) + Number(stake.amount / (10 ** 18)));
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

export const withdrawStake = async (initialAmount, amount, address, id, setUploading, dispatch, balance, setTotalStaked) => {
   console.log(initialAmount, amount);
   const tx = {
      from: address,
      to: CPAMM_ADDRESS,
      data: CPAMMContract.methods.withdrawStake(initialAmount, ParseGMS(amount), address, id).encodeABI()
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
                  dispatch({type: "user/updateBalance", wallet: {balanceType: "balance", value: -amount}})
                  dispatch({type: "staking/removeStaking", id: {id}});
                  setTotalStaked(prev => prev - Number(initialAmount / (10 ** 18)));
                 
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

export const getUserStakes = async (address) => {
   const summary = await CPAMMContract.methods.getUserStakes(address).call();
   return summary;
}

export const getStakesCount = async () => {
   const res = await CPAMMContract.methods.getTotalStakes().call();
   return res;
}