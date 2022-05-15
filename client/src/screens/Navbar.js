import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";
import { FaBorderNone, FaRegGem } from "react-icons/fa";
import { FaGem } from "react-icons/fa";

function Navbar(props) {
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
          <span className="balance">2.987 GMS</span>
        </div>
        <div className="connect-btn">Connect Wallet</div>
      </div>
    </nav>
  );
}

export default Navbar;
