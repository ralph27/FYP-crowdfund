import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import eth from '../images/ethereum.png'
import { transfer } from '../utils/ERC20Interact';

function Withdraw({setLoading}) {

   const [recipient, setRecipient] = useState("");
   const [amount, setAmount] = useState();

   const user = useSelector(state => state?.user);
   const dispatch = useDispatch();

   const handleTransfer = async () => {
      console.log(user?.balance, recipient, amount);
      await transfer(user?.wallet, recipient, amount, dispatch, setLoading);
      setRecipient("");
      setAmount(0);
   }

 
   return (
      <div className='withdraw-screen'>
         <h1 className='withdraw-screen-title'>Withdraw Your Funds</h1>
         <div className='withdraw-wrapper'>
            <h3>Enter recipient's address</h3>
            <div className='recipient-input'>
               <input 
                  placeholder='0x' 
                  type='text' 
                  value={recipient} 
                  onChange={(e) => setRecipient(e.target.value)}
               />                  
            </div>
            <h3 style={{marginTop: 20}}>Enter Amount</h3>
            <div className='recipient-amount-input'>
               <input 
                  placeholder='0.0' 
                  type='text' 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
               /> 
               <div className='currency-wrapper'>
                  <div className='invest-currency'>
                     <img src={eth} alt='eth' height={20} width={20}/>
                     <h3>ETH</h3>  
                  </div>
                  <p>Balance: {(Number(user?.balance) / (10 ** 3)).toFixed(2)}</p>
               </div>
            </div>
            <div 
               className='invest-action-btn' 
               style={{background: amount < Number(user?.balance / (10 ** 3)) && recipient !== "" && amount > 0 ? "#1966D4" : '#191B1F'}}
               onClick={amount < Number(user?.balance / (10 ** 3)) && amount ? handleTransfer : undefined}
               >
               <h1 style={
                  {
                     color: amount < Number(user?.balance / (10 ** 3)) && recipient !== "" && amount > 0 ? "white" : "#4B4D52",
                     cursor: amount < Number(user?.balance / (10 ** 3)) && recipient !== "" && amount > 0 ? 'pointer' : 'default'
                  }
                  }>{amount > Number(user?.balance / (10 ** 3)) ? "Insufficient GMS balance" : "Transfer"}</h1>
            </div>
         </div>
    </div>
  )
}

export default Withdraw