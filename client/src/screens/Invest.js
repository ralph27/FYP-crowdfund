import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import eth from '../images/ethereum.png'
import { pledgeAmount, pledgedAmount } from '../utils/CrowdfundInteract';
import { getEthBalance } from '../utils/EthInteract';
import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils';

import axios from 'axios';

function Invest() {
   const dispatch = useDispatch();
   const [ethBalance, setEthBalance] = useState(0)
   const [value, setValue] = useState("");

   const user = useSelector(state => state?.user);
   const campaign = useSelector(state => state?.campaign.currentCampaign);
   console.log(user);
   useEffect(() => {
      (async () => {
         const res = await getEthBalance(user?.wallet.toLowerCase());
         setEthBalance(res / (10 ** 18));
      })();
   }, [])

   const handleInvest = async () => {
      const amountInvested = await pledgedAmount(campaign.campaignId, user?.wallet);
      console.log(typeof(amountInvested));
      let wei = parseEther(value).toString();
      let weiBig = BigNumber.from(wei).toString();
      await pledgeAmount(campaign.campaignId, weiBig, user.wallet);
      let amountPledged = 0;
      let nbOfInvestors = campaign.nbOfInvestors;
      if (campaign.pledged) {
         amountPledged = Number(wei) + Number(campaign.pledged)
         console.log(amountPledged);   
      } else {
         amountPledged = wei
      }
      console.log(amountInvested);
      if (amountInvested === "0") {
         dispatch({type: "campaign/invest", campaign: {pledged: amountPledged, nbOfInvestors: nbOfInvestors + 1}})
         console.log('new investor');
         await axios.post("http://localhost:8080/updateCampaign", { id: campaign.campaignId, amount: amountPledged, incInvestors: true});
        ;
         
      } else {
         dispatch({type: "campaign/invest", campaign: {pledged: amountPledged, nbOfInvestors: nbOfInvestors}});
         console.log('old investor');
         await axios.post("http://localhost:8080/updateCampaign", { id: campaign.campaignId, amount: amountPledged});
      }

      
   }

   return (
      <div className='invest-wrapper'>
         <div className='invest-form-wrapper'>
            <h1>Enter amount</h1>
            <div className='invest-input-wrapper'>
               <div className='invest-input'>
                  <input 
                     placeholder='0.0' 
                     type='text' 
                     value={value} 
                     onChange={(e) => setValue(e.target.value)}
                  />
               </div>
               <div className='currency-wrapper'>
                  <div className='invest-currency'>
                     <img src={eth} alt='eth' height={20} width={20}/>
                     <h3>ETH</h3>  
                  </div>
                  <p>Balance: {ethBalance.toFixed(2)}</p>
               </div>
            </div>
            <div 
               className='invest-action-btn' 
               style={{background: value < ethBalance && value > 0 ? "#1966D4" : '#191B1F'}}
               onClick={value < ethBalance && value ? handleInvest : undefined}
               >
               <h1 style={
                  {
                     color: value < ethBalance && value > 0 ? "white" : "#4B4D52",
                     cursor: value < ethBalance && value > 0 ? 'pointer' : 'default'
                  }
                  }>{value > ethBalance ? "Insufficient ETH balance" : "Invest"}</h1>
            </div>
         </div>
      </div>
   )
}

export default Invest