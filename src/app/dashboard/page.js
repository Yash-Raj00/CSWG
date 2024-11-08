"use client";

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../page.module.css";

export default function Dashboard() {
  const [connected, setConnected] = useState(false);

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <a
          href="/dashboard/streaming?env=uat"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2 className={connected === true ? styles.connected : ""}>
            Streaming UAT
          </h2>
          <p>Update streaming configurations</p>
        </a>
        <a
          href="/dashboard/jobcontrol?env=uat"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2 className={connected === true ? styles.connected : ""}>
            Job Control UAT
          </h2>
          <p>Update job control configurations</p>
        </a>
        <a
          href="/dashboard/runlog?env=uat"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2 className={connected === true ? styles.connected : ""}>
            Run Log UAT
          </h2>
          <p>Stream Run Log</p>
        </a>
      </div>
      <div className={styles.grid}>
        <a
          href="/dashboard/streaming?env=prod"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2 className={connected === true ? styles.connected : ""}>
            Streaming PROD
          </h2>
          <p>Update streaming configurations</p>
        </a>
        <a
          href="/dashboard/jobcontrol?env=prod"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2 className={connected === true ? styles.connected : ""}>
            Job Control PROD
          </h2>
          <p>Update job control configurations</p>
        </a>
        <a
          href="/dashboard/runlog?env=prod"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2 className={connected === true ? styles.connected : ""}>
            Run Log PROD
          </h2>
          <p>Stream Run Log</p>
        </a>
      </div>
      <ToastContainer />
    </main>
  );
}
