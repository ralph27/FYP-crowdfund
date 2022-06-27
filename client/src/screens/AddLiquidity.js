import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import eth from '../images/ethereum.png'

function AddLiquidity() {
   const [amountGMS, setAmountGMS] = useState();
   const [amountETH, setAmountETH] = useState();

   const user = useSelector(state => state?.user);
   console.log(user);

   const handleAddLiquidity = async () => {
      console.log("clicked");
   }

   const handleChange = (GMS) => {
      setAmountGMS(GMS);
      setAmountETH(GMS * (10 ** 18) / (10 ** 18));
   }

   return (
      <div className='liquidity-wrapper'>
         <h1 style={{color: 'white', paddingTop: 140, textAlign: 'center'}}>Add Equal Amount Of ETH and GMS In The Liquidity Pool</h1>
         <div className='liquidity-container'>
            <div>
               <h1 className='liquidity-sub'>Add GMS amount</h1>
               <div className='recipient-amount-input'>
                  <input 
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
                     <p>Balance: {(Number(user?.balance) / (10 ** 18)).toFixed(2)}</p>
                  </div>
               </div>
            </div>
            <div 
               className='invest-action-btn' 
               style={{background:  amountGMS && Number(amountGMS) <= Number(user?.balance / (10 ** 18)) ? "#1966D4" : '#191B1F'}}
               onClick={ amountGMS && Number(amountGMS) <= Number(user?.balance / (10 ** 18)) ?  handleAddLiquidity : undefined
               }
               >
               <h1 style={
                  {
                     color: Number(amountGMS) <= Number(user?.balance / (10 ** 18)) ? "white" : "#4B4D52",
                     cursor: amountGMS <= Number(user?.balance / (10 ** 18)) ? 'pointer' : 'default'
                  }
                  }>{Number(amountGMS) > Number(user?.balance / (10 ** 18)) ? "Insufficient GMS balance" : "Transfer"}</h1>
            </div>
         </div>
      </div>
  )
}

export default AddLiquidity