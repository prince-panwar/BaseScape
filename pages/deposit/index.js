import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import CustomInput from "../components/input";
import Button from "../components/button";
import styles from "./deposit.module.css";
import tokenabi from "../helpers/Etherscape.json";
import txnconfig from  "../../utils/config";

import { useUserContext } from "../../context/userContext";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { parseEther, erc20Abi, formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";

const Deposit = () => {
  const { address, isConnected } = useAccount();
  const { username, id } = useUserContext();
  const [amount, setAmount] = useState();
  const Router = useRouter();
  
  const TOKEN_ADDRESS="0x951eDE122DD3Bb99D09Dd04E6d6B1bD0623A4e49";
  const RECIPIENT_ADDRESS = "0x78599F131DC867B66BC4c46019a96BB4C2ffd5d8";
  const [deposits, setDeposits] = useState([]);
  const [sortedDeposits, setSortedDeposits] = useState([]);
  const { data: balance, error: readerror, refetch: refetchReciverBalance } =
    useReadContract({
      abi: tokenabi,
      address: TOKEN_ADDRESS,
      functionName: "balanceOf",
      args: [RECIPIENT_ADDRESS],
    });
  const {
    data: userbalance,
    error: userreaderror,
    refetch: refetchUserBalance,
  } = useReadContract({
    abi: tokenabi,
    address: TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  const { writeContract: writeDeposit, data: depositHash, isPending: depositPending, error: depositError } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed, status } = useWaitForTransactionReceipt({ hash: depositHash, config:txnconfig});
  useEffect(() => {
    if (!username) {
      Router.push("./");
    }
  }, [username]);

  useEffect(() => {
    getDeposits().then((d) => {
      setDeposits(d);
      
    });
    sortDeposits();
  }, []);

  const getDeposits = async () => {
    const Deposits = await fetch("/api/getDeposits");
    return Deposits.json();
  };

  const handleDeposit = () => {
    console.log("depositing");
    writeDeposit({
      abi: tokenabi,
      address: TOKEN_ADDRESS,
      functionName: "transfer",
      args: [RECIPIENT_ADDRESS, amount * 10 ** 9],
    });
  };

  useEffect(() => {
    if (isDepositConfirmed) {
      saveInDB();
      refetchUserBalance();
      refetchReciverBalance();
    }
  }, [isDepositConfirmed]);

  useEffect(() => {
    if (depositError) {
      alert(depositError.message);
    }
  }, [depositError]);

  const saveInDB = async () => {
    const body = {
      username: username,
      id: id.toString(),
      amount: parseFloat(amount),
      address: address,
    };
    await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const updatedDeposits = await getDeposits();
    setDeposits(updatedDeposits);
    sortDeposits();
  };

  const sortDeposits = () => {
    const isCurrentUserPresent = deposits.some((deposit) => deposit.username === username);

    // Sort the deposits array to bring current user's deposits to the top if present
    const sortedDeposits = isCurrentUserPresent
      ? [...deposits].sort((a, b) => {
          if (a.username === username) return -1;
          if (b.username === username) return 1;
          return 0;
        })
      : [...deposits];

    setSortedDeposits(sortedDeposits);
  };

  useEffect(()=>{
    sortDeposits()
  },[deposits]);

  //console.log("deposits", deposits);
  // console.log("isDepositConfirmed", isDepositConfirmed);
  // console.log("isDepositConfirming", isDepositConfirming);
  // console.log("status", status);
  console.log("sortedDeposits", sortedDeposits);
  return (
    <div className="deposit-page bg">
      <div>
        <Sidebar />
        <div className="black-card-wrapper">
          <ConnectButton />
          <div className="detail">
            <div>
              <p>Balance</p>
              {!!userbalance && typeof userbalance === 'bigint' ? (
                <span style={{ color: "#f4ffb0", fontFamily: "Inter", fontSize: "17px" }}>{Number(userbalance)/10**9 + " $scape"}</span>
              ) : (
                <span style={{ color: "#f4ffb0", fontFamily: "Inter", fontSize: "17px" }}>{0.0 + " $scape"}</span>
              )}
            </div>
            <div>
              <p>Locked Tokens</p>
              {!!balance && typeof balance === 'bigint' ? (
                <span style={{ color: "#f4ffb0", fontFamily: "Inter", fontSize: "17px" }}>{Number(balance)/10**9 + " $scape"}</span>
              ) : (
                <span style={{ color: "#f4ffb0", fontFamily: "Inter", fontSize: "17px" }}>{0.0 + " $scape"}</span>
              )}
            </div>
          </div>
          <CustomInput
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to deposit"
          />
          <Button onClick={handleDeposit} className="yellow-btn">
            {isDepositConfirming ? "Confirming..." : "deposit"}
          </Button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User name</th>
                <th>Amount</th>
                <th>Claimed</th>
              </tr>
            </thead>
            <tbody>
              {sortedDeposits &&
                sortedDeposits.length > 0 &&
                sortedDeposits.map((deposit, index) => (
                  <tr key={index}>
                    <td>{deposit.username}</td>
                    <td>{deposit.amount + " $Scape"}</td>
                    <td>{deposit.claim ? "No" : "Yes"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
       
      </div>
    </div>
  );
};

export default Deposit;
