import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import CustomInput from "../components/input";
import Button from "../components/button";
import contractabi from "../helpers/FixedStaking.json";
import tokenabi from "../helpers/TestToken.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { useUserContext } from "../../context/userContext";
import { parseEther, erc20Abi, formatEther } from "viem";
import { useRouter } from "next/navigation";



const Stake = () => {
  const { username ,id} = useUserContext();
  console.log("At stake "+username+" "+id);
  const [stake, setStakes] = useState();
  const [stakesdata, setStakesdata] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { address, isConnected } = useAccount();
  const [rewards, setRewards] = useState([]);
  const ABI = contractabi.abi;
  const TOKEN_ABI = tokenabi.abi;
  const Router = useRouter();
  useEffect(() => {
    if (!username) {
      Router.push("./");
    }
  }, [username]);
  
  async function getStakes() {
    const Stakes = await fetch("/api/getStakes");
    return Stakes.json();
  }
  useEffect(() => {  getStakes().then((d) => setStakesdata(d));}, []);
 //console.log(stakesdata);
  const CONTRACT_ADDRESS = "0xD3b55f5fcE16f66EA908303055D7b02b537829E7";
  const TOKEN_ADDRESS = "0x2a4c6394886502942d4Dd3d0Fd5E0B6245136f0d";

  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: approvPending,
  } = useWriteContract();
  const {
    writeContract: writeStake,
    data: stakeHash,
    isPending: stakePending,
  } = useWriteContract();

  const {
    isLoading: isApproveConfirming,
    isSuccess: isApproveConfirmed,
    error: approveError,
  } = useWaitForTransactionReceipt({ hash: approveHash });
  const {
    isLoading: isStakeConfirming,
    isSuccess: isStakeConfirmed,
    error: stakeError,
  } = useWaitForTransactionReceipt({ hash: stakeHash });

  const {writeContract:writewithdraw,data:Hash, isPending:Pending} = useWriteContract();
  const {isLoading: isConfirming, isSuccess: isConfirmed,error :WithdrawError} = useWaitForTransactionReceipt({hash:Hash});
  const APY = [41, 42, 43, 44, 45];
  const Duration = [7, 14, 21, 30, 60];

  async function approvetoken() {
    if (isConnected) {
      console.log("approving token for " + username);
      console.log(stake);
      writeApprove({
        abi: [
          {
            constant: false,
            inputs: [
              { name: "_spender", type: "address" },
              { name: "_value", type: "uint256" },
            ],
            name: "approve",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
        ],

        address: TOKEN_ADDRESS,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, stake * 10 ** 18],
      });
    }
  }
  async function handleWithdraw(id) {
    console.log("withdrawing token for stake id "+id);
    writewithdraw({
         abi:ABI,
         address: CONTRACT_ADDRESS,
         functionName: "withdrawTokens",
         args: [id],
       });
     
   }
   useEffect(() => {
     if(isConfirmed){
       updateDB
     }
   }, [isConfirmed]);

  useEffect(() => {
    console.log("is Approve Confirmed " + isApproveConfirmed);
    if (isApproveConfirmed) {
      writeStake(
        {
          abi: ABI,
          address: CONTRACT_ADDRESS,
          functionName: "stakeTokens",
          args: [activeIndex, parseEther(stake)],
        },
        []
      );
    }
  }, [isApproveConfirmed]);

  useEffect(() => {
    if (isStakeConfirmed) {
      try {
        saveInDB();
        console.log("stake confirmed saved to DB");
      } catch (e) {
        console.log(e);
      }
    }
  }, [isStakeConfirmed]);
//amount,  address,id , start,duration,end
  
async function saveInDB() {
  const endDate =Date.now() + Duration[activeIndex] * 24 * 60 * 60 * 1000;
  const body = {
    id: id.toString(), // Convert BigInt to string
    amount: parseFloat(stake), // Convert amount to wei
    address: address,
    start: Date.now().toString(),
    duration: (Duration[activeIndex]).toString(),
    end: endDate.toString()
  };

  await fetch("/api/stake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value // Custom replacer function for BigInt
    ),
  });
}

async function updateDB(stakeId) {
  const body = {
    id: stakeId.toString(), // Assuming stakeId is a BigInt
  };

  await fetch("/api/updateStake", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value // Custom replacer function for BigInt
    ),
  });
}



  const { data: balance, error: readerror, refetch:refetchTVL } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "getTVL",
    args: [],
  });
  const { data: userbalance, error: userreaderror, refetch:refetchUserBalance } = useReadContract({
    abi: TOKEN_ABI,
    address: TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });
  const { data: stakes, error: stakereadError ,refetch:refetchStakes} = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "getStakes",
    args: [address],
  });
  
  useEffect(() => {
    // Call the functions to refetch data from the contracts
    console.log("refetching data");
    refetchTVL();
    refetchStakes();
    refetchUserBalance();
  }, [isStakeConfirmed]); 

  // console.log(stakes);

  console.log(stakereadError);
  
    const { data: Reward, error: rewardreadError } = useReadContract({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: "calculateRewardsForUser",
      args: [address],
    });
    // console.log("reward");
    // console.log(Reward);
  

    function convertTimestampToDate(timestamp) {
      // Create a new Date object using the timestamp multiplied by 1000
      // because JavaScript uses milliseconds and Solidity uses seconds for timestamps
      // console.log("time "+timestamp);
      
      const date = new Date(Number(timestamp) * 1000);
    
      // Extract the year, month, and day using the appropriate methods
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
    
      // Format the date as a string in the format "YYYY-MM-DD"
      return `${year}-${month}-${day}`;
    }
    
  const handleActive = (index) => {
    setActiveIndex(index);
  };
  // console.log("approve error "+approveError);
  // console.log("stake error "+stakeError);
  // console.log("TVL "+balance)
  // console.log("approve confiming "+isApproveConfirming)
  // console.log("stake confirming "+isStakeConfirming)
  // console.log("approve confirmed "+isApproveConfirmed)
  // console.log("stake confirmed "+isStakeConfirmed)
  // console.log(userreaderror)
  // console.log(userbalance)
   //console.log(WithdrawError);
   //console.log("pending "+Pending);
  useEffect(() => {
    if (stakeError) {
      alert(stakeError.message);
    }
  }, [stakeError]);
  return (
    <div className="stake-page bg">
      <div>
        <Sidebar />
        <div className="black-card-wrapper">
          <ConnectButton />
          <CustomInput
            value={stake}
            onChange={(e) => {
              setStakes(e.target.value);
            }}
            placeholder="Enter amount to stake"
          />
          {!!userbalance && typeof userbalance === "bigint" && (
            <span
              style={{ color: "rgba(245, 241, 5)", fontFamily: "sans-serif" }}
            >
              Balance {formatEther(userbalance)} $scape
            </span>
          )}
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
              {!!balance && typeof balance === "bigint" && (
                <span>{formatEther(balance)}</span>
              )}
            </div>
          </div>
          <Button onClick={approvetoken} className="yellow-btn">
          {(isApproveConfirming || isStakeConfirming) ? "Confirming..." : "Stake"}
        </Button>

        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Pool</th>
                <th>Staking Amount</th>
                <th>Cumulative Rewards</th>
                <th>Redemption Date</th>
                <th>Staking Status</th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              {stakes &&
                stakes.length > 0 &&
                stakes.map((stake, index) => (
                  <tr key={index}>
                    <td>{Number(stake.duration)/86400}D</td>
                    <td>{Number(stake.amount)/10**18}</td>
                     {!!Reward[index] && typeof Reward[index] === "bigint" && (<td>{formatEther(Reward[index])}</td>)}
                    <td>{ convertTimestampToDate(stake.startTime+stake.duration)}</td>
                    <td>{stake.isWithdrawn ? "Reedemed" : "Staking"}</td>
                    <td><button onClick={()=>{if(!stake.isWithdrawn){handleWithdraw(index)}}} className="yellow-btn">{!stake.isWithdrawn?"Redeem Now":"Reedemed"}</button></td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stake;
