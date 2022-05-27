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

function App() {  

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route path="/Campaign/:id" element={<Campaign />} />
          <Route path="/AddCampaign" element={<AddCampaign />} />
          <Route path="/Staking" element={<Staking />} />
          <Route path="/Invest" element={<Invest />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
