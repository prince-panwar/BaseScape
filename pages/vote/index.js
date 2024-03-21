import React, { useState ,useEffect,useRef } from "react";
import Sidebar from "../components/sidebar";
// import CustomInput from "../components/input";
import Button from "../components/button";
import styles from "./vote.module.css";
import VoteImg from "../../public/Images/png/vote-img.png";
// import CustomSelect from "../components/select";
import Dropdown from "../components/dropdown";
import Image from "next/image";
import { useUserContext } from "../../context/userContext";
import {useRouter} from "next/navigation";
import DownArrow from '../../public/Images/png/down_arrow.png'
import { ConnectButton } from "@rainbow-me/rainbowkit";

const VotePage = () => {
  const [vote, setVote] = useState(false);
  const [save, setSave] = useState(false);
  const {username} = useUserContext();
  const [selected, setIsSelected] = useState("Item 1");
  const Router = useRouter();
 useEffect(() => {if(!username){Router.push("./")}},[username])
const CustomSelect = () => {
    const ref = useRef();
    const [isActive, setIsActive] = useState(false);
    
    const [open, setOpen] = useState();
  
   
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsActive(false);
        }
      }
  
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [ref]);
  
    return (
      <div
        className="custom-select-container"
        onClick={() => setOpen(!open)}
        ref={ref}
      >
        <div className="dropdown">
          <div
            onClick={(e) => {
              setIsActive(!isActive);
            }}
            className="dropdown-btn"
          >
            {selected}
            <span>
              <Image src={DownArrow} alt="downarrow" />
            </span>
          </div>
          <div
            className="dropdown-content"
            style={{ display: isActive ? "block" : "none" }}
          >
            <div
              onClick={(e) => {
                setIsSelected(e.target.textContent);
                setIsActive(!isActive);
              }}
              className="item"
            >
              Item 1
            </div>
            <div
              className="item"
              onClick={(e) => {
                setIsSelected(e.target.textContent);
                setIsActive(!isActive);
              }}
            >
              Item 2
            </div>
          </div>
        </div>
      </div>
    );
  };



  const handleVote = async () => {
    console.log(username+" "+selected);
    const body = {
      userId: username,
      candidate: selected,
    };
    await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  
  return (
    <div className="vote-page bg">
      <div>
        <Sidebar />
        <div className="black-card-wrapper">
          {vote ? (
            <>
            <div className={save ? "overlay" : ""}></div>
              <span>Count the EtherScape Items</span>
              <Image src={VoteImg} alt="vote-img" />
              <CustomSelect />
              <Button className="yellow-btn"  onClick={() => {setSave(true); handleVote()}}>
                Vote Now
              </Button>
              {save ? (
                <p className="record">
                  Thank you! <br />
                  Your vote has been recorded
                </p>
              ) : null}
            </>
          ) : (
            <>
            <ConnectButton/>
              <span>Cast your vote</span>
              <Button className="yellow-btn" onClick={() => setVote(true)}>
                Rune 123
              </Button>
              <span>{`Voting as ${username}`}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotePage;
