import React from "react";
import { useRecoilValue } from "recoil";
import { WalletButton } from "../pages/walletConnect";
import { walletInfo } from "./atoms/atoms";
import styles from "../styles/Home.module.css";

export default function Topbar() {
  const wallet = useRecoilValue(walletInfo);

  return (
    <div className={styles.container}>
      <div className={styles.topnav}>
        <h1>LOGO</h1>
        <h1>Decentralized Betting</h1>
        <h3>Balance {Number(wallet.balance)} DEBE</h3>
        <WalletButton />
      </div>
    </div>
  );
}
