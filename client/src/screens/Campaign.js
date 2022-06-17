import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { claimShares, claimStake, getCampaignDetails, pledgeAmount, pledgedAmount, refund } from "../utils/CrowdfundInteract";
import moment from 'moment';
import ProgressBar from "@ramonak/react-progress-bar";


export default function Campaign({setLoading}) {

  const campaign = useSelector(state => state?.campaign.currentCampaign);
  const [blockData, setBlockData] = useState();
  const [amountPledged, setAmountPledged] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const user = useSelector(state => state?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    (async () => {
      const res = await getCampaignDetails(campaign?.campaignId);
      console.log(res);
      const amount = await pledgedAmount(campaign?.campaignId, user?.wallet);
      setBlockData(res);
      setAmountPledged(amount);
      getTimeLeft();
    })();
  }, [user?.wallet]);

  const getTimeLeft = () => {
    let time = Number(campaign?.endDate) - moment().unix();
    var d = Math.floor(time / (3600*24));
    var h = Math.floor(time % (3600*24) / 3600);
    var m = Math.floor(time % 3600 / 60);
    var s = Math.floor(time % 60);
    if (d < 0) {
      setTimeLeft("Campaign Has Ended")
    } else
    if (d >= 1) {
      setTimeLeft(`${d} day and ${h} ${h > 1 ? "hours" : "hour"} left`);
    } else {
      setTimeLeft(`${h} ${h > 1 ? "hours" : "hour"} and ${m} ${m > 1 ? "minutes" : "minute"} and ${s} ${s > 1 ? "seconds" : "second"} left`);
    } 
  }

  const handleClaim = async () => {
    if (user?.wallet?.toLowerCase() !== blockData?.creator?.toLowerCase()) {
          const res = await pledgedAmount(campaign?.campaignId, user?.wallet);
          console.log('pl', res);
          await claimShares(campaign?.campaignId, user?.wallet, setLoading, dispatch, user?.balance);
    } else if (blockData.claimed === false) {
      await claimStake(campaign?.campaignId, user?.wallet, blockData?.pledged, setLoading, dispatch);

    }
  } 

  const handleRefund = async () => {
    const pledged = await pledgedAmount(campaign?.campaignId, user?.wallet)
    if (pledged > 0) {
      await refund(campaign?.campaignId, user?.wallet, pledged, setLoading, dispatch);
    }
  }

  return (
    <section className="campaign">
      <div className="campaign-container" style={{backgroundImage: `url(${campaign?.image})`}}>
        <div className="campaign-image-wrapper">
          <div>
            <span className="campaign-title">{campaign?.title}</span>
            <p className="campaign-descp">
              {campaign.snippet}
            </p>
          </div>
          <div>
            {timeLeft}
          </div>
        </div>
        
      </div>
      <div className="campaign-website-info">
        <p className="campaign-website">
          Website: <a href="https://nowrx.com/">https://nowrx.com/</a>
        </p>
      </div>
      <div className="campaign-about">
        <h1 className="campaign-description-header">Description</h1>
        <p>
          {campaign.descp}
        </p>
      </div>
      <div class="campaign-info">
          <div className="invest-info">
            <div>
              <div className="info">Amount Raised</div>
              <div className="value">{blockData?.pledged ? blockData?.pledged / (10 ** 18) : 0} ETH</div>
            </div>
            <div>
              <div className="info">Total Investors</div>
              <div className="value">{blockData?.numberOfInvestors ? blockData?.numberOfInvestors : 0}</div>
            </div>
            <div>
              <div className="info">Goal</div>
              <div className="value">{blockData?.goal / (10 ** 18)} ETH</div>
            </div>
          </div>
          <ProgressBar completed={( blockData?.pledged * 100 ) / blockData?.goal} width="50vw" margin="50px 0 0 0" bgColor="#FF007A"/>
          <div className="campaign-bottom-CTA">

            {Number(blockData?.endAt) >= moment().unix() && user?.wallet.toLowerCase() !== blockData?.creator.toLowerCase() && <div className="invest-btn" onClick={() => navigate('/invest')}>
              Invest
            </div>}

            {Number(blockData?.endAt) <= moment().unix() && amountPledged > 0 && blockData.claimed &&
              <div className="invest-btn" onClick={handleClaim}>
                Claim Shares
              </div>
            }

            {Number(blockData?.endAt) <= moment().unix() && user?.wallet?.toLowerCase() === blockData?.creator?.toLowerCase() && !blockData?.claimed && blockData?.pledged >= blockData.goal &&
              <div className="invest-btn" onClick={handleClaim}>
                Claim Amount Pledged
              </div>
            }


            { Number(blockData?.endAt) <= moment().unix() && !blockData?.claimed && amountPledged > 0 &&
              <div className="invest-btn" onClick={handleRefund}>
                Refund
              </div>
            }
          </div>
      </div>
      
    </section>
  );
}
