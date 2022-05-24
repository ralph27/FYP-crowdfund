import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCampaignDetails } from "../utils/CrowdfundInteract";

export default function Campaign() {

  const campaign = useSelector(state => state?.campaign.currentCampaign);
  const [blockData, setBlockData] = useState();

  const user = useSelector(state => state?.user);

  useEffect(() => {
    (async () => {
      const res = await getCampaignDetails(campaign.campaignId + 1);
      setBlockData(res);
    })();
  }, [])

  return (
    <section className="campaign">
      <div className="campaign-container">
        <div>
          <img
            className="campaign-image"
            src={campaign.image}
            alt=""
          />
          <span className="campaign-website">
            Website: <a href="https://nowrx.com/">https://nowrx.com/</a>
          </span>
          <span className="campaign-country">{campaign.creator}({blockData?.creator})</span>
        </div>
        <div class="campaign-info">
          <span className="campaign-title">{campaign.title}</span>
          <p className="campaign-descp">
            {campaign.snippet}
          </p>
          <div className="invest-info">
            <div>
              <div className="info">Amount Raised</div>
              <div className="value">{blockData?.pledged}</div>
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
          <div className="invest-btn">Invest</div>
          { user?.wallet.toLowerCase() === blockData?.creator.toLowerCase() && <div className="invest-btn">Claim</div> }
        </div>
      </div>
      <div className="campaign-about">
        <p>
          {campaign.descp}
        </p>
      </div>
    </section>
  );
}
