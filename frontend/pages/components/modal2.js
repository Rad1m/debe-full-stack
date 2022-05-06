import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
import styles from "../../styles/Home.module.css"

export default function Modal({show, onClose, children}) {

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(()=>{
      setIsBrowser(true);
  },[]);

  const modalContent=show ? (
      <div className={styles.overlay}>
          <div className={styles.modal}>
              <div className={styles.header}>
                  <a href="#" onClick={handleClose}>
                      <button className={styles.button}>Close</button>
                  </a>
              </div>

          </div>
      </div>
  )
     
}