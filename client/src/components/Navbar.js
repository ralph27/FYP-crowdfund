import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";
import { FaRegGem, FaEthereum } from "react-icons/fa";
import { FaGem } from "react-icons/fa";
import { connectWallet } from "../utils/CrowdfundInteract";
import { balanceOf, mintTokens, sendToContract } from "../utils/ERC20Interact";
import { useDispatch, useSelector } from "react-redux";
import { getEthBalance } from "../utils/EthInteract";

function Navbar(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const [scrolled, setScrolled] = useState(false);
  const changeBackground = () => {
    if (window.scrollY >= 60) {
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
          dispatch({ type: "user/login", wallet: accounts[0] });
        } else {
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
    const ethBal = await getEthBalance(res[0].toLowerCase());
    dispatch({ type: "user/login", wallet: {address: res[0], balance: bal, ethBal: ethBal} });
  }

  useEffect(() => {
     ( async () => {
      dispatch({type: "fetch/setFetch", status: true})
      await getAccount();
      addWalletListener();
      dispatch({type: "fetch/setFetch", status: false})
     }
     )();
   }, [user?.wallet]);

   const mint = async () => {
    // await mintTokens(user?.wallet, 1000000 * (10 ** 3));
     await sendToContract("0xC40B52D3e7b7b4Ed6e048CaEA2E37081c6BC9bDF", user?.wallet, 100, dispatch)
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
        <Link to="/Withdraw" style={{ textDecoration: "none" }}>
          <li>Transfer</li>
        </Link>
        <Link to="/Profile" style={{ textDecoration: "none" }}>
          <li>Profile</li>
        </Link>
      </ul>
      <div className="wallet-container">
        <div className="wallet">
          <FaRegGem color="#fff" fontSize="1.5em" />
          <span className="balance">{Number(user?.balance / (10 ** 3)).toFixed(2)} GMS</span>  
        </div>
        <div className="wallet">
          <FaEthereum color="white" fontSize="1.4em" />
          <span className="balance">{Number(user?.ethBalance / (10 ** 18)).toFixed(3)} ETH</span>
        </div>
        <div className="connect-btn" onClick={getAccount}>
          {user?.wallet ? formatAddress() : "Connect Wallet"}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
