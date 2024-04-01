import React, { useEffect,useState } from "react";
import Sidebar from "../components/sidebar";
import CustomInput from "../components/input";
import Button from "../components/button";
import styles from "./deposit.module.css";
import tokenabi from "../helpers/Etherscape.json";
import { useUserContext } from "../../context/userContext";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  
} from "wagmi";
import { parseEther, erc20Abi, formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
const Deposit = () => {
  const { username ,id} = useUserContext();
  console.log("at deposit "+username+" "+id);
  const [amount, setAmount] = useState();
 const Router = useRouter();
  const TOKEN_ADDRESS="0x6C6e2C5a4EB108A1F3c985d5A7F4f233483e952F";
  const RECIPIENT_ADDRESS = "0x3896f27Da41d445dC2A302Bd850748EC0A747280";
  const [update, setUpdate] = useState([]);
  const [deposits, setDeposits] = useState([]);
  
  const { data: balance,error:readerror } = useReadContract({
    abi:tokenabi,
    address: TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: [RECIPIENT_ADDRESS],
  });

  const {writeContract:writeDeposit,data:depositHash, isPending:depositPending,error:depositError} = useWriteContract();
  const {isLoading: isDepositConfirming, isSuccess: isDepositConfirmed,} = useWaitForTransactionReceipt({hash: depositHash});
  useEffect(() => {if(!username){Router.push("./")}},[username])
  async function getDeposits() {
    const Deposits = await fetch("/api/getDeposits");
    return Deposits.json();
  }
  useEffect(() => {  getDeposits().then((d) => setDeposits(d));}, []);
  
  const handleDeposit=()=>{
    console.log("depositing")
    writeDeposit({
      abi: tokenabi,
      address: TOKEN_ADDRESS,
      functionName: "transfer",
      args: [RECIPIENT_ADDRESS,amount*10**18],
    });
  }
useEffect(() => {  if(isDepositConfirmed){saveInDB()}}, [isDepositConfirmed]);
useEffect(() => {if(depositError){alert(depositError.message)}},[depositError])

  async function saveInDB() {

    const body = {
      username: username,
      amount: amount,
    };
    await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  }
 
  return (
    <div className="deposit-page bg">
      <div>
        <Sidebar  />
        <div className="black-card-wrapper">
          <ConnectButton/>
          <div>
            <p>Locked Tokens</p>
            {!!balance && typeof balance === 'bigint' && ( <span>{formatEther(balance)}</span>  )}
          </div>
          <CustomInput
             value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to deposit"
          />
          <Button onClick={handleDeposit} className="yellow-btn">{isDepositConfirming?"Confirming...":"deposit"}</Button>
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
            {deposits &&
          deposits.length > 0 &&
          deposits.map((deposit, index) => (
            <tr key={index}>
              <td>{deposit.username}</td>
              <td>{deposit.amount}</td>
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
