import env from "react-dotenv";
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contract_abi = require("./ERC20-abi.json");
const {ERC20_CONTRACT} = env;

export const ERC20Contract = new web3.eth.Contract(
   contract_abi,
   ERC20_CONTRACT
);

export const mint = async (address, amount) => {
   console.log(ERC20_CONTRACT);
   console.log(address);
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

export const balanceOf = async (address) => {
   const bal = await ERC20Contract.methods.balanceOf(address).call();
   return bal;
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

