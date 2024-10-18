"use client";
import { useSearchParams } from "next/navigation";
import styles from "../../page.module.css";
import RunLog from "./RunLogTable";

export default function Jobs() {
  const searchParams = useSearchParams();
  const env = searchParams.get("env");

  return (
    <main className={styles.streaming}>
      {env !== "uat" && (
        <div
          style={{
            width: "100%",
            backgroundColor: "red",
            color: "black",
            textAlign: "center",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          PRODUCTION ENVIRONMENT
        </div>
      )}
      <RunLog env={env} />
    </main>
  );
}
