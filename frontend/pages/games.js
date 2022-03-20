import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue, atomFamily } from "recoil";
import { ethers } from "ethers";
import { contractInfo, gameInfo, tokenInfo, walletInfo } from "./atoms/atoms";
import { useContract } from "./hooks/utilities";
import styles from "../styles/Home.module.css";

export function Games(props) {
  // list to simulate enum, enums are not supported in javascript
  const gameStatusEnum = [
    "Open",
    "Running",
    "Closed",
    "Finished",
    "Cancelled",
    "Postponed",
  ];
  Object.freeze(gameStatusEnum);

  const wallet = useRecoilValue(walletInfo);
  const contractInf = useRecoilValue(contractInfo);
  const [game, setGame] = useRecoilState(gameInfo(props.id));

  // use effect if metamask connected
  useEffect(() => {
    if (contractInf.address) {
      getGame();
    }
  }, []);

  // get the game function
  async function getGame() {
    try {
      const stakingContract = useContract(contractInf.address, contractInf.abi);
      const gameInfo = await stakingContract.games(props.id);
      setGame({
        gameName: gameInfo.gameName,
        stadium: gameInfo.stadium,
        homeTeam: gameInfo.homeTeam,
        awayTeam: gameInfo.awayTeam,
        result: gameInfo.result,
        gameStatus: gameInfo.state,
        totalAmountStaked: gameInfo.totalAmountStaked,
      });
    } catch (e) {
      console.log(e);
    }
  }

  function refresh() {
    getGame();
  }

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <h2>{game.gameName}</h2>
        <p>Location {game.stadium}</p>
        <p>Game: {gameStatusEnum[game.gameStatus]}</p>
        <p>TVL {ethers.utils.formatEther(game.totalAmountStaked)}</p>
        <button onClick={refresh}>
          <p>Refresh</p>
        </button>
      </div>
    </div>
  );
}
