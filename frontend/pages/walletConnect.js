import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContract } from "./hooks/contract";

export function WalletButton() {
  const [hasMetamask, setHasMetamask] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  }, []);

  async function connect() {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      getSigner();
    } catch (e) {
      console.log(e);
    }
  }

  async function getSigner() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
      setAddress(await signer.getAddress());
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <button onClick={connect}>
      {address ? <p>{address}</p> : <h3>Connect</h3>}
    </button>
  );
}
