import React from "react";
import { Stake } from "./stake";
import { WalletButton } from "./walletConnect";
import Canvas from "./canvas";

export default function Home() {
  return (
    <div>
      <h1>Connect wallet</h1>
      <WalletButton />
      <Canvas />
    </div>
  );
}
