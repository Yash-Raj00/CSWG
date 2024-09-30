"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  selectAction,
  updateAction,
  ConnectToCassandra,
} from "../shippingJobActions";
import styles from "../../page.module.css";
import Row from "./shippingJobRow";

export default function ShippingTable({ env }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await ConnectToCassandra(env);
      const data = await selectAction();

      console.log("ShippingTable fetchData", data);

      setList(data);
      setLoading(false);
    };

    fetchData();
  }, [env]);

  const updateRow = async (row) => {
    // attempt to update db
    const result = await updateAction(row);

    if (!result) {
      toast.error("Failed to update row");
      return;
    }

    toast.success("Row updated");

    // update local state
    setList((prevList) =>
      prevList.map((item) =>
        item.job_id === row.job_id && item.warehouse_id === row.warehouse_id
          ? row
          : item
      )
    );
  };

  return (
    <main className={styles.streaming}>
      <h1>Shipping Job Control</h1>
      <table className={`${styles.table} ${styles.marginTop30}`}>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Warehouse ID</th>
            <th>Enabled</th>
            <th>update_time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((row) => (
            <Row
              row={row}
              updateRow={updateRow}
              key={`${row.job_id}${row.warehouse_id}`}
            />
          ))}
        </tbody>
      </table>
    </main>
  );
}
