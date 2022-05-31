import React, { useEffect, useState } from "react";
import { FaGem } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getCirculation, getStakes, getTotalSupply, stake, totalAmount } from "../utils/ERC20Interact";
import moment from "moment";
import axios from "axios";

export default function Stakings() {
  const dispatch = useDispatch();
  const token = useSelector(state => state?.token);
  const user = useSelector(state => state?.user);
  const [amount, setAmount] = useState();
  const [stakes, setStakes] = useState([]);
  const [totalStaked, setTotalStaked] = useState(0);
  
  const handleStake = async () => {
    const stakeInfo = {
      user: user?.wallet,
      amount: amount,
      claimed: false,
      date: moment().unix()
    }
    await stake(amount, user?.wallet, stakeInfo);
  }


  useEffect(() => {
    (async () => {
      const sup = await getTotalSupply();
      const cir = await getCirculation();
      const stake = await totalAmount();
      if (user?.wallet) {
        const data = await axios.get("http://localhost:8080/getStakes", {params: {user: user?.wallet}})
        console.log(data.data);
        setStakes(data.data);
      }   
      dispatch({type: "token/setInfo", token: {supply: sup, circulation: cir, staked: stake}});
    })();
  }, [user?.wallet])

  useEffect(() => {
    stakes.map(stake => setTotalStaked(prev => prev + Number(stake.amount)));
  }, [stakes])


  return (
    <div className="staking">
      <h1 className="title">STAKING</h1>
      <div className="staking-container">
        <div className="left-container">

          { /*first card */ }
          <div className="card-1">
            <div className="card-info-wrapper">
              <div className="card-1-label">
                <FaGem color="#FF007A" size={25} />
                <p className="card-1-title">Total GMS Supply</p>
              </div>
              <p><span className="value-staked">{token?.supply}</span> GMS</p>
            </div>
            <div className="card-info-wrapper">
              <div className="card-1-label">
                <FaLock color="#FF007A" size={25} />
                <p className="card-1-title">Total GMS In Circulation</p>
              </div>
              <p><span className="value-staked">{token?.circulation}</span> GMS</p>
            </div>
            <div className="card-info-wrapper">
              <div className="card-1-label">
                <FaRocket color="#FF007A" size={25} />
                <p className="card-1-title">Total GMS Staked</p>
              </div>
              <p><span className="value-staked">{token?.staked}</span> GMS</p>
            </div>
          </div>

          { /*second card */ }
          <div className="card-2">
            <div className="card-2-top-info">
              <h3>Stake GMS</h3>
              <h3>APR: <span>52,000%</span></h3>
            </div>
            <p className="card-2-description">Stake GMS and earn up to 0.1% a minute</p>
            <div className="card-2-input-wrapper">
              <div className="card-2-top-input">
                <p>Amount</p>
                <p>Wallet Balance: {user?.balance} GMS</p>
              </div>
              <div className="stake-input">
                <input 
                  placeholder='0.0' 
                  type='text' 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="stake-btn-wrapper">
              <button className="stake-btn" onClick={handleStake}>Stake</button>
            </div>
          </div>
        </div>
        <div className="right-container">

          { /*third card */ }
          <div className="card-3">
            <div className="card-3-top">
              <h3>GSM Staked</h3>
              <p>Total: {stakes.length > 0 ? totalStaked : "-"} GSM</p>
            </div>
            <div 
              style={
                {
                  border: stakes.length > 0 ? '1px solid rgb(44, 47, 54)' : 'none',
                  borderRadius: stakes.length > 0 ? '16px' : '0',
                  padding: stakes.length > 0 ? "30px 20px" : '0',
                  marginTop: stakes.length > 0 ? "30px" : "0",
                }
              }
              >
              {stakes.length > 0 ? stakes.map(stake => {
                return (
                  <div className="card-3-stakes">
                    <div>
                      <FaGem color="#FF007A" size={20} />
                      <p>{stake.amount} GSM</p>
                    </div>
                    <p>Claimable: {stake.claimable} GSM</p>
                    <p className="claim-btn">Claim</p>
                  </div>
                )
              }) 
              : 
                <div className="card-3-empty">
                  <h2>No stakes found</h2>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
