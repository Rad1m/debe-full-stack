import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ethers } from "ethers";
import {
  contractInfo,
  gameInfo,
  tokenInfo,
  walletInfo,
  modalInfo,
} from "./atoms/atoms";
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
    <div class="py-4 w-64 h-auto bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg hover:shadow-xl hover:shadow-green-500">
      <p class="text-center italic">Playing at {game.stadium}</p>
      <p class="text-center italic">Date: 16 June 2022</p>
      <div class="p-2 bg-sky-900 max-w-full justify-between items-center text-center align-middle">
        <div class="flex items-center text-center align-middle text-md font-bold text-lg">
          <p class="px-2">{game.homeTeam}</p>
          <p class="rounded-full text-sm italic w-6 h-6 bg-blue-500">vs.</p>
          <p class="px-2">{game.awayTeam}</p>
        </div>
      </div>
      <div class="items-center text-center align-middle">
        <p>Game is {gameStatusEnum[game.gameStatus]}</p>
        <p>
          Pool stake {Number(ethers.utils.formatEther(game.totalAmountStaked))}{" "}
          DEBE
        </p>
        <p>Your stake {Number(staked)} DEBE</p>
      </div>

      {(game.gameStatus === 0 || game.gameStatus === 5) && (
        <div>
          <div className=" h-28 justify-between items-center text-center align-middle">
            <div className="bg-slate-800 py-1">
              {categoryOptions.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    category == winner
                      ? "bg-green-300 py-1 px-2 font-semibold text-slate-700 w-2/6 rounded-sm"
                      : "bg-slate-600 px-2 py-1  hover:text-red-500 w-2/6"
                  }
                  onClick={() => setWinner(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <form className="h-14 text-slate-50 py-1">
              Amount:
              <input
                className="text-black text-center border-2 rounded-md hover:border-red-500 hover:border-2"
                onChange={handleChange}
                type="number"
                name="amount"
                id="amount"
                value={amount}
                required
              />
            </form>
          </div>
          <div class="justify-center items-center text-center align-middle py-1 space-x-2">
            <button
              class="py-2 px-4 font-medium transition ease-in-out delay-150 duration-300 rounded-md pointer-events-auto
                  bg-blue-500 hover:bg-red-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
              type="button"
              key="stake"
              onClick={enterLottery}
              disabled={!stakeAllowed}
            >
              Stake
            </button>
            <button
              class="py-2 px-4 font-medium transition ease-in-out delay-150 duration-300 rounded-md pointer-events-auto
                  bg-blue-500 hover:bg-red-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
              type="button"
              key="unstake"
              onClick={unstake}
              disabled={staked <= 0}
            >
              Unstake
            </button>
          </div>
        </div>
      )}

      {(game.gameStatus === 1 || game.gameStatus === 2) && (
        <div>
          <div className="h-28 justify-center items-center text-center align-middle">
            <div className="bg-info-darkblue text-info-green py-1 items-center h-28">
              <p>Betting is closed... waiting for results.</p>
              <p>You can claim after results are posted on the blockchain.</p>
            </div>
          </div>
          <div class="justify-center items-center text-center align-middle py-1">
            <button
              class="py-2 px-4 font-medium mr-2 mb-2 transition ease-in-out delay-150 duration-300 rounded-md pointer-events-auto
                  bg-blue-500 hover:bg-red-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
              type="button"
              disabled={true}
            >
              Waiting...
            </button>
          </div>
        </div>
      )}

      {game.gameStatus === 3 && (
        <div>
          <div className="h-28 justify-center space-y-2 pt-5">
            <div className="bg-info-darkblue text-info-green pt-1 h-8 text-center">
              Result {game.result}
            </div>
            <div className="bg-info-darkblue text-info-green h-8 pt-1 text-center">
              Winner {game.winner}
            </div>
          </div>
          <div class="justify-center text-center py-1">
            <button
              class="py-2 px-4 font-medium mr-2 mb-2 transition ease-in-out delay-150 duration-300 rounded-md pointer-events-auto
                  bg-blue-500 hover:bg-red-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
              type="button"
              onClick={claim}
              disabled={staked <= 0}
            >
              Claim
            </button>
          </div>
        </div>
      )}

      {game.gameStatus === 4 && (
        <div>
          <div className="bg-red-900 h-28 justify-center items-center text-center align-middle">
            <div className="bg-info-darkblue text-info-green py-1 text-center items-center align-middle h-28">
              Game was cancelled. You can withdraw your staked amount.
            </div>
          </div>
          <div class="justify-center items-center text-center align-middle py-1">
            <button
              class="py-2 px-4 font-medium mr-2 mb-2 transition ease-in-out delay-150 duration-300 rounded-md pointer-events-auto
                  bg-blue-500 hover:bg-red-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
              type="button"
              onClick={withdraw}
              disabled={staked <= 0}
            >
              Withdraw
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
