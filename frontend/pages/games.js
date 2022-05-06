import React, { useState, useEffect, useReducer } from "react";
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

  const [wallet, setWallet] = useRecoilState(walletInfo);
  const contractInf = useRecoilValue(contractInfo);
  const tokentInf = useRecoilValue(tokenInfo);
  const [game, setGame] = useRecoilState(gameInfo(props.id));
  const [contract, setContract] = useState();
  const [token, setToken] = useState();
  const [stakeAllowed, setStakeAllowed] = useState(false);
  const [winner, setWinner] = useState("");
  const categoryOptions = [game.homeTeam, "Draw", game.awayTeam];
  const [amount, setAmount] = useState(0);
  const [staked, setStaked] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  

  // use effect if metamask connected
  useEffect(() => {
    if (contractInf.address) {
      getToken();
      getGame();
    }

    if (winner.length > 2) {
      setStakeAllowed(true);
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
      const stakingContract = await useContract(
        contractInf.address,
        contractInf.abi
      );
      const gameInfo = await stakingContract.games(props.id);
      const balances = await stakingContract.balances(props.id, wallet.address);
      setStaked(ethers.utils.formatEther(balances.stakedAmount));
      setContract(stakingContract);
      setGame({
        gameId: gameInfo.gameId,
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
    console.log("Staking", amount);
    if (amount < 10) {
      console.log("Increase staking amount");
      return;
    }
    try {
      // approve contract here and stake
      console.log("Approving...");
      const maxAmount = ethers.utils.parseEther("1000000000");
      await token.approve(contract.address, maxAmount);
      console.log("Approved. Continue...");

      // Enter lottery
      const amountToStake = ethers.utils.parseEther(amount.toString());
      console.log("Entering lottery...", amountToStake.toString());
      console.log("Betting on...", winner);
      const transaction = await contract.enterLottery(
        props.id,
        winner,
        token.address,
        amountToStake
      );
      await transaction.wait();

      // update TVL displayed on card and reset form
      const walletBalance = Number(wallet.balance);
      setWallet((prevState) => ({
        ...prevState,
        balance:
          walletBalance - Number(ethers.utils.formatEther(amountToStake)),
      }));
      resetForm();
    } catch (e) {
      console.log(e);
    }
  };

  const unstake = async () => {
    if (amount < 1) {
      return;
    }
    const amountToUnstake = ethers.utils.parseEther(amount.toString());

    try {
      console.log("Unstaking", amountToUnstake.toString());
      const transaction = await contract.updateStakeBeforeStart(
        props.id,
        amountToUnstake
      );
      await transaction.wait();
      console.log("Unstaked");
      const walletBalance = Number(wallet.balance);
      setWallet((prevState) => ({
        ...prevState,
        balance:
          walletBalance + Number(ethers.utils.formatEther(amountToUnstake)),
      }));
      resetForm();
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
    setWinner("");
    setStakeAllowed(false);
    setAmount(0);
    getGame();
  }

  function handleChange(evt) {
    const num = Number(evt.target.value);
    setAmount(num);
    console.log("Amount", amount);
  }

  return (
    <div className={styles.card}>
      <h2>{game.gameName}</h2>
      <p>Playing at {game.stadium}</p>
      <p>Game is {gameStatusEnum[game.gameStatus]}</p>
      <p>
        Pool stake {Number(ethers.utils.formatEther(game.totalAmountStaked))}{" "}
        DEBE
      </p>
      <p>Your stake {Number(staked)} DEBE</p>

      {(game.gameStatus === 0 || game.gameStatus === 5) && (
        <div className={styles.container}>
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
          <form className={styles.form}>
            Amount:
            <input
              onChange={handleChange}
              type="number"
              name="amount"
              id="amount"
              value={amount}
              required
            />
          </form>
          <div className={styles.btnholder}>
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
          </div>
        </div>
      )}

      {(game.gameStatus === 1 || game.gameStatus === 2) && (
        <div className={styles.container}>
          <div className={styles.infoBox}>
            <p>Betting is closed... waiting for results.</p>
            <p>You can claim after results are posted on the blockchain.</p>
          </div>
          <div className={styles.btnholder}>
            <button className={styles.button} type="button" disabled={true}>
              Waiting...
            </button>
          </div>
        </div>
      )}

      {game.gameStatus === 3 && (
        <div className={styles.container}>
          <div className={styles.winnerBox}>Result {game.result}</div>
          <div className={styles.winnerBox}>Winner {game.winner}</div>
          <div className={styles.btnholder}>
            <button className={styles.button} type="button" onClick={claim}>
              Claim
            </button>
          </div>
        </div>
      )}

      {game.gameStatus === 4 && (
        <div className={styles.container}>
          <div className={styles.infoBox}>
            Game was cancelled. You can withdraw your staked amount.
          </div>
          <div className={styles.btnholder}>
            <button className={styles.button} type="button" onClick={withdraw}>
              Withdraw
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
