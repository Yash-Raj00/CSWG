"use client";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import styles from "../../page.module.css";
import { useSearchParams } from "next/navigation";

import LiftTable from "./LiftJobTable";
import ReceivingJobTable from "./ReceivingJobTable";
import ShippingTable from "./ShippingJobTable";
import WarehouseTable from "./warehouseTable";

export default function Jobs() {
  const searchParams = useSearchParams();

  const env = searchParams.get("env");

  if (!env) {
    throw new Error("ENV MISSING");
  }

  const [currentEnv] = useState(env.toLocaleUpperCase());

  return (
    <main className={styles.streaming}>
      <WarehouseTable env={currentEnv} />
      <LiftTable env={currentEnv} />
      <ShippingTable env={currentEnv} />
      <ReceivingJobTable env={currentEnv} />
      <ToastContainer env={currentEnv} />
    </main>
  );
}
