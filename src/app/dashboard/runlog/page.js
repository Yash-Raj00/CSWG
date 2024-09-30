"use client";
import { useSearchParams } from "next/navigation";
import styles from "../../page.module.css";
import RunLog from "./RunLogTable";

export default function Jobs() {
  const searchParams = useSearchParams();
  const env = searchParams.get("env");

  return (
    <main className={styles.streaming}>
      <RunLog env={env} />
    </main>
  );
}
