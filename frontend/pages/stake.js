import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import tokenAddress from "../src/contracts/token-address.json";
import tokenAbi from "../src/contracts/DeBeToken.json";
import contractAddress from "../src/contracts/contract-address.json";
import contractAbi from "../src/contracts/Lottery.json";

export function Stake() {
  async function stake() {
    console.log("Staking...");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const debeTokenContract = new ethers.Contract(
        tokenAddress.Contract,
        tokenAbi.abi,
        signer
      );
      const stakingContract = new ethers.Contract(
        contractAddress.Contract,
        contractAbi.abi,
        signer
      );
      // approve contract here and stake
      await debeTokenContract.approve(
        stakingContract.address,
        ethers.utils.parseEther("1000000000")
      );
      await stakingContract.enterLottery(
        "Arsenal",
        debeTokenContract.address,
        ethers.utils.parseEther("10000")
      );
      console.log("Stake success");
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div>
      <h1>Enter Lottery</h1>
      <button onClick={stake}>
        <h3>Stake</h3>
      </button>
    </div>
  );
}
