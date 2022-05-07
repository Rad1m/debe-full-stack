import { atom, atomFamily } from "recoil";

export const gameInfo = atomFamily({
  key: "gameInfo",
  default: {
    gameId: 0,
    gameName: "",
    stadium: "",
    homeTeam: "",
    awayTeam: "",
    winner: "",
    result: "",
    gameStatus: "",
    totalAmountStaked: 0,
  },
});

export const gameIds = atom({
  key: "gameIds",
  default: [],
});

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

export const modalInfo = atom({
  key: "modalInfo",
  default: {
    open: false,
    header: "Hello",
    body: "Welcome to Decentralized Betting",
    button: "Close",
  },
});
