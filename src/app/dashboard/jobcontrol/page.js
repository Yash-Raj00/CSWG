"use client";
import { ToastContainer } from "react-toastify";
import styles from "../../page.module.css";
import { useSearchParams } from "next/navigation";

import LiftTable from "./LiftJobTable";
import ReceivingJobTable from "./ReceivingJobTable";
import ShippingTable from "./ShippingJobTable";
import WarehouseTable from "./warehouseTable";
import LookupProfilesTable from "./LookupProfilesJobTable";

export default function Jobs() {
  const searchParams = useSearchParams();

  const env = searchParams.get("env");

  if (!env) {
    throw new Error("ENV MISSING");
  }

  const currentEnv = env.toLocaleUpperCase();

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
      <WarehouseTable env={currentEnv} />
      <LiftTable env={currentEnv} />
      <ShippingTable env={currentEnv} />
      <ReceivingJobTable env={currentEnv} />
      <LookupProfilesTable env={currentEnv} />
      <ToastContainer env={currentEnv} />
    </main>
  );
}
