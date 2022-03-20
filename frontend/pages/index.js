import React from "react";
import { Stake } from "./stake";
import { WalletButton } from "./walletConnect";
import { Games } from "./games";

export default function Home() {
  return (
    <div>
      <h1>Connect wallet</h1>
      <WalletButton />
      <Stake />
      <Games id={0} />
      <Games id={1} />
    </div>
  );
}
