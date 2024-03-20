"use client"
import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';

import Head from 'next/head';
import styles from '../styles/Home.module.css';
import button from "./components/button"
import DownArrow from "../public/Images/png/down_arrow.png";
import BlackCircle from "../public/Images/png/black-circle.png";
import CustomInput from "./components/input";
import Sidebar from "./components/sidebar";
import Dropdown from "./components/dropdown";
import Link from "next/link";
const Home = () => {
  const [connectbtn, setConnectBtn] = useState(false);
  const [confirm, setConfirm] = useState(true);

  return (
    <div className="login bg">
    <div>
      <Sidebar />
      <div className="black-card-wrapper">
        {confirm ? (
          <div>
            <p>
              Welcome to EtherScape Dapp! <br /> Please Connect Your Wallet
              <br />
              to Proceed
            </p>
            <button
              className="yellow-btn"
              onClick={() => {
                setConfirm(false);
              }}
            >
              Connect
            </button>
          </div>
        ) : (
          <div className="submit-page">
            {connectbtn ? (
              <button
                className="yellow-btn"
                onClick={(e) => {
                  setConnectBtn(false);
                }}
              >
                Connect
              </button>
            ) : (
              <Dropdown/>
            )}

            <CustomInput
              // value="Enter Value"
              // onChange={handleChange}
              placeholder="Enter username to verify"
            />
            <button className="yellow-btn " onClick={() => {
                  setConfirm(true);
                }}>
              <Link href="/deposit">
                
                  Submit
               
              </Link>
            </button>
            
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Home;
