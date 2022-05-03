import React from "react";
import Topbar from "./topbar";
import Canvas from "./canvas";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Topbar />
      <Canvas />
    </div>
  );
}
