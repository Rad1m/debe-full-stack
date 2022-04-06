import React from "react";
import { Games } from "./games";
import styles from "../styles/Home.module.css";

export default function Canvas() {
  let gameList = [];
  var i = 0;
  while (i < 6) {
    gameList.push(<Games key={i} id={i} />);
    i++;
    console.log("Generating game", i);
  }
  console.log("Canvas ready");

  return <div className={styles.grid}>{gameList}</div>;
}
