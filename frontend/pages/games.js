import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ethers, utils } from "ethers";
import { contractInfo, gameInfo, tokenInfo, walletInfo } from "./atoms/atoms";
import { useContract } from "./hooks/utilities";

export function Games(props) {
  // get available games

  // use effect if metamask connected
  const wallet = useRecoilValue(walletInfo);
  const contractInf = useRecoilValue(contractInfo);
  const [game, setGame] = useRecoilState(gameInfo(props.id));

  // get the game function
  async function getGame() {
    try {
      const stakingContract = useContract(contractInf.address, contractInf.abi);
      const gameInfo = await stakingContract.games(props.id);
      console.log("Game id %s name %s", props.id, gameInfo.gameName);
    } catch (e) {
      console.log(e);
    }
  }

  function stakeFunction() {
    console.log("Stake");
    getGame();
  }

  return (
    <div>
      <h1>Games card</h1>
      <button onClick={stakeFunction}>
        <h3>Stake Game {props.id}</h3>
      </button>
    </div>
  );
}
