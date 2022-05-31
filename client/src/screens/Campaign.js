import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { claimShares, claimStake, getCampaignDetails, pledgeAmount, pledgedAmount, refund } from "../utils/CrowdfundInteract";
import moment from 'moment';

export default function Campaign() {

  const campaign = useSelector(state => state?.campaign.currentCampaign);
  const [blockData, setBlockData] = useState();
  const [amountPledged, setAmountPledged] = useState(0);
  const currentDate = Date.now();
  const user = useSelector(state => state?.user);
  const navigate = useNavigate();

  
  useEffect(() => {
    (async () => {
      const res = await getCampaignDetails(campaign?.campaignId + 1);
      console.log(res);
      const amount = await pledgedAmount(campaign?.campaignId, user?.wallet);
      setBlockData(res);
      setAmountPledged(amount);
    })();
  }, [user?.wallet]);
  console.log(blockData?.goal);
  console.log(campaign?.pledged);
  console.log(campaign?.pledged < blockData?.goal);

  const handleClaim = async () => {
    if (user?.wallet?.toLowerCase() !== blockData?.creator?.toLowerCase()) {
          await claimShares(campaign?.campaignId, user?.wallet);
    } else if (campaign.claimed === false) {
      await claimStake(campaign?.campaignId, user?.wallet, campaign?.pledged);

    }
  } 

  const handleRefund = async () => {
    const pledged = await pledgedAmount(campaign?.campaignId, user?.wallet)
    console.log('pledged', pledged);
    if (pledged > 0) {
      await refund(campaign?.campaignId, user?.wallet, pledged);
    }
  }

  return (
    <section className="campaign">
      <div className="campaign-container" style={{backgroundImage: `url(${campaign?.image})`}}>
        <div className="campaign-image-wrapper">
          <span className="campaign-title">{campaign?.title}</span>
          <p className="campaign-descp">
            {campaign.snippet}
          </p>
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
              <div className="value">{campaign?.pledged ? campaign?.pledged / (10 ** 18) : 0} ETH</div>
            </div>
            <div>
              <div className="info">Total Investors</div>
              <div className="value">{campaign?.nbOfInvestors ? campaign?.nbOfInvestors : 0}</div>
            </div>
            <div>
              <div className="info">Goal</div>
              <div className="value">{blockData?.goal / (10 ** 18)} ETH</div>
            </div>
          </div>
          <div className="campaign-bottom-CTA">

            <div className="invest-btn" onClick={() => navigate('/invest')}>
              Invest
            </div>

            {Number(blockData?.endAt) <= moment().unix() && amountPledged > 0 && campaign.claimed &&
              <div className="invest-btn" onClick={handleClaim}>
                Claim Shares
              </div>
            }

            {Number(blockData?.endAt) <= moment().unix() && user?.wallet?.toLowerCase() === blockData?.creator?.toLowerCase() && !campaign?.claimed &&
              <div className="invest-btn" onClick={handleClaim}>
                Claim Amount Pledged
              </div>
            }


            { Number(blockData?.endAt) <= moment().unix() && !campaign.claimed && amountPledged > 0 &&
              <div className="invest-btn" onClick={handleRefund}>
                Refund
              </div>
            }
          </div>
      </div>
      
    </section>
  );
}
