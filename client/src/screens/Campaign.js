import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getCampaignDetails, pledgeAmount, pledgedAmount } from "../utils/CrowdfundInteract";

export default function Campaign() {

  const campaign = useSelector(state => state?.campaign.currentCampaign);
  const [blockData, setBlockData] = useState();

  const user = useSelector(state => state?.user);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    (async () => {
      const res = await getCampaignDetails(campaign.campaignId + 1);
      console.log(campaign);
      const amount = await pledgedAmount(campaign.campaignId, user?.wallet);
      setBlockData(res);
    })();
  }, [])
  return (
    <section className="campaign">
      <div className="campaign-container" style={{backgroundImage: `url(${campaign.image})`}}>
        <div className="campaign-image-wrapper" style={{backgroundImage: campaign.image}}>
          <span className="campaign-title">{campaign.title}</span>
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
              <div className="value">{campaign?.pledged ? campaign?.pledged / (10 ** 18) : 0}</div>
            </div>
            <div>
              <div className="info">Total Investors</div>
              <div className="value">{blockData?.numberOfInvestors}</div>
            </div>
            <div>
              <div className="info">Share price</div>
              <div className="value">3.87 GMS</div>
            </div>
          </div>
          <div className="invest-btn" onClick={() => navigate('/invest')}>Invest</div>
          { user?.wallet.toLowerCase() === blockData?.creator.toLowerCase() && <div className="invest-btn">Claim</div> }
      </div>
      
    </section>
  );
}
