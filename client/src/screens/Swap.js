import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import eth from '../images/ethereum.png'
import env from "react-dotenv";
import { swapTokens } from '../utils/CpammInteract';
import { parseEther } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
function Swap({setLoading}) {
   const [amountIn, setAmountIn] = useState();
   const [amountOut, setAmountOut] = useState();
   const {ERC20_CONTRACT} = env;
   const [addressIn, setAddressIn] = useState(ERC20_CONTRACT);
   
   const user = useSelector(state => state?.user);
   const reserves = useSelector(state => state?.token);
   const dispatch = useDispatch();
   const {ReserveETH, ReserveGMS} = reserves;

   const handleClick = () => {
      if (addressIn === ERC20_CONTRACT) {
         setAddressIn("0x06012c8cf97bead5deae237070f9587f8e7a266d");
      } else {
         setAddressIn(ERC20_CONTRACT);
      }
   }

   const calculateAmountOut = (e) => {
      setAmountIn(e)
      let amountInWithFees = (Number(e)* (10 ** 18) * 997) / 1000;
      let amountOutReturned;
      if (addressIn === ERC20_CONTRACT) {
         amountOutReturned = (Number(ReserveETH) * amountInWithFees) / (Number(ReserveGMS) + amountInWithFees);
         console.log(amountOutReturned);
         setAmountOut(amountOutReturned / (10 ** 18))
      } else {
         amountOutReturned = (Number(ReserveGMS) * amountInWithFees) / (Number(ReserveETH) + amountInWithFees);
         console.log(amountOutReturned);
         setAmountOut(amountOutReturned / (10 ** 18))
      }
   }

   const handleSwap = async () => {
      if (addressIn !== ERC20_CONTRACT) {
         let wei = parseEther(amountIn).toString();
         let weiBig = BigNumber.from(wei).toString();
         await swapTokens(user?.wallet, addressIn, weiBig, setLoading, dispatch);
      } else {
         await swapTokens(user?.wallet, addressIn, amountIn, setLoading, dispatch);
      }
   }

   return (
      <div className='swap-container'>
         <div className='swap-wrapper'>
            <h1 className='swap-subs'>Swap</h1>
            <div className='invest-input-wrapper'>
               <div className='invest-input'>
                  <input 
                     placeholder='0.0' 
                     type='text' 
                     value={amountIn} 
                     onChange={(e) => calculateAmountOut(e.target.value)}
                  />
               </div>
               <div className='currency-wrapper'>
                  <div className='invest-currency'>
                     <img src={eth} alt='eth' height={20} width={20}/>
                     <h3>{addressIn === ERC20_CONTRACT ? 'GMS' : 'ETH'}</h3>  
                  </div>
                  <p>Balance: {addressIn === ERC20_CONTRACT ? Number(user?.balance / (10 ** 18))?.toFixed(3) : Number(user?.ethBalance / (10 ** 18))?.toFixed(3)}</p>
               </div>
            </div>
            <div className='swap-arrow' onClick={handleClick}>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" viewBox="0 0 24 24" fill="none" stroke="#8F96AC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
               </svg>
            </div>
            <div className='invest-input-wrapper'>
               <div className='invest-input'>
                  <input 
                     disabled
                     placeholder='0.0' 
                     type='text' 
                     value={amountOut} 
                     onChange={(e) => setAmountOut(e.target.value)}
                  />
               </div>
               <div className='currency-wrapper'>
                  <div className='invest-currency'>
                     <img src={eth} alt='eth' height={20} width={20}/>
                     <h3>{addressIn === ERC20_CONTRACT ? 'ETH' : 'GMS'}</h3>  
                  </div>
                  <p>Balance: {addressIn === ERC20_CONTRACT ? Number(user?.ethBalance / (10 ** 18))?.toFixed(3) : Number(user?.balance / (10 ** 18))?.toFixed(3)}</p>
               </div>
            </div>
            <div 
               className='invest-action-btn' 
               style={{background: "#1966D4"}}
               onClick={handleSwap}
            >
               <h1>Swap</h1>
            </div>
         </div>
      </div>
   )
}

export default Swap