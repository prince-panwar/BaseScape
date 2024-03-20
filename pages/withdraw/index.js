import React from "react";
import Sidebar from "../components/sidebar";
import CustomInput from "../components/input";
import Button from "../components/button";
import styles from"./withdraw.module.css";
import Dropdown from "../components/dropdown";

const Withdraw = () => {
  return (
    <div className="withdraw-page bg">
      <div>
        <Sidebar />
        <div className="black-card-wrapper">
          <Dropdown />
          <CustomInput
            // value="Custom"
            // onChange={handleChange}
            placeholder="Enter amount to withdraw"
          />
          <Button className="yellow-btn">Withdraw</Button>
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
