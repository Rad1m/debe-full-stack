import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import tokenAddress from "../src/artifacts/Token-address.json";
import tokenAbi from "../src/artifacts/Token-info.json";
import contractAddress from "../src/artifacts/Lottery-address.json";
import contractAbi from "../src/artifacts/Lottery-info.json";

export function Stake() {
  async function stake() {
    console.log("Staking...");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      console.log("Continue with signer...", walletAddress);

      const token = new ethers.Contract(
        tokenAddress.Contract,
        tokenAbi.abi,
        signer
      );

      const stakingContract = new ethers.Contract(
        contractAddress.Contract,
        contractAbi.abi,
        signer
      );

      console.log("Continue with contract...", stakingContract.address);

      const balanceSender = await token.balanceOf(signer.getAddress());
      const balanceContractBefore = await token.balanceOf(
        contractAddress.Contract
      );
      console.log("Wallet balance %s", balanceSender);
      console.log("Contract balance %s", balanceContractBefore);

      // approve contract here and stake
      await token.approve(
        stakingContract.address,
        ethers.utils.parseEther("1000000000")
      );

      // Enter lottery
      console.log("Entering lottery...");
      await stakingContract.enterLottery(
        "Arsenal",
        tokenAddress.Contract,
        ethers.utils.parseEther("50")
      );

      // Check balance has changed
      const balanceContractAfter = await token.balanceOf(
        contractAddress.Contract
      );
      console.log("Stake %s success", balanceContractAfter);
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
