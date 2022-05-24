import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";
import { FaBorderNone, FaRegGem } from "react-icons/fa";
import { FaGem } from "react-icons/fa";
import { connectWallet } from "../utils/CrowdfundInteract";
import { balanceOf } from "../utils/ERC20Interact";
import { useDispatch, useSelector } from "react-redux";

function Navbar(props) {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          dispatch({ type: "user/login", wallet: accounts[0] });
        } else {
          setWallet("");
          dispatch({ type: "user/login", wallet: "" });
        }
      });
    }
  }

  const getBalance = async () => {
    if (wallet) {
      const res = await balanceOf(wallet);
      setBalance(res);
      dispatch({ type: "user/setBalance", balance: res });
    } else {
      console.log("Connect Wallet");
    }
  };

  const handleConnect = async () => {
    const res = await connectWallet();
    dispatch({ type: "user/login", wallet: res[0] });
  };

  const formatAddress = () => {
    return `${String(user.wallet).substring(0, 6)}...${String(user.wallet).substring(
      38
    )}`;
  };

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
        <Link to="/AddCampaign" style={{ textDecoration: "none" }}>
          <li>Add Your Campaign</li>
        </Link>
        <Link to="/Staking" style={{ textDecoration: "none" }}>
          <li>Staking</li>
        </Link>
      </ul>
      <div className="wallet-container">
        <div className="wallet">
          <FaRegGem color="#fff" fontSize="1.5em" />
          <span className="balance">{balance} GMS</span>
        </div>
        <div className="connect-btn" onClick={handleConnect}>
          {user?.wallet ? formatAddress() : "Connect Wallet"}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
