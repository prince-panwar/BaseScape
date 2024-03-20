import React from "react";
import Sidebar from "../components/sidebar";
import CustomInput from "../components/input";
import Button from "../components/button";
import styles from "./deposit.module.css";
import Dropdown from "../components/dropdown";

const Deposit = () => {
  return (
    <div className="deposit-page bg">
      <div>
        <Sidebar />
        <div className="black-card-wrapper">
          <Dropdown />
          <div>
            <p>Locked Tokens</p>
            <p>564, 895</p>
          </div>
          <CustomInput
            // value="Enter Value"
            // onChange={handleChange}
            placeholder="Enter amount to deposit"
          />
          <Button className="yellow-btn">Deposit</Button>
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

export default Deposit;
