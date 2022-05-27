import {BigNumber, ethers} from 'ethers';
import axios from "axios";
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const getEthBalance = async (address) => {
   const res = await web3.eth.getBalance(address);
   return res;
}