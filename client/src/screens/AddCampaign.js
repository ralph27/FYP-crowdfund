import React, { useEffect, useState } from "react";
import "../styles/main.css";
import { parseEther } from "ethers/lib/utils";
import { addCampaign, getCampaignsCount } from "../utils/CrowdfundInteract";
import { useDispatch, useSelector } from "react-redux";
import { BigNumber } from "ethers";
import moment from 'moment'

export default function AddCampaign({ setLoading }) {
  const [creator, setCreator] = useState("");
  const [title, setTitle] = useState("");
  const [snippet, setSnippet] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [goal, setGoal] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState(0);
  const [err, setErr] = useState("");
  const user = useSelector(state => state?.user);

  const dispatch = useDispatch();
  const disabled = title === "" || snippet === "" || thumbnail === "" || description === "" || goal === "";
  
  useEffect(() => {
    (async () => {
      try {
        const count = await getCampaignsCount();
        setId(count);

      } catch (err) {
        console.log("ERROR IN ADD CAMPAIGN: ", err);
      }
    })();
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled) {
      setErr("Fill All Field");
    } else {
      let startStr = moment(startDate).unix();
      let endStr = moment(endDate).unix();
      const newCampaign = {
        id: id,
        creator: user?.wallet,
        title: title,
        description: description,
        snippet: snippet,
        thumbnail: thumbnail,
        startAt: startStr,
        endAt: endStr,
        goal: parseEther(goal).toString(),
        nbOfInvestors: 0,
        pledged: 0,
        claimed: false,
        investors: [],
      };
      let wei = parseEther(goal).toString();
      let weiBig = BigNumber.from(wei).toString();
      console.log('wei', weiBig);
      await addCampaign(weiBig, startStr, endStr, user.wallet, newCampaign, setLoading, dispatch);
      setErr("");
      setId(0);
      setCreator("");
      setTitle("");
      setDescription("");
      setSnippet("");
      setThumbnail("");
      setStartDate(new Date());
      setEndDate(new Date());
      setGoal("");
    }
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

            <label className="add-campaign-label">
              Start Date
            </label>
              <input
                className="date-input"
                value={startDate}
                type="datetime-local"
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />

            <label className="add-campaign-label">End Date</label>
            <input
              className="date-input"
              value={endDate}
              type="datetime-local"
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
          <p className="error">{err}</p>
          <button className="submitBtn" onClick={handleSubmit} >Submit</button>
      </div>
    </div>
  );
}
