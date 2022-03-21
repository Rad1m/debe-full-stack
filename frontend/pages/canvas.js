import React from "react";
import { Games } from "./games";
import { useRecoilState, useRecoilValue } from "recoil";
import { gameInfo } from "./atoms/atoms";
import styles from "../styles/Home.module.css";

export default function Canvas() {
  let gameList = [];
  var i = 0;
  while (i < 2) {
    gameList.push(<Games key={i} id={i} />);
    const gameInf = useRecoilValue(gameInfo(i));
    console.log(gameInf.gameName);
    i++;
  }

  return <div className={styles.grid}>{gameList}</div>;
}
