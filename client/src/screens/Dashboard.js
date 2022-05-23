import React, { useEffect, useState } from "react";
import CampaignCard from "../components/CampaignCard";
import "../styles/main.css";
import axios from "axios";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCampaigns = async () => {
    const res = await axios.get("http://localhost:8080/all-campaigns");
    setCampaigns(res.data);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getCampaigns();
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <section className="dashboard">
      <div className="title-section">
        <div>
          <span className="big-title">Welcome to My Start-Up</span>
          <span className="smaller-title">
            A platform connecting <span className="special">Entrepeneurs</span>{" "}
            and <span className="special">Investors</span> all around the world
          </span>
        </div>
      </div>
      <div className="dashboard-grid">
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
            />
          );
        })}
      </div>
    </section>
  );
}
