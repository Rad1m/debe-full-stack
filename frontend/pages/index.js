import React from "react";
import Topbar from "./topbar";
import Canvas from "./canvas";
import styles from "../styles/Home.module.css";
import {Modal} from "./hooks/modal";

export default function Home() {
  return (
    <div className={styles.container}>
      <Modal title="Modal title" message="Modal window" />
      <Topbar />
      <Canvas />
    </div>
  );
}
