import React, { useState,useEffect } from "react";
import Sidebar from "../components/sidebar";
import CustomInput from "../components/input";
import Button from "../components/button";
import contractabi from "../helpers/FixedStaking.json"
import tokenabi from "../helpers/TestToken.json";
import styles from "./stake.module.css";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  
} from "wagmi";
import {useUserContext} from "../../context/userContext"
import { parseEther, erc20Abi, formatEther } from "viem";
import { useRouter } from "next/navigation";
const Stake = () => {
  const {username} = useUserContext();
  console.log(username)
  const [stake, setStakes] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const {isConnected} = useAccount();
  const ABI = contractabi.abi;
  const TOKEN_ABI = tokenabi.abi;
  const Router = useRouter();
  useEffect(() => {if(!username){Router.push("./")}},[username])

  const CONTRACT_ADDRESS="0x6bE10596970838b5f42695ecf869013d6D52DCA6";
  const TOKEN_ADDRESS = "0x2a4c6394886502942d4Dd3d0Fd5E0B6245136f0d";

 const {writeContract:writeApprove,data:approveHash, isPending:approvPending} = useWriteContract();
 const {writeContract:writeStake,data:stakeHash, isPending:stakePending} = useWriteContract();
 
 const {isLoading: isApproveConfirming, isSuccess: isApproveConfirmed,error :approveError} = useWaitForTransactionReceipt({hash: approveHash});
 const {isLoading: isStakeConfirming, isSuccess: isStakeConfirmed ,error:stakeError} = useWaitForTransactionReceipt({hash: stakeHash});
 const APY = [41,42,43,44,45];
 
 async function approvetoken() {
  if (isConnected) {
    console.log("approving token for "+username)
    console.log(stake)
    writeApprove({
      abi:  [
        {
          constant: false,
          inputs: [
            { name: '_spender', type: 'address' },
            { name: '_value', type: 'uint256' },
          ],
          name: 'approve',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
     
      address: TOKEN_ADDRESS,
      functionName: "approve",
      args: [CONTRACT_ADDRESS, stake*10**18],
    });
  }
}

    useEffect(() => {
      console.log("isApproveConfirmed")
      if (isApproveConfirmed) {
        writeStake({
          abi: ABI,
          address: CONTRACT_ADDRESS,
          functionName: "stakeTokens",
          args:[activeIndex, parseEther(stake)],
      
      })
        
        
      
      }
      
    }, [isApproveConfirmed]);

    useEffect(() => {
    if (isStakeConfirmed) {
      try{
      saveInDB();
      console.log("stake confirmed saved to DB")
    }
      catch(e){
        console.log(e)
      }
    }

    }, [isStakeConfirmed]);
   
    async function saveInDB() {
      const body = {
        username: username,
        amount: stake,
      };
      await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      setUpdate(body);
    }

 const { data: balance,error:readerror } = useReadContract({
  abi: ABI,
  address: CONTRACT_ADDRESS,
  functionName: "getTVL",
  args: [],
});
 
 const handleActive = (index) => {
    setActiveIndex(index);
  };
  return (
    <div className="stake-page bg">
      <div>
        <Sidebar />
        <div className="black-card-wrapper">
          <ConnectButton />
          <CustomInput
             value={stake}
            onChange={(e) => {setStakes(e.target.value)}}
            placeholder="Enter amount to stake"
          />
          <div className="detail">
            <div>
              <span>Days</span>
              <ul>
                {[7, 14, 21, 30, 60].map((number, index) => (
                  <li
                    key={index}
                    className={index === activeIndex ? "active" : ""}
                    onClick={() => handleActive(index)}
                  >
                    {number}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span>APY</span>
              <span>{APY[activeIndex]}%</span>
            </div>
            <div>
              <span>Withdraw Tax</span>
              <span>1%</span>
            </div>
            <div>
              <span className="tvl">TVL</span>
              {!!balance && typeof balance === 'bigint' && ( <span>{formatEther(balance)}</span>  )}
            </div>
          </div>
          <Button onClick={approvetoken} className="yellow-btn">{isApproveConfirming ? "Confirming..." : "stake"}</Button>
          {stakeError&&(<div><span>{stakeError}</span></div>)}
        </div>
      </div>
    </div>
  );
};

export default Stake;
