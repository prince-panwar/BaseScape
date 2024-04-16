/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from "react";
import Sidebar from "../components/sidebar";
import CustomInput from "../components/input";
import Button from "../components/button";
import styles from "./withdraw.module.css";
import Dropdown from "../components/dropdown";
import contractabi from "../helpers/FixedStaking.json";
import tokenabi from "../helpers/Etherscape.json";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUserContext } from "../../context/userContext";
import { useRouter } from "next/navigation";
const Withdraw = () => {
  const { address, isConnected } = useAccount();
  const TOKEN_ADDRESS="0x6C6e2C5a4EB108A1F3c985d5A7F4f233483e952F";
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
  // const ABI = contractabi.abi;
  // const {
  //   writeContract: writewithdraw,
  //   data: Hash,
  //   isPending: Pending,
  // } = useWriteContract();
  // const {
  //   isLoading: isConfirming,
  //   isSuccess: isConfirmed,
  //   error: Error,
  // } = useWaitForTransactionReceipt({ hash: Hash });
  // const { username } = useUserContext();
  // const Router = useRouter();
  // useEffect(() => {
  //   if (!username) {
  //     Router.push("./");
  //   }
  // }, [username]);
  // async function handleWithdraw() {
  //   writewithdraw({
  //     abi: ABI,

  //     address: CONTRACT_ADDRESS,
  //     functionName: "withdrawTokens",
  //     args: [],
  //   });
  // }
  // useEffect(() => {
  //   if (isConfirmed) {
  //     updateDB;
  //   }
  // }, [isConfirmed]);
  return (
    <div className="withdraw-page bg">
      <div>
        <h2>
          "The withdrawal function from the game is currently disabled through
          the dashboard, only ingame is used"
        </h2>
        <Sidebar />
        <div className="black-card-wrapper">
          <ConnectButton />
          <CustomInput
            // value="Custom"
            // onChange={handleChange}
            placeholder="Enter amount to withdraw"
          />
          
          
          <Button  className="yellow-btn">
            Withdraw
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
              <tr>
                <td>anasshad</td>
                <td>0.001</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>anasshad</td>
                <td>0.001</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
