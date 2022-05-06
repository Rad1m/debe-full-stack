import React, { useState } from "react";
import styles from "../../styles/Home.module.css"

export function Modal(props) {

  const [showModal, setShowModal] = useState(false);

    return (
       <div className={styles.container}>
         <button className={styles.button} type="button" onClick={()=>setShowModal(true)}>
              Show Modal
            </button>
         <h1>{props.title}</h1>
       {props.message}
       </div>
       )
     
}