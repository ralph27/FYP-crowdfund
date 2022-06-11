import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { connectWallet } from "../utils/CrowdfundInteract";

export default function CampaignCard({ image, title, descp, snippet, creator, id, campaignId, startDate, endDate, pledged, nbOfInvestors, claimed }) {

  const user = useSelector(state => state?.user);
  let navigate = useNavigate();
  let dispatch = useDispatch();


  const handleClick = async () => {
    if (user?.wallet) {
      dispatch({type: "campaign/setDetails", campaign: {image, title, descp, snippet, creator, id, campaignId, startDate, endDate, pledged, nbOfInvestors,claimed}});
      navigate(`/Campaign/${id}`);
    } else {
      const res = await connectWallet();
      dispatch({type: 'user/login', wallet: res[0]});
    }
  }

  return (
    <div className="CampaignCard-container">
      <div className="card-info">
        <img className="card-img" src={image} alt={title} />
        <div>
          <span className="card-title">{title}</span>
          <p className="card-descp">{snippet}</p>
        </div>
      </div>
      <div className="campaign-card-bottom">
        <span className="country">Creator: {String(creator).substring(0, 18)}...{String(creator).substring(38)}
        </span>
        <div className="card-btn" onClick={handleClick}>
          {user?.wallet ? "Invest" : "Connect Wallet"}
          <FaArrowRight />
        </div>
      </div>
      
    </div>
  );
}
