import React, { useState } from "react";
import "../styles/main.css";
import axios from "axios";
import uuid from "react-uuid";

export default function AddCampaign() {
  const [creator, setCreator] = useState("");
  const [title, setTitle] = useState("");
  const [snippet, setSnippet] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const newCampaign = {
      id: parseInt(uuid()),
      creator: creator,
      title: title,
      description: description,
      snippet: snippet,
      thumbnail: thumbnail,
      startAt: startDate,
      endAt: endDate,
    };
    console.log(newCampaign.id);
    axios
      .post("http://localhost:8080/addCampaign", newCampaign)
      .then((res) => {
        console.log(res.response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="form-label">
            End Date:
            <input
              className="input"
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <label className="form-label">
          Campaign Description:
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <input className="submitBtn" type="submit" />
      </form>
    </div>
  );
}
