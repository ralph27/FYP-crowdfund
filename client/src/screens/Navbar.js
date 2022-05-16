import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";
import { FaBorderNone, FaRegGem } from "react-icons/fa";
import { FaGem } from "react-icons/fa";
import { connectWallet } from "../utils/CrowdfundInteract";
import { balanceOf } from "../utils/ERC20Interact";

function Navbar(props) {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState(0);

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

  const getBalance = async () => {
    if (wallet) {
      const res = await balanceOf(wallet)
      console.log(res);
    } else {
      console.log("Connect Wallet");
    }
  }

  
  const handleConnect = async () => {
    const res = await connectWallet();
    setWallet(res[0]);
  }

  const formatAddress = () => {
    return `${String(wallet).substring(0, 6)}...${String(wallet).substring(38)}`
  }
  
  useEffect(() => {
    ( async () => {
      await handleConnect();
      addWalletListener();
      getBalance();
    }
    )();
  }, [wallet]);


  return (
    <nav className="navbar">
      <div className="logo-container">
        <FaGem color="#a218d9" fontSize="3em" />
        <span>GemStone</span>
      </div>
      <ul className="links">
        <Link to="/" style={{ textDecoration: "none" }}>
          <li>Dashboard</li>
        </Link>
        <li>Campaign</li>
        <li>Staking</li>
      </ul>
      <div className="wallet-container">
        <div className="wallet">
          <FaRegGem color="#fff" fontSize="1.5em" />
          <span className="balance">{balance} GMS</span>
        </div>
        <div className="connect-btn" onClick={handleConnect}>{wallet ? formatAddress() : "Connect Wallet"}</div>
      </div>
    </nav>
  );
}

export default Navbar;
