import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CampaignCard from '../components/CampaignCard';
import { getProfile } from '../utils/CrowdfundInteract';

function Profile() {
   const user = useSelector(state => state?.user);
   const [campaigns, setCampaigns] = useState([]);
   const [campaignsCreated, setCampaignsCreated] = useState([]);
   useEffect(() => {
      (async () => {
         console.log('here');
         const res = await axios.get("http://localhost:8080/getProfile", {params: {address: user?.wallet}})
         console.log('res',res.data);
         const created = await axios.get("http://localhost:8080/getCreated", {params: {address: user?.wallet}})
         console.log('created',created.data);
         setCampaigns(res.data);
         setCampaignsCreated(created.data);
      })();
   }, [user?.wallet])

   return (
      <div className='profile-screen'>
         <h1>Profile</h1>
         <div className="dashboard-grid">
            <div className='profile-invested'>
               <h1 className='profile-invested-title'>Campaigns Invested In</h1>
               {campaigns.map((campaign) => {
               return (
                  <CampaignCard
                        title={campaign.title}
                        descp={campaign.description}
                        snippet={campaign.snippet}
                        creator={campaign.creator}
                        image={campaign.thumbnail}
                        id={campaign._id}
                        campaignId={campaign.id}
                        startDate={campaign.startAt}
                        endDate={campaign.endAt}
                        pledged={campaign.pledged}
                        nbOfInvestors={campaign.nbOfInvestors}
                        claimed={campaign.claimed}
                     />
                  );
               })}
            </div>
            <div className='profile-invested'>
               <h1 className='profile-invested-title'>Campaigns Created</h1>
               {campaignsCreated?.map((campaign) => {
               return (
                  <CampaignCard
                        title={campaign.title}
                        descp={campaign.description}
                        snippet={campaign.snippet}
                        creator={campaign.creator}
                        image={campaign.thumbnail}
                        id={campaign._id}
                        campaignId={campaign.id}
                        startDate={campaign.startAt}
                        endDate={campaign.endAt}
                        pledged={campaign.pledged}
                        nbOfInvestors={campaign.nbOfInvestors}
                        claimed={campaign.claimed}
                     />
                  );
               })}
            </div>
         </div>
      </div>
  )
}

export default Profile