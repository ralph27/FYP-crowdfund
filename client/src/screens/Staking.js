import React, { useEffect, useState } from "react";
import { FaGem } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getCirculation, getTotalSupply, getUserStakes, stake, totalAmount, withdrawStake } from "../utils/ERC20Interact";
import moment from "moment";
import Popup from "../components/Popup";

export default function Stakings() {
  const dispatch = useDispatch();
  const token = useSelector(state => state?.token);
  const fetch = useSelector(state => state?.fetch);
  const user = useSelector(state => state?.user);
  const [amount, setAmount] = useState();
  const [stakes, setStakes] = useState([]);
  const [totalStaked, setTotalStaked] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const handleStake = async () => {
    const stakeInfo = {
      user: user?.wallet,
      amount: amount,
      claimed: false,
      date: moment().unix()
    }
    await stake(amount, user?.wallet, stakeInfo, setUploading, dispatch);
    setAmount(0);
  }

  const calculateReward = (date, amount) => {
    const res =  (((moment().unix() - date) / 60) * amount) / 1000;
    return res;
  }

  const handleClaim = async (stake) => {
    const amountAfterMint = Number(stake.amount) + Number(stake.reward);
    await withdrawStake(stake.amount, Math.ceil(stake.reward), Math.ceil(amountAfterMint).toString(), user?.wallet, stake.id, setUploading, dispatch);
  }


  useEffect(() => {
    (async () => { 
      const sup = await getTotalSupply();
      const cir = await getCirculation();
      if (user?.wallet) {
        setTotalStaked(0);
        setStakes([]);
        const stakes = await getUserStakes(user?.wallet);
        console.log(stakes);
        if (stakes.length > 0) {
          stakes.map((stake, index) => {
            if (stake.claimable) {
              setTotalStaked(prev => prev + Number(stake.amount));
              setStakes(prev => ([
                ...prev,
                {
                  amount: stake.amount,
                  date: stake.since,
                  reward: calculateReward(stake.since, stake.amount),
                  id: index
                }
              ]))
            }
          })
        }
      }
      const stake = await totalAmount();
      dispatch({type: "token/setInfo", token: {supply: sup, circulation: cir, staked: stake}});
    })();
  }, [fetch])




  return (
    <div className="staking">
      {uploading && <Popup setUploading={setUploading}/>}
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
                <FaRocket color="#FF007A" size={25} />
                <p className="card-1-title">Total GMS In Circulation</p>
              </div>
              <p><span className="value-staked">{token?.circulation}</span> GMS</p>
            </div>
            <div className="card-info-wrapper">
              <div className="card-1-label">
                <FaLock color="#FF007A" size={25} />
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
                    <p>Claimable: {Number(stake.reward).toFixed(2)} GSM</p>
                    <p className="claim-btn" onClick={() => handleClaim(stake)}>Claim</p>
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
