"use client";
import styles from "../../page.module.css";
import RunLog from "./RunLogTable";

export default function Jobs() {
  return (
    <main className={styles.streaming}>
      <RunLog />
    </main>
  );
}
