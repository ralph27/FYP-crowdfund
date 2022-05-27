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
      startAt: startDate,
      endAt: endDate,
      goal: parseEther(goal).toString()
    };
    let wei = parseEther(goal).toString();
    let weiBig = BigNumber.from(wei).toString();
    await addCampaign(weiBig, startDate, endDate, user.wallet, newCampaign);
  
  };
  return (
    <div className="formContainer">
      <div className="form-wrapper">
        <span className="form-title">
          Please Fill the Below Information To Get Started
        </span>
        <form className="form" onSubmit={handleSubmit}>
          <div className="flex-left-side"> 

            <input
              className="input"
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              placeholder="Name"
            />
       
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />

            <input
              className="input"
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Goal ( in ETH )"
            />

            <input
              className="input"
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Thumbnail"
            />

            <input
              className="input"
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />

            <input
              className="input"
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />

          </div>
          <div className="flex-right-side">

            <textarea
              className="textarea top"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows='9'
            />

            <textarea
              className="textarea bottom"
              type="text"
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              maxLength='150'
              placeholder="Snippet"
              rows='5'
              
            />
          </div>
        </form>
          <button className="submitBtn" onClick={handleSubmit} >Submit</button>
      </div>
    </div>
  );
}
