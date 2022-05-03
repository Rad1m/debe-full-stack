import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { contractInfo, tokenInfo, walletInfo } from "./atoms/atoms";
import tokenAddress from "../src/artifacts/Token-address.json";
import tokenAbi from "../src/artifacts/Token-info.json";
import contractAddress from "../src/artifacts/Lottery-address.json";
import contractAbi from "../src/artifacts/Lottery-info.json";
import styles from "../styles/Home.module.css";
import { ellipseAddress } from "../pages/hooks/utilities.js";

export function WalletButton() {
  const [hasMetamask, setHasMetamask] = useState();
  const [signer, setSigner] = useState();
  const [wallet, setWallet] = useRecoilState(walletInfo);
  const [token, setToken] = useRecoilState(tokenInfo);
  const [contract, setContract] = useRecoilState(contractInfo);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
      connect();
    }
  }, [hasMetamask]);

  async function connect() {
    console.log("Connecting wallet");

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();
      setSigner(signer);

      const token = new ethers.Contract(
        tokenAddress.Contract,
        tokenAbi.abi,
        signer
      );
      setToken({
        address: tokenAddress.Contract,
        abi: tokenAbi.abi,
      });

      let chainId = await signer.getChainId();
      const balances = await token.balanceOf(accounts[0]);
      setWallet({
        connected: true,
        address: accounts[0],
        balance: ethers.utils.formatEther(balances),
        chainID: chainId,
        contractAddresses: token.address,
      });

      setContract((prevState) => ({
        ...prevState,
        address: contractAddress.Contract,
        abi: contractAbi.abi,
      }));

      console.log("Wallet connected");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <button className={styles.loginbutton} onClick={connect}>
        {wallet.address ? (
          <p>{ellipseAddress(wallet.address, 8)}</p>
        ) : (
          <h3>Connect</h3>
        )}
      </button>
    </div>
  );
}
