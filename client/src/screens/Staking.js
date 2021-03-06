import React, { useEffect, useState } from "react";
import { FaGem } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getCirculation, getTotalSupply, totalAmount } from "../utils/ERC20Interact";
import {stake, getUserStakes, withdrawStake, getStakesCount, getEthReserve, getGmsReserve} from "../utils/CpammInteract"
import moment from "moment";
import { ParseGMS } from "../helpers/ParseGMS";

export default function Stakings({setLoading}) {
  const dispatch = useDispatch();
  const token = useSelector(state => state?.token);
  const user = useSelector(state => state?.user);
  const [amount, setAmount] = useState();
  const [stakes, setStakes] = useState([]);
  const [totalStaked, setTotalStaked] = useState(0);
  const [lock, setLock] = useState(false)
  
  const stakesList = useSelector(state => state?.staking);
  console.log(stakesList);

  const handleStake = async () => {
    const id = await getStakesCount();
    const stakeInfo = {
      user: user?.wallet,
      amount: ParseGMS(amount * (10 ** 18)),
      claimed: false,
      date: moment().unix(),
    }
    console.log("stake", stakeInfo)
    await stake(user?.wallet, stakeInfo, setLoading, dispatch, calculateReward, id, setTotalStaked);
    

    setAmount(0);
  }

  const calculateReward = (date, amount) => {
    console.log(amount / (10 ** 18));
    const res =  (((moment().unix() - date) / 60) * amount);
    console.log("reward", res );
    return res;
  }

  const handleClaim = async (stake) => {
    console.log("amountTOClaim: ", stake.reward / (10 ** 18));

    // let initialAmount = ParseGMS(stake.amount);
    console.log("initialAmount: ", stake.amount / (10 ** 18));
    console.log("id", stake.id);
    // let reward = ParseGMS(stake.reward);
    // console.log("reward: ", reward);

    await withdrawStake(stake.amount, stake.reward, user?.wallet, stake.id, setLoading, dispatch, user?.balance, setTotalStaked);
  }


  useEffect(() => {
    (async () => { 
      const sup = await getTotalSupply();
      const ethReserve = await getEthReserve();
      const gmsReserve = await getGmsReserve();
      if (user?.wallet) {
        const blockStakes = await getUserStakes(user?.wallet);
        formatStakes(blockStakes)
        setLock(prev => true);
      }
      
      dispatch({type: "token/setInfo", token: {supply: sup, ethReserve: ethReserve, gmsReserve: gmsReserve}});
    })();
  }, []) 

  useEffect(() => {
    dispatch({type: "staking/updateStaking", stake: stakes})
  }, [stakes]);

  const formatStakes = (blockStakes) => {
    setStakes([]);
    setTotalStaked(0);
    if (!lock) {
      blockStakes.map((stake, index) => {
        if (stake.claimable) {
          setTotalStaked(prev => prev + Number(stake.amount / (10 ** 18)));
          setStakes(prev => ([
            ...prev, {
              amount: stake.amount,
              date: stake.since,
              reward: calculateReward(stake.since, stake.amount),
              id: index
            }
          ]
          ))
        }
      })
    }
  }


  return (
    <div className="staking">
      <h1 className="title">STAKING</h1>
      <div className="staking-container">
        <div className="left-container">

          { /*first card */ }
          <div className="card-1">
          <div className="card-info-wrapper">
              <div className="card-1-label">
                <FaLock color="#FF007A" size={25} />
                <p className="card-1-title">Total GMS supply</p>
              </div>
              <p><span className="value-staked">{Number(token?.supply / (10 ** 18)).toFixed(3)}</span> GMS</p>
            </div>
            <div className="card-info-wrapper">
              <div className="card-1-label">
                <FaGem color="#FF007A" size={25} />
                <p className="card-1-title">GMS Reserve</p>
              </div>
              <p><span className="value-staked">{Number(token?.gmsReserve / (10 ** 18)).toFixed(3)}</span> GMS</p>
            </div>
            <div className="card-info-wrapper">
              <div className="card-1-label">
                <FaRocket color="#FF007A" size={25} />
                <p className="card-1-title">ETH Reserve</p>
              </div>
              <p><span className="value-staked">{Number(token?.ethReserve / (10 ** 18)).toFixed(3)}</span> ETH</p>
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
                <p>Wallet Balance: {Number(user?.shares) / (10 ** 18)} LT</p>
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
              <p>Total: {stakesList?.length > 0 ? totalStaked : "-"} GSM</p>
            </div>
            <div 
              style={
                {
                  border: stakesList?.length > 0 ? '1px solid rgb(44, 47, 54)' : 'none',
                  borderRadius: stakesList?.length > 0 ? '16px' : '0',
                  padding: stakesList?.length > 0 ? "30px 20px" : '0',
                  marginTop: stakesList?.length > 0 ? "30px" : "0",
                }
              }
              >
              {stakesList?.length > 0 ? stakesList.map(stake => {
                return (
                  <div className="card-3-stakes">
                    <div>
                      <FaGem color="#FF007A" size={20} />
                      <p>{stake.amount / (10 ** 18)} GSM</p>
                    </div>
                    <p>Claimable: {Number(stake.reward / (10 ** 18)).toFixed(2) } GSM</p>
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
