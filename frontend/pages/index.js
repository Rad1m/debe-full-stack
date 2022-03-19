import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Stake } from "./stake";
import { WalletButton } from "./walletConnect";
import { Games } from "./games";

export default function Home() {
  return (
    <div>
      <h1>Connect wallet</h1>
      <WalletButton />
      <Stake />
      <Games />
    </div>
  );
}
