import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ethers } from "ethers";
import { contractInfo, gameInfo, tokenInfo, walletInfo } from "./atoms/atoms";

export function StakeButton(props) {
  const wallet = useRecoilValue(walletInfo);
  const contractInf = useRecoilValue(contractInfo);
  const game = useRecoilValue(gameInfo(props.id));

  // allow staking only if game is open and wallet is connected

  return (
    <div>
      {game.gameStatus === 0 ? (
        <button>Stake {props.id}</button>
      ) : (
        <h3>Staking disabled</h3>
      )}
    </div>
  );
}
