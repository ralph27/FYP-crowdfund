import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  connectWallet,
  getCampaignsCount,
  pedgeAmount,
} from "./utils/CrowdfundInteract";
import {
  mint,
  getTotalSupply,
  subscribeToTransfer,
  balanceOf,
} from "./utils/ERC20Interact";
import axios from "axios";
import { Chart, Greeting } from "./helpers/Tree";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./screens/Dashboard";
import Campaign from "./screens/Campaign";
import Staking from "./screens/Staking";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import AddCampaign from "./screens/AddCampaign";
import Invest from "./screens/Invest";
import Profile from "./screens/Profile";
import Popup from "./components/Popup";

function App() {  
  const [loading, setLoading] = useState(false);
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        {loading && <Popup setUploading={setLoading}/>}
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route path="/Campaign/:id" element={<Campaign setLoading={setLoading}/>} />
          <Route path="/AddCampaign" element={<AddCampaign loading={loading} setLoading={setLoading}/>} />
          <Route path="/Staking" element={<Staking setLoading={setLoading} />} />
          <Route path="/Invest" element={<Invest setLoading={setLoading} />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
