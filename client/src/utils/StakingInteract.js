import env from "react-dotenv";
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contract_abi = require("./staking-abi.json");
const {STAKING_ADDRESS} = env;
const moment = require('moment')

export const StakingContract = new web3.eth.Contract(
   contract_abi,
   STAKING_ADDRESS
 );

 export const totalStaked = async () => {
   const res = await StakingContract.methods.total_amount_stacked().call();
   console.log('res',res);
   return res;
 }

 export const getRewardAmount = async (date, amount) => {
    const res =  (((moment().unix() - date) / 60) * amount) / 1000;
    console.log(res);
    return res;
 }

 