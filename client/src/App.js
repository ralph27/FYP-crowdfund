import "./App.css";
import React, { useEffect, useState } from "react";
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

function App() {
  const [wallet, setWallet] = useState("");
  const [count, setCount] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [myBalance, setMyBalance] = useState("");
  const [campaigns, setCampaigns] = useState([]);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
        }
      });
    }
  }
  const connectWalletPressed = async () => {
    const res = await connectWallet();
    setWallet(res[0]);
  };
  useEffect(() => {
    (async () => {
      await connectWalletPressed();
      addWalletListener();
    })();
  }, [wallet]);

  return <h1>Hello world</h1>;
}

export default App;
