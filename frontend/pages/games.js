import React, { useState, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
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
  const tokentInf = useRecoilValue(tokenInfo);
  const [game, setGame] = useRecoilState(gameInfo(props.id));
  const [contract, setContract] = useState();
  const [token, setToken] = useState();
  const [stakingAllowed, setStakingAlloed] = useState(false);
  const [winner, setWinner] = useState("");
  const categoryOptions = [game.homeTeam, "Draw", game.awayTeam];
  const currentCategoryRef = useRef();

  // use effect if metamask connected
  useEffect(() => {
    if (contractInf.address) {
      getToken();
      getGame();
    }
  }, [wallet, winner]);

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
        winner: gameInfo.winner,
        result: gameInfo.result,
        gameStatus: gameInfo.state,
        totalAmountStaked: gameInfo.totalAmountStaked,
      });
    } catch (e) {
      console.log(e);
    }
  }

  // Enter Lottery
  const enterLottery = async (event) => {
    event.preventDefault();
    console.log("Staking...");

    try {
      // approve contract here and stake
      console.log("Approving...");
      const maxAmount = ethers.utils.parseEther("1000000000");
      await token.approve(contract.address, maxAmount);
      console.log("Approved. Continue...");

      // Enter lottery
      const amount = ethers.utils.parseEther(
        event.target.amount.value.toString()
      );
      console.log("Entering lottery...", amount.toString());
      console.log("Betting on...", winner);
      const transaction = await contract.enterLottery(
        props.id,
        winner,
        token.address,
        amount
      );
      await transaction.wait();

      // update TVL displayed on card and reset form
      getGame();
      event.target.amount.value = "";
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <h2>{game.gameName}</h2>
        <p>Location {game.stadium}</p>
        <p>Game: {gameStatusEnum[game.gameStatus]}</p>
        <p>TVL {ethers.utils.formatEther(game.totalAmountStaked)}</p>
      </div>
      {/* Staking is allowed */}
      {game.gameStatus === 0 && (
        <div>
          <div className={styles.border}>
            {categoryOptions.map((category) => (
              <button
                type="button"
                className={
                  category == winner
                    ? styles.buttonGroupSelected
                    : styles.buttonGroup
                }
                onClick={() => setWinner(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className={styles.winnerBox}>{winner}</div>
          <form className={styles.form} onSubmit={enterLottery}>
            <label htmlFor="amount">Amount</label>
            <input id={props.id} name="amount" type="number" required />
            <button className={styles.button} type="submit">
              Stake
            </button>
            <button className={styles.button} type="submit">
              Unstake
            </button>
          </form>
        </div>
      )}

      {game.gameStatus === 3 && (
        <div className={styles.container}>
          <div className={styles.winnerBox}>Result {game.result}</div>
          <div className={styles.winnerBox}>Winner {game.winner}</div>
          <button className={styles.button} type="button">
            Claim
          </button>
        </div>
      )}

      {game.gameStatus === 4 && (
        <div className={styles.container}>
          <div className={styles.winnerBox}>Game is cancelled</div>
          <button className={styles.button} type="button">
            Claim
          </button>
        </div>
      )}
    </div>
  );
}
