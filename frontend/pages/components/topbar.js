import React from "react";
import { useRecoilValue } from "recoil";
import { WalletButton } from "./walletConnect";
import { walletInfo } from "../atoms/atoms";

export default function Topbar() {
  const wallet = useRecoilValue(walletInfo);

  return (
    <nav className="flex items-center justify-between bg-slate-900 px-8 py-4">
      <div className="container max-w-xs w-1/4">
        <p className="font-bold text-4xl">DEBE</p>
      </div>
      <div className="container sm mx-auto">
        <p className="font-semibold text-4xl text-center">
          Decentralized Betting
        </p>
      </div>
      <div className="container text-center w-1/4 max-w-xs">
        <p className="font-semibold text-sm">
          Balance {Number(wallet.balance)} DEBE
        </p>
        <WalletButton />
      </div>
    </nav>
  );
}
