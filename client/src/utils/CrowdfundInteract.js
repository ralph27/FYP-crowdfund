import env from "react-dotenv";
import { ethers} from 'ethers';
import axios from "axios";
import { parseEther } from "ethers/lib/utils";
import { getAbi, getPoolImmutables } from "../helpers/EthHelpers";
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contract_abi = require("./crowdfund-abi.json");
const {CROWDFUND_ADDRESS} = env;
const { abi: IUniswapV3PoolABI } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const { abi: QuoterABI} = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");
console.log(CROWDFUND_ADDRESS);
export const CrowdfundContract = new web3.eth.Contract(
  contract_abi,
  CROWDFUND_ADDRESS
);


export const getCampaignsCount = async () => {
  const count = await CrowdfundContract.methods.count().call();
  return count;
}


export const connectWallet = async () => {
   if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        return addressArray
        
      } catch (err) {
        return err
      }
    }
};

export const pledgedAmount = async (id, address) => {
  
  const res = await CrowdfundContract.methods.pledgedAmount(id, address).call();
  return res
}

export const pledgeAmount = async (id, amount, address, setUploading, dispatch) => {
  const total = amount / (10 ** 18);
  const value = total.toString();
 const transactionParameters = {
    to: CROWDFUND_ADDRESS,
    from: address,
    data: CrowdfundContract.methods.pledge(id, amount, address).encodeABI(),
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
              if (rec.status) {
                console.log(amount);
                dispatch({type: "user/updateBalance", wallet: {balanceType: "ethBalance", value: amount}});
              }
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

export const addCampaign = async (goal, startAt, endAt, address, campaign, setUploading, dispatch) => {
  console.log('campaign added', campaign);
  const transactionParameters = {
    to: CROWDFUND_ADDRESS,
    from: address,
    data: CrowdfundContract.methods.launch(goal, startAt, endAt).encodeABI()
  }

 try {
    const txHash = await window.ethereum.request({
       method: "eth_sendTransaction",
       params: [transactionParameters]
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
              if (rec.status) {
                await axios.post("http://localhost:8080/addCampaign", campaign)
                .then((res) => {
                  console.log(res.response);
                  dispatch({type: "tx/setStatus", status: rec.status})
                })
                .catch((error) => {
                  console.log(error);
                  dispatch({type: "tx/setStatus", status: rec.status})
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

export const claimShares = async (id, address, setUploading, dispatch, balance) => {
  console.log(id, address, balance);
  const tx = {
    to: CROWDFUND_ADDRESS,
    from: address,
    data: CrowdfundContract.methods.claimShares(id, address).encodeABI()
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
              clearInterval(interval);
              console.log(rec.response);
              dispatch({type: "tx/setStatus", status: rec.status})
              const reward = await pledgedAmount(id, address)
              await axios.post("http://localhost:8080/claimShares", {user: address, value: balance + reward })
            }
          });
        }, 1000)   
      }, 1000
    )

 } catch (err) {
    console.log(err.message)
 }
}

export const claimStake = async (id, address, amount, setUploading, dispatch) => {
  
  const tx = {
    from: address,
    to: CROWDFUND_ADDRESS,
    data: CrowdfundContract.methods.claim(id, amount.toString(), address).encodeABI()
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
              clearInterval(interval)
              dispatch({type: "tx/setStatus", status: rec.status})

              await axios.post("http://localhost:8080/claimCampaign", {id: id, claimed: true})
              .then((res) => {
                console.log(res.response);
              })
              .catch((error) => {
                console.log(error);
              });
            }
          });
        }, 1000)
      }, 1000
    )
        
 } catch (err) {
    console.log(err.message)
 }
}

export const refund = async (id, address, amount, setUploading, dispatch) => {
  const tx = {
    from: address,
    to: CROWDFUND_ADDRESS,
    data: CrowdfundContract.methods.refund(id).encodeABI()
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
              clearInterval(interval);
              console.log(rec);
              dispatch({type: "tx/setStatus", status: rec.status})
              await axios.post("http://localhost:8080/updateCampaign", {id: id, amount: amount})
              .then((res) => {
                console.log(res.response);
              })
              .catch((error) => {
                console.log(error);
                dispatch({type: "tx/setStatus", status: rec.status})
              });
            }
          });
        }, 1000)   
      }, 1000
    )
     
 } catch (err) {
    console.log(err.message)
 }
}

export const getProfileCampaigns = async (adr) => {

}


export const getCampaignDetails = async (id) => 
{
  const res = await CrowdfundContract.methods.campaigns(id).call();
  return res;
}

export const getProfile = async (adr) => {
  console.log(adr);
  const res = await CrowdfundContract.methods.investors(adr).call();
  return res;
}

export const getPrice = async (inputAmount) => {
  const {INFURA_URL, ETHERSCAN_KEY} = env;

  const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
  const poolAddress = "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36";
  const quoterAddress =   "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider
 )

 const tokenAddress0 = await poolContract.token0();
   const tokenAddress1 = await poolContract.token1();

   const tokenAbi0 = await getAbi(tokenAddress0, ETHERSCAN_KEY);
   const tokenAbi1 = await getAbi(tokenAddress1, ETHERSCAN_KEY);

   const tokenContract0 = new ethers.Contract(
      tokenAddress0,
      tokenAbi0,
      provider
   )

   const tokenContract1 = new ethers.Contract(
      tokenAddress1,
      tokenAbi1,
      provider
   )

   const tokenSymbol0 = await tokenContract0.symbol();
   const tokenSymbol1 = await tokenContract1.symbol();
   const tokenDecimals0 = await tokenContract0.decimals();
   const tokenDecimals1 = await tokenContract1.decimals();

   const quoterContract = new ethers.Contract(
    quoterAddress,
    QuoterABI,
    provider
 )

 const immutables = await getPoolImmutables(poolContract);

 const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
    tokenDecimals0
 )

 const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
  immutables.token0,
  immutables.token1,
  immutables.fee,
  amountIn,
  0
)
const amountOut = ethers.utils.formatUnits(quotedAmountOut, tokenDecimals1);


return amountOut;

}