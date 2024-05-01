"use client";
import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import button from "./components/button";
import DownArrow from "../public/Images/png/down_arrow.png";
import BlackCircle from "../public/Images/png/black-circle.png";
import CustomInput from "./components/input";
import Sidebar from "./components/sidebar";
import Dropdown from "./components/dropdown";
import { useRouter } from "next/navigation";
import { verify } from "crypto";
import { useUserContext } from "../context/userContext";

const Home = () => {
  const { verifyUser } = useUserContext();
  const [connectbtn, setConnectBtn] = useState(false);
  const [confirm, setConfirm] = useState(true);
  const [user, setUser] = useState("");
  const router = useRouter();
  const { isConnected } = useAccount();

  return (
    <div className="login bg">
      <div>
        <Sidebar />
        <div className="black-card-wrapper">
          {!isConnected ? (
            <div>
              <p>
                Welcome to BaseScape Dapp! <br /> Please Connect Your Wallet to
                <br />
                Proceed
              </p>
              <div
                onClick={() => {
                  setConfirm(false);
                }}
              >
                <ConnectButton />
              </div>
              
            </div>
          ) : (
            <div className="submit-page">
              <ConnectButton disabled={true} />{" "}
              {/* Use disabled prop to disable the button */}
              <CustomInput
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Enter username to verify"
              />
              <button
                className="yellow-btn"
                onClick={() => {
                  setConfirm(true);
                  verifyUser(user);
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
