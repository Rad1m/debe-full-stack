import React from "react";
import { Games } from "./games";
import styles from "../styles/Home.module.css";

export default function Canvas() {
  return (
    <div className={styles.grid}>
      <Games id={0} />
    </div>
  );
}
