import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ethers, utils } from "ethers";
import { contractInfo, tokenInfo, walletInfo } from "./atoms/atoms";
import { useContract } from "./hooks/contract";

export function Games() {
  // get available games

  // use effect if metamask connected
  const wallet = useRecoilValue(walletInfo);
  const contractInf = useRecoilValue(contractInfo);

  // get the game function
  async function getGame() {
    const stakingContract = useContract(contractInf.address, contractInf.abi);
    const gameInfo = await stakingContract.games(0);
    console.log("Game status...", gameInfo.gameName);
  }

  return (
    <div>
      <h1>Games card</h1>
      <button onClick={getGame}>
        <h3>Get Game</h3>
      </button>
    </div>
  );
}
