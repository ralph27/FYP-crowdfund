import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ParseGMS } from '../helpers/ParseGMS';
import eth from '../images/ethereum.png'
import { addLiquidity, getEthAdded, getEthReserve, getGmsAdded, getGmsReserve, removeLiquidity } from '../utils/CpammInteract';

function AddLiquidity({setLoading}) {
   const [amountGMS, setAmountGMS] = useState();
   const [amountETH, setAmountETH] = useState();
   const [withdrawLiquidity, setWithdrawLiquidity] = useState(false);
   const [shares, setShares] = useState();

   const user = useSelector(state => state?.user);
   const reserves = useSelector(state => state?.token);
   const {ReserveETH, ReserveGMS} = reserves;
   const dispatch = useDispatch();

   const handleAddLiquidity = async () => {
      let wei = parseEther(amountETH).toString();
      let weiBig = BigNumber.from(wei).toString();
      await addLiquidity(user?.wallet, ParseGMS(amountGMS * (10 ** 18)), weiBig, setLoading, dispatch);
   }

   const handleChange = (GMS) => {
      //reserve_GMS * amountGMS == reserve_ETH * amountETH
      setAmountGMS(GMS);
      if (ReserveGMS == 0) {
         setAmountETH(GMS)
      } else {
         setAmountETH((GMS * ReserveGMS) / ReserveETH);
      }
   }

   const removeUserLiquidity = async () => {
      if (Number(shares) > 0 && Number(shares) <= Number(user?.shares / (10 ** 18))) {
         await removeLiquidity(user?.shares, user?.wallet, setLoading, dispatch);
      }
   }

   const handleRemoveLiquidity = () => {
      setAmountETH(0);
      setAmountGMS(0);
      setWithdrawLiquidity(prev => !prev);
   }

   useEffect(() => {
      (async () => {
         const res = await getEthReserve();
         const resGMS = await getGmsReserve();
         const gmsAdded = await getGmsAdded(user?.wallet);
         const ethAdded = await getEthAdded(user?.wallet);
         dispatch({type: "user/updateLiquidity", liquidity: {gmsAdded: gmsAdded, ethAdded: ethAdded}})
      })();
   }, [])

   return (
      <div className='liquidity-wrapper'>
         <h1 style={{color: 'white', paddingTop: 140, textAlign: 'center'}}>Add ETH and GMS In The Liquidity Pool</h1>
         <div className='liquidity-container'>
            <div>
               <h1 className='liquidity-sub'>Add GMS amount</h1>
               <div className='recipient-amount-input'>
                  <input 
                     disabled={withdrawLiquidity}
                     placeholder='0.0' 
                     type='text' 
                     value={amountGMS} 
                     onChange={(e) => handleChange(e.target.value)}
                  /> 
                  <div className='currency-wrapper'>
                     <div className='invest-currency'>
                        <img src={eth} alt='eth' height={20} width={20}/>
                        <h3>GMS</h3>  
                     </div>
                     <p>Balance: {(Number(user?.balance) / (10 ** 18)).toFixed(2)}</p>
                  </div>
               </div>
            </div>
            <div style={{marginTop: 30}}>
               <h1 className='liquidity-sub'>Amount of ETH Required</h1>
               <div className='recipient-amount-input'>
                  <input 
                     disabled
                     placeholder='0.0' 
                     type='text' 
                     value={amountETH} 
                  /> 
                  <div className='currency-wrapper'>
                     <div className='invest-currency'>
                        <img src={eth} alt='eth' height={20} width={20}/>
                        <h3>ETH</h3>  
                     </div>
                     <p>Balance: {(Number(user?.ethBalance) / (10 ** 18)).toFixed(2)}</p>
                  </div>
               </div>
            </div>
            <p className='remove-liquidity-sub' onClick={handleRemoveLiquidity}>Or Remove Your Liquidity</p>
            {withdrawLiquidity && <div>
               <h1 className='remove-liquidity-title'>Enter Amount of Shares to Withdraw</h1>
               <div className='recipient-input'>
                  <input 
                     placeholder='0' 
                     type='text' 
                     value={shares} 
                     onChange={(e) => setShares(e.target.value)}
                  />  
                  <div className='liquidity-balance'>
                     <p className='share-balance'>GMS deposited: {Number(user?.gmsAdded) / (10 ** 18)} GMS</p>                
                     <p  className='share-balance'>ETH Deposited: {Number(user?.ethAdded) / (10 ** 18)} ETH</p>
                  </div>
               </div>
            </div>}
            {withdrawLiquidity ? 
            <div 
               className='invest-action-btn' 
               style={{ background: Number(shares) > 0 && Number(shares) <= Number(user?.shares / (10 ** 18))
                        ? "#1966D4" : '#191B1F'
                     }}
               onClick={() => removeUserLiquidity()}

            >
               <h1 style={
                  {
                     color: Number(shares) > 0 && Number(shares) <= Number(user?.shares / (10 ** 18)) ?
                              "white" : "#4B4D52",
                     cursor: Number(shares) > 0 && Number(shares) <= Number(user?.shares / (10 ** 18)) ?
                              "pointer" : 'default'

                  }
               }>
                  Remove
               </h1>
            </div>
            :
            <div 
               className='invest-action-btn' 
               style={{background:  Number(amountGMS) > 0 && Number(amountGMS) <= Number(user?.balance / (10 ** 18)) &&
                                       Number(amountETH) > 0 && Number(amountETH) <= Number(user?.ethBalance / (10 ** 18)) ? 
                                       "#1966D4" : '#191B1F'}}
               onClick={ Number(amountGMS) > 0 && Number(amountGMS) <= Number(user?.balance / (10 ** 18)) &&
                           Number(amountETH) > 0 && Number(amountETH) <= Number(user?.ethBalance / (10 ** 18)) ?  handleAddLiquidity : undefined
               }
               >
               <h1 style={
                  {
                     color: Number(amountGMS) > 0 && Number(amountGMS) <= Number(user?.balance / (10 ** 18)) && 
                              Number(amountETH) > 0 && Number(amountETH) <= Number(user?.ethBalance / (10 ** 18)) ? "white" : "#4B4D52",
                     cursor: Number(amountGMS) > 0 && amountGMS <= Number(user?.balance / (10 ** 18)) && 
                              Number(amountETH) > 0 && Number(amountETH) <= Number(user?.ethBalance / (10 ** 18)) ? 'pointer' : 'default'
                  }
                  }>{
                     Number(amountGMS) > Number(user?.balance / (10 ** 18)) || 
                     Number(amountETH) > Number(user?.ethBalance / (10 ** 18)) ? "Insufficient Balance" : "Add"
                  }
               </h1>
            </div>}
         </div>
      </div>
  )
}

export default AddLiquidity