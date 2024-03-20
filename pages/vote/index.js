import React, { useState } from "react";
import Sidebar from "../components/sidebar";
// import CustomInput from "../components/input";
import Button from "../components/button";
import styles from "./vote.module.css";
import VoteImg from "../../public/Images/png/vote-img.png";
import CustomSelect from "../components/select";
import Dropdown from "../components/dropdown";
import Image from "next/image";
const VotePage = () => {
  const [vote, setVote] = useState(false);
  const [save, setSave] = useState(false);

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
              <Button className="yellow-btn" onClick={() => setSave(true)}>
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
            <Dropdown />
              <span>Cast your vote</span>
              <Button className="yellow-btn" onClick={() => setVote(true)}>
                Rune 123
              </Button>
              <span>Voting as user_name</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotePage;
