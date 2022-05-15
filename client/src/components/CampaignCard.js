import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CampaignCard({ image, title, descp, country }) {
  return (
    <div className="CampaignCard-container">
      <div className="card-info">
        <img className="card-img" src={image} alt={title} />
        <div>
          <span className="card-title">{title}</span>
          <p className="card-descp">{descp}</p>
        </div>
      </div>
      <span className="country">{country}</span>
      <Link to="/Campaign" style={{ textDecoration: "none" }}>
        <div className="card-btn">
          Invest
          <FaArrowRight />
        </div>
      </Link>
    </div>
  );
}
