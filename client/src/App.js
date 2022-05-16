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
import Navbar from "./screens/Navbar";
import Dashboard from "./screens/Dashboard";
import Campaign from "./screens/Campaign";
import { Provider } from 'react-redux';
import { store } from './redux/store';



function App() {
  const [wallet, setWallet] = useState("");
  const [count, setCount] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [myBalance, setMyBalance] = useState("");
  const [campaigns, setCampaigns] = useState([]);

  // function addWalletListener() {
  //   if (window.ethereum) {
  //     window.ethereum.on("accountsChanged", (accounts) => {
  //       if (accounts.length > 0) {
  //         setWallet(accounts[0]);
  //       } else {
  //         setWallet("");
  //       }
  //     });
  //   }
  // }
  // const connectWalletPressed = async () => {
  //   const res = await connectWallet();
  //   setWallet(res[0]);
  // };
  // useEffect(() => {
  //   (async () => {
  //     await connectWalletPressed();
  //     addWalletListener();
  //   })();
  // }, [wallet]);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route path="/Campaign" element={<Campaign />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
