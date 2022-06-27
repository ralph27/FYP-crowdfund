const {BigNumber} = require("ethers");

export const ParseGMS = (amountGMS) => {
   const input = amountGMS;
   const amount = BigNumber.from(input.toString());
   return amount;
}