import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import CustomInput from "../components/input";
import Button from "../components/button";
import contractabi from "../helpers/FixedStaking.json"
import tokenabi from "../helpers/TestToken.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import  txnconfig from "../../utils/config";
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
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Stake = () => {
  const { username, id } = useUserContext();
  console.log("At stake " + username + " " + id);
  const [stake, setStakes] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const { address, isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const [txnModalOpen, setTxnModalOpen] = useState(false);
  const [withdrawalId, setWithdrawalId] = useState(null);
  const ABI = contractabi;
  const TOKEN_ABI = tokenabi.abi;
  const Router = useRouter();
  const [apyIndex, setApyIndex] = useState(0);
  useEffect(() => {
    if (!isConnected) {
      Router.push("./");
    }
  }, [isConnected]);

  const CONTRACT_ADDRESS = "0x864ffE78E7Ec92b5B9FedC2F58005d31AD9b6314";
  const TOKEN_ADDRESS = "0x951eDE122DD3Bb99D09Dd04E6d6B1bD0623A4e49";

  const { writeContract: writeApprove, data: approveHash, isPending: approvPending, isError: IsapproveWalletError, error:approvewalletError } = useWriteContract({ onError: (e) => console.log("inside approve" + e.message) });
  const { writeContract: writeStake, data: stakeHash, isPending: stakePending, isError: IsstakeWalletError,error:stakeWalletError } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed, error: approveError } = useWaitForTransactionReceipt({ hash: approveHash ,config:txnconfig });
  const { isLoading: isStakeConfirming, isSuccess: isStakeConfirmed, error: stakeError,isError:isStakeError } = useWaitForTransactionReceipt({ hash: stakeHash, config:txnconfig });

  const { writeContract: writewithdraw, data: Hash, isPending: Pending, isError: isWithdrawWalletError ,error:WithdrawWalletError } = useWriteContract({ onError: (e) => console.log("inside withdraw" + e.message) });
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: WithdrawError } = useWaitForTransactionReceipt({ hash: Hash,config:txnconfig });
  
  const APY = [12, 26, 58, 80, 120];
  const Duration = [604800,1209600,1814400,2592000,5184000];

  async function approvetoken() {
    setTxnModalOpen(true);
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
          args: [CONTRACT_ADDRESS, stake * 10 ** 9],
        });
     
    }
  }

  async function handleWithdraw(id) {
    if (id != null) {
      setOpen(false);
      console.log("withdrawing token for stake id " + id);
      // try {
      //   writewithdraw({
      //     abi: ABI,
      //     address: CONTRACT_ADDRESS,
      //     functionName: "withdrawTokens",
      //     args: [id],
      //   });
      // } catch (e) {
      //   setError(e.message);
      // }
      alert("Withdrawals are disabled for now"); 
    }
  }

  const handleStake= ()=>{
    console.log("args "+activeIndex + " " + stake);
    
      writeStake(
        {
          abi: contractabi,
          address: CONTRACT_ADDRESS,
          functionName: "stakeTokens",
          args: [activeIndex, stake * 10 ** 9],
        },
        
      );
    
  }
  useEffect(() => {
    if (isConfirmed) {
      updateDB;
    }
  }, [isConfirmed]);

  useEffect(() => {
    console.log("is Approve Confirmed " + isApproveConfirmed);
    if (isApproveConfirmed) {
     handleStake();
    }
  }, [isApproveConfirmed]);

  useEffect(() => {
    if (isStakeConfirmed) {
      setTxnModalOpen(false);
      try {
        saveInDB();
        console.log("stake confirmed saved to DB");
      } catch (e) {
        console.log(e);
      }
    }
  }, [isStakeConfirmed]);

  async function saveInDB() {
    const endDate = Date.now() + Duration[activeIndex] * 24 * 60 * 60 * 1000;
    const idValue = id ? id.toString() : "000"; // If id is not present, use "000"
    const body = {
      id: idValue,
      amount: parseFloat(stake),
      address: address,
      start: Date.now().toString(),
      duration: Duration[activeIndex].toString(),
      end: endDate.toString(),
    };
  
    await fetch("/api/stake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        body,
        (key, value) => (typeof value === "bigint" ? value.toString() : value)
      ),
    });
  }
  

  async function updateDB(stakeId) {
    const body = {
      id: stakeId.toString(),
    };

    await fetch("/api/updateStake", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        body,
        (key, value) => (typeof value === "bigint" ? value.toString() : value)
      ),
    });
  }

  const {
    data: balance,
    error: readerror,
    refetch: refetchTVL,
  } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "getTVL",
    args: [],
  });

  const {
    data: userbalance,
    error: userreaderror,
    refetch: refetchUserBalance,
  } = useReadContract({
    abi: TOKEN_ABI,
    address: TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  const {
    data: stakes,
    error: stakereadError,
    refetch: refetchStakes,
  } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "getStakes",
    args: [address],
  });
  const {
    data: apy,
    error: APYreadError,
    refetch: refetchAPY,
  } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "durationToAPY",
    args: [Duration[apyIndex]],
  });
  useEffect(() => {
    refetchAPY()
   
  },[apyIndex]);
 
  useEffect(() => {
    console.log("refetching data");
    refetchTVL();
    refetchStakes();
    refetchUserBalance();
    refetchRewards();
    
  }, [isStakeConfirmed,isConfirmed]);

 

  const { data: Reward, isError:readRewardError, refetch:refetchRewards} = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "calculateRewardsForUser",
    args: [address],
  });

  function convertTimestampToDate(timestamp) {
    const date = new Date(Number(timestamp) * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleActive = (index) => {
    setActiveIndex(index);
  };

  function isEarlyWithdrawal(completiontime) {
    const currenttime = Date.now() / 1000;
    if (currenttime < completiontime) {
      return true;
    }
    return false;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    background: "#0B0C07",
  };

// console.log(userbalance);
// console.log(Reward);
// console.log("stake Wallet error "+stakeWalletError);
// console.log("is stake wallet error "+IsstakeWalletError);
// console.log("is stake error "+isStakeError);
// console.log("stake error "+stakeError);
// console.log(stakes);
// console.log(address);
// console.log("withdraw wallet error "+WithdrawWalletError);
// console.log("is withdraw error",isWithdrawWalletError);
console.log(apy);
console.log(APYreadError);
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
         
          <div className="detail">
            <div>
              <span>Days</span>
              <ul>
                {[7, 14, 21, 30, 60].map((number, index) => (
                  <li
                    key={index}
                    className={index === activeIndex ? "active" : ""}
                    onClick={() =>{ handleActive(index); setApyIndex(index)}}
                  >
                    {number}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span>APY</span>
              <span>{Number(apy)}%</span>
            </div>
            <div>
              <span>Withdraw Tax</span>
              <span>1%</span>
            </div>
            <div>
              <span>Balance</span>
              {!!userbalance && typeof userbalance === "bigint" ? (
                <span>
                  {(Number(userbalance) / 10**9).toFixed(9)} $scape
                </span>
              ) : (
                <span>
                  0.0 $scape
                </span>
              )}
            </div>
            <div>
              <span className="tvl">TVL</span>
              {!!balance && typeof balance === "bigint" && (
                 <span>{(Number(balance)/ 10**9).toFixed(9)}</span>
)}
            </div>
          </div>
          <Button onClick={approvetoken} className="yellow-btn">
            {isApproveConfirming || isStakeConfirming
              ? "Confirming..."
              : "Stake"}
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
                    <td>{Number(stake.duration) / 86400}D</td>
                    <td>{Number(stake.amount) / 10 ** 9}</td>
                    {!!Reward[index] && typeof Reward[index] === "bigint" ? (
                      <td>{(Number(Reward[index]) / 10**9).toFixed(9)}</td>
                    ) : (
                      <td>{new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 9,
                        maximumFractionDigits: 9
                      }).format(0)}</td>
                    )}


                    <td>{convertTimestampToDate(stake.startTime + stake.duration)}</td>
                    <td>
                    {isEarlyWithdrawal(stake.startTime + stake.duration)
                      ? (stake.isWithdrawn ? "Redeemed" : "Staking")
                      : (stake.isWithdrawn ? "Redeemed" : "Finished")}
                    </td>
                    {!isEarlyWithdrawal(stake.startTime + stake.duration) ? (
                      <td>
                        <button
                          onClick={() => {
                            if (!stake.isWithdrawn) {
                               handleWithdraw(index);
                            }
                          }}
                          className={` ${stake.isWithdrawn ? 'yellow-btn disabled' : 'yellow-btn'}`}
                        >
                          {!stake.isWithdrawn ? "Withdraw" : "Redeemed"}
                        </button>
                      </td>
                    ) : (
                      <td>
                        <button
                          className={` ${stake.isWithdrawn ? 'yellow-btn disabled' : 'withdrawEarly'}`}
                          onClick={() => {
                            if (!stake.isWithdrawn) {
                              setWithdrawalId(index);
                              handleOpen();
                            }
                          }}
                        >
                          {!stake.isWithdrawn ? "WITHDRAW EARLY" : "Redeemed"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="caution"
        >
          <Box sx={style} className="cnt-wrapper">
            <div>
              <h2>Caution!</h2>
              <p>
                Early withdrawal requires 4% withdrawal fee, <br />
                Please confirm your action
              </p>
              <div>
                <button className="withdrawEarly" onClick={()=>handleWithdraw(withdrawalId)}>
                  Withdraw Early
                </button>
                <button className="yellow-btn" onClick={handleClose}>
                  Cancel
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Stake;
