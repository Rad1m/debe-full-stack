import React from "react";
import { useRecoilValue } from "recoil";
import { WalletButton } from "../pages/walletConnect";
import { walletInfo } from "./atoms/atoms";
import styles from "../styles/Home.module.css";

export default function Topbar() {
  const wallet = useRecoilValue(walletInfo);

  return (
    <nav class="flex items-center justify-between flex-wrap bg-slate-900 p-4">
      <div class="container flex flex-wrap justify-between items-center mx-auto">
        <p class="font-semibold text-xl lg:flex-grow">LOGO</p>
        <p class="font-semibold text-xl lg:flex-grow">Decentralized Betting</p>
        <p class="font-semibold text-sm lg:flex-grow">
          Balance {Number(wallet.balance)} DEBE
        </p>
        <WalletButton />
      </div>
    </nav>
  );
}
