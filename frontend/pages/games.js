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
  const [stakeAllowed, setStakeAllowed] = useState(false);
  const [winner, setWinner] = useState("");
  const categoryOptions = [game.homeTeam, "Draw", game.awayTeam];
  const [amount, setAmount] = useState(0);

  // use effect if metamask connected
  useEffect(() => {
    if (contractInf.address) {
      getToken();
      getGame();
    }

    if (winner.length > 2) {
      setStakeAllowed(true);
    }
  }, [wallet, winner, game]);

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
      const stakingContract = await useContract(
        contractInf.address,
        contractInf.abi
      );
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

  const enterLottery = async () => {
    console.log("Staking", amount.toString());
    if (amount < 1) {
      return;
    }
    try {
      // approve contract here and stake
      console.log("Approving...");
      const maxAmount = ethers.utils.parseEther("1000000000");
      await token.approve(contract.address, maxAmount);
      console.log("Approved. Continue...");

      // Enter lottery
      console.log("Entering lottery...", amount.toString());
      console.log("Betting on...", winner);
      const transaction = await contract.enterLottery(
        props.id,
        winner,
        token.address,
        amount
      );
      console.log("Awaiting transaction...");
      await transaction.wait();
      console.log("Transaction finished");

      // update TVL displayed on card and reset form
      resetForm();
    } catch (e) {
      console.log(e);
    }
  };

  const unstake = async () => {
    console.log("Unstaking", amount.toString());

    try {
      const transaction = await contract.updateStakeBeforeStart(
        props.id,
        token.address,
        amount
      );
      console.log("Awaiting transaction");
      await transaction.wait();
      console.log("Unstaked", amount.toString());
      // update TVL displayed on card and reset form
      resetForm();
      console.log("TVL", game.totalAmountStaked.toString())
    } catch (e) {
      console.log(e);
    }
  };

  const claim = async (event) => {
    console.log("Claim");
  };

  const withdraw = async (event) => {
    console.log("Withdraw");
  };

  function resetForm() {
    // update TVL displayed on card and reset form
    setAmount(0);
    setWinner("");
    setStakeAllowed(false);
    getGame();
  }

  function handleChange(evt) {
    setAmount(ethers.utils.parseEther(evt.target.value.toString()));
    console.log("Amount", amount.toString());
  }

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <h2>{game.gameName}</h2>
        <p>Location {game.stadium}</p>
        <p>Game {gameStatusEnum[game.gameStatus]}</p>
        <p>TVL {ethers.utils.formatEther(game.totalAmountStaked)}</p>
      </div>

      {(game.gameStatus === 0 || game.gameStatus === 5) && (
        <div>
          <div className={styles.border}>
            {categoryOptions.map((category) => (
              <button
                type="button"
                key={category}
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
          <form className={styles.form} onChange={handleChange}>
            Amount:
            <input
              type="number"
              name="amount"
              id="amount"
              defaultValue={amount}
              required
            />
            <button
              className={styles.button}
              type="button"
              key="stake"
              onClick={enterLottery}
              disabled={!stakeAllowed}
            >
              Stake
            </button>
            <button
              className={styles.button}
              type="button"
              key="unstake"
              onClick={unstake}
            >
              Unstake
            </button>
          </form>
        </div>
      )}

      {(game.gameStatus === 1 || game.gameStatus === 2) && (
        <div className={styles.container}>
          <div className={styles.winnerBox}>
            Betting closed, waiting for results
          </div>
        </div>
      )}

      {game.gameStatus === 3 && (
        <div className={styles.container}>
          <div className={styles.winnerBox}>Result {game.result}</div>
          <div className={styles.winnerBox}>Winner {game.winner}</div>
          <button className={styles.button} type="button" onClick={claim}>
            Claim
          </button>
        </div>
      )}

      {game.gameStatus === 4 && (
        <div className={styles.container}>
          <div className={styles.winnerBox}>Game is cancelled</div>
          <button className={styles.button} type="button" onClick={withdraw}>
            Withdraw
          </button>
        </div>
      )}
    </div>
  );
}
