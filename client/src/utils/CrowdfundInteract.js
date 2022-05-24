import env from "react-dotenv";
import {BigNumber, ethers} from 'ethers';
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contract_abi = require("./crowdfund-abi.json");
const {CROWDFUND_ADDRESS} = env;
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

export const pedgeAmount = async (amount) => {
  const weiValue = ethers.utils.parseEther(amount);
  console.log(weiValue);
}

export const addCampaign = async (goal, startAt, endAt, address) => {
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
    console.log(txHash);
 } catch (err) {
    console.log(err.message)
 }
}

export const getCampaignDetails = async (id) => 
{
  console.log(id);
  const res = await CrowdfundContract.methods.campaigns(id).call();
  return res;
}