import React, { useEffect, useState } from "react";
import "../styles/main.css";
import axios from "axios";
import uuid from "react-uuid";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { addCampaign, getCampaignDetails, getCampaignsCount } from "../utils/CrowdfundInteract";
import { useSelector } from "react-redux";
import { BigNumber } from "ethers";

export default function AddCampaign() {
  const [creator, setCreator] = useState("");
  const [title, setTitle] = useState("");
  const [snippet, setSnippet] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goal, setGoal] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState(0);
  const [uploading, setUploading] = useState(false);
  const user = useSelector(state => state?.user);


  useEffect(() => {
    (async () => {
      const count = await getCampaignsCount();
      setId(count);
    })();
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newCampaign = {
      id: id,
      creator: creator,
      title: title,
      description: description,
      snippet: snippet,
      thumbnail: thumbnail,
      startAt: Math.floor(new Date(startDate).getTime() / 1000),
      endAt: Math.floor(new Date(endDate).getTime() / 1000),
      goal: parseEther(goal).toString()
    };
    let wei = parseEther(goal).toString();
    let weiBig = BigNumber.from(wei).toString();
    await addCampaign(weiBig, newCampaign.startAt, newCampaign.endAt, user.wallet, newCampaign);
  
  };
  return (
    <div className="formContainer">
      <span className="form-title">
        Please Fill the Below Information To Get Started
      </span>
      <form className="form" onSubmit={handleSubmit}>
        <div className="flex">
          <label className="form-label">
            Name:
            <input
              className="input"
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
            />
          </label>
          <label className="form-label">
            Campaign Title:
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div className="flex">
          <label className="form-label">
            Snippet:
            <input
              className="input"
              type="text"
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
            />
          </label>
          <label className="form-label">
            Thumbnail link:
            <input
              className="input"
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </label>
        </div>
        <div className="flex">
          <label className="form-label">
            Start Date:
            <input
              className="input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="form-label">
            End Date:
            <input
              className="input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <div className="flex">
          <label className="form-label">
            Goal ( In Eth ):
            <input
              className="input"
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </label>
          <label className="form-label">
            Campaign Description:
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <input className="submitBtn" type="submit" />
      </form>
    </div>
  );
}
