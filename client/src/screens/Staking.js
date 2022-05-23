import React from "react";
import { FaGem } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";

export default function Stakings() {
  return (
    <div className="staking">
      <div className="staking-container">
        <span className="title">STAKING</span>
        <div className="card-1">
          <div>
            <FaGem color="#a218d9" fontSize="1.5em" />
            <span className="card-1-title">Total GMS Staked</span>
            <span className="value-staked">420,324</span> GMS
          </div>
          <hr className="seperator"></hr>
          <div>
            <FaLock color="#a218d9" fontSize="1.2em" />
            <span className="card-1-title">Total GMS Locked</span>
            <span className="value-staked">220,114</span> GMS
          </div>
          <hr className="seperator"></hr>
          <div>
            <FaRocket color="#a218d9" fontSize="1.2em" />
            <span className="card-1-title">Accumulated Fees</span>
            <span className="value-staked">60,324</span> GMS
          </div>
          <hr className="seperator"></hr>
        </div>
      </div>
    </div>
  );
}
