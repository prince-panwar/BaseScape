import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import CustomInput from "../components/input";
import Button from "../components/button";
import styles from "./stake.module.css";
import Dropdown from "../components/dropdown";

const Stake = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleActive = (index) => {
    setActiveIndex(index);
  };
  return (
    <div className="stake-page bg">
      <div>
        <Sidebar />
        <div className="black-card-wrapper">
          <Dropdown />
          <CustomInput
            // value="Stake"
            // onChange={handleChange}
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
              <span>54%</span>
            </div>
            <div>
              <span>Withdraw Tax</span>
              <span>4%</span>
            </div>
            <div>
              <span className="tvl">TVL</span>
              <span>$ 564, 895</span>
            </div>
          </div>
          <Button className="yellow-btn">Stake</Button>
        </div>
      </div>
    </div>
  );
};

export default Stake;
