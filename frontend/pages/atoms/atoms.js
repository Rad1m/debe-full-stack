import { atom } from "recoil";

export const walletInfo = atom({
  key: "walletInfo",
  default: {
    connected: false,
    address: "",
    balance: 0,
    chainID: 0,
    contractAddresses: [],
  },
});

export const tokenInfo = atom({
  key: "tokenInfo",
  default: { address: "", abi: {} },
});

export const contractInfo = atom({
  key: "contractInfo",
  default: {
    address: "",
    abi: {},
    tvl: 0,
  },
});
