import React, { useState, useEffect, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ethers } from "ethers";
import { contractInfo, gameInfo, tokenInfo, walletInfo } from "./atoms/atoms";
import { useContract } from "./hooks/utilities";
import styles from "../styles/Home.module.css";
import { StakingForm } from "./components/stakingForm";

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
  const tokentInf = useRecoilValue(tokenInfo);
  const [game, setGame] = useRecoilState(gameInfo(props.id));
  const [contract, setContract] = useState();
  const [token, setToken] = useState();

  // use effect if metamask connected
  useEffect(() => {
    if (contractInf.address) {
      getToken();
      getGame();
    }
  }, [wallet]);

  async function getToken() {
    try {
      const tokenContract = useContract(tokentInf.address, tokentInf.abi);
      setToken(tokenContract);
    } catch (e) {
      console.log(e);
    }
  }

  // get the game function
  async function getGame() {
    try {
      const stakingContract = useContract(contractInf.address, contractInf.abi);
      const gameInfo = await stakingContract.games(props.id);
      setContract(stakingContract);
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

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <h2>{game.gameName}</h2>
        <p>Location {game.stadium}</p>
        <p>Game: {gameStatusEnum[game.gameStatus]}</p>
        <p>TVL {ethers.utils.formatEther(game.totalAmountStaked)}</p>
        {game.gameStatus === 0 && <StakingForm id={props.id} />}
        {game.gameStatus >= 3 && <button>Unstake</button>}
      </div>
    </div>
  );
}
