import env from "react-dotenv";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";
import { FaBorderNone, FaRegGem } from "react-icons/fa";
import { FaGem } from "react-icons/fa";
import { connectWallet } from "../utils/CrowdfundInteract";
import { balanceOf, getTotalSupply, mintTokens } from "../utils/ERC20Interact";
import { useDispatch, useSelector } from "react-redux";

function Navbar(props) {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const [scrolled, setScrolled] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0)
  const changeBackground = () => {
    if (window.scrollY >= 66) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }

  useEffect(() => {
    changeBackground();
    window.addEventListener("scroll", changeBackground);
  }, [])

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

  const formatAddress = () => {
    return `${String(user.wallet).substring(0, 6)}...${String(user.wallet).substring(
      38
    )}`;
  };

  const getAccount = async () => {
    const res = await connectWallet();
    const bal = await balanceOf(res[0]);
    dispatch({ type: "user/login", wallet: {address: res[0], balance: bal} });

  }

  useEffect(() => {
     ( async () => {
      await getAccount();
      const supply = await getTotalSupply();
      console.log(supply);
      setTotalSupply(supply)
      addWalletListener();
     }
     )();
   }, [user?.wallet]);

   const mint = async () => {
     
     await mintTokens(user?.wallet, 1000000)
   }

  return (
    <nav className="navbar" style={{backgroundColor: scrolled ? 'rgba(25, 27, 31, 0.9)' :   '#191B1F'
  }}>
      <div className="logo-container">
        <FaGem color="#FF007A" fontSize="3em" />
        <span onClick={mint}>GemStone</span>
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
          <span className="balance">{totalSupply} GMS</span>
        </div>
        <div className="connect-btn" onClick={getAccount}>
          {user?.wallet ? formatAddress() : "Connect Wallet"}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
